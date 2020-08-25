import { OpError } from 'errors-framework';
import uuid from 'uuid/v4';
import { WebServiceProxyBase, FetchMethod } from './web-service-proxy-base';
import { UserTraits, DefaultLogProvider, IEventProperties } from './log-proxy';
import * as _ from 'lodash';

enum AmplitudeEventType {
    identify = '$identify'
}

enum AmplitudeServiceFunction {
    httpApi = 'httpapi',
    identify = 'identify',
    userMap = 'usermap',
    batchApi = 'batch'
}

interface IAmplitudeOptionalProperties extends IEventProperties {
    /**
     * An incrementing counter to distinguish events with the same user_id and timestamp from each other.
     */
    eventId?: number;
    /**
     * The start time of the session in milliseconds since epoch (Unix Timestamp), 
     * necessary if you want to associate events with a particular session 
     * (a session_id of -1 implies that you not sending a session_id, and so no session metrics will be tracked)
     */
    sessionId?: number;

    /**
     * A unique identifier for the event being inserted; we will deduplicate subsequent events sent with an insert_id we have already seen before within the past 7 days. 
     * Some combination of device_id, user_id, session_id, event_type, and event_id or time, would likely serve as a sufficient insert_id value.
     */
    insertId?: string;
}

class AmplitudeProxy extends WebServiceProxyBase {
    private apiKey: string;

    constructor(fetchMethod: FetchMethod, host: string, apiKey: string) {
        super(fetchMethod, host);
        this.apiKey = apiKey;
    }

    onNeedCallBody = (data: any) => {
        return data;
    }

    onNeedCallHeaders = () => {
        return {};
    }

    onNeedQueryString = (data: any) => {
        return typeof data === 'object' ? this.stringify(data) : data
    }

    onNeedCallHtmlResponse(htmlData?: string) {
        if (htmlData && htmlData.indexOf('success') < 0) {
            throw new OpError(AmplitudeProxy.name, 'onNeedCallHtmlResponse', htmlData)
        }
        return htmlData;
    }

    stringify = function (obj: Object) {
        var qs = _.reduce(obj, function (result, value, key) {
            if (!_.isNull(value) && !_.isUndefined(value)) {
                if (_.isArray(value)) {
                    result += _.reduce(value, function (result1, value1) {
                        if (!_.isNull(value1) && !_.isUndefined(value1)) {
                            result1 += key + '=' + value1 + '&';
                            return result1
                        } else {
                            return result1;
                        }
                    }, '')
                } else {
                    result += key + '=' + value + '&';
                }
                return result;
            } else {
                return result
            }
        }, '').slice(0, -1);
        return qs;
    };

    setAlias = async (previousId: string, userId: string) => {
        const mapping = {
            user_id: previousId,
            global_user_id: userId
        };

        await this.call(
            AmplitudeServiceFunction.userMap,
            this.stringify({
                api_key: this.apiKey,
                mapping: JSON.stringify(mapping)
            }),
            undefined,
            {
                'Accept-Encoding': 'identity'
            }
        );
    }

    identify = async (deviceId: string, userId: string, userTraits: UserTraits) => {
        const identification = {
            device_id: deviceId,
            user_id: userId,
            user_properties: {
                $set: {
                    ...userTraits,
                    id: userId
                }
            },
            // IMP: Amplitude supports only 5 Groups. Also, the feature is available for enterprise users only
            groups: {
                role: userTraits.roles
            }
            // TODO: We can retry analytics call in case of failure and we should use insert_id for de-duplication
            // insert_id: ''
        };

        await this.call(
            AmplitudeServiceFunction.identify,
            this.stringify({
                api_key: this.apiKey,
                identification: JSON.stringify(identification)
            }),
            undefined,
            {
                'Accept-Encoding': 'identity'
            }
        );
    }

    track = async (logEvent: any) => {
        await this.call(
            AmplitudeServiceFunction.httpApi,
            this.stringify({
                api_key: this.apiKey,
                event: JSON.stringify(logEvent)
            })
        );
    }
}

export class AmplitudeLogProvider extends DefaultLogProvider {
    private analytics?: AmplitudeProxy;
    private static readonly anonymousIdPrefix = 'anonym:';

    init(fetchMethod: FetchMethod, host: string, apiKey: string) {
        if (this.isInitialized())
            this.analytics = new AmplitudeProxy(fetchMethod, host, apiKey);
    }

    private isInitialized() {
        return !this.analytics;
    }

    /**
     * Generates new AnonymousId
     */
    createAnonymousId(): string {
        return `${AmplitudeLogProvider.anonymousIdPrefix}${uuid()}`;
    }

    /**
     * This method associates two ids with each other.
     * It can also be used to link anonymousId with trackingId when available (for logged-in User)
     * 
     * @param previousTrackingId : old_id
     * @param newTrackingId : new_id
     */
    setAlias = async (previousTrackingId: string, newTrackingId: string) => {
        if (this.isInitialized()) {
            throw new OpError(AmplitudeLogProvider.name, 'setAlias', 'Amplitude not Initialized');
        }

        await this.analytics!.setAlias(previousTrackingId, newTrackingId);
    }

    /**
     * This method allows client to set the user identity and associate additional traits for that user.
     * 
     * @param trackingId: string
     * @param userTraits: UserTraits : non ePHI info only. fqn is userFqn i.e. com.xyz.userId
     */
    async processUserTraits(deviceId: string, trackingId: string, userTraits: UserTraits) {
        if (this.isInitialized()) {
            throw new OpError(AmplitudeLogProvider.name, 'processUserTraits', 'Amplitude not Initialized');
        }

        await this.analytics!.identify(deviceId, trackingId, userTraits);
    }

    event = async (deviceId: string, name: string, trackingId?: string, additionalProps?: IAmplitudeOptionalProperties) => {
        if (this.isInitialized()) {
            throw new OpError('AmplitudeLogProvider', 'event', 'Amplitude not Initialized');
        }

        const eventTimestamp = new Date().getTime();
        let logEvent = {
            device_id: deviceId,
            event_type: name,
            event_properties: additionalProps,
            time: eventTimestamp,
            session_id: additionalProps ? additionalProps.sessionId : undefined,
            user_id: trackingId
            // TODO: We can retry analytics call in case of failure and we should use insert_id for de-duplication
            // insert_id: ''
        };
        await this.analytics!.track(logEvent);
    }

    page = async (deviceId: string, name: string, trackingId?: string, additionalProps?: IAmplitudeOptionalProperties) => {
        if (this.isInitialized()) {
            throw new OpError('AmplitudeLogProvider', 'page', 'Amplitude not Initialized');
        }

        const eventTimestamp = new Date().getTime();
        let logEvent = {
            device_id: deviceId,
            event_type: `Page ${name} loaded`,
            event_properties: { ...additionalProps, ...{ name } },
            time: eventTimestamp,
            session_id: additionalProps ? additionalProps.sessionId : undefined,
            user_id: trackingId
            // TODO: We can retry analytics call in case of failure and we should use insert_id for de-duplication
            // insert_id: ''
        };

        await this.analytics!.track(logEvent);
    }
}
