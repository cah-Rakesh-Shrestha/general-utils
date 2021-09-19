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

interface IAmplitudeEvent {
    /**A readable ID specified by you. Must have a minimum length of 5 characters. Required unless device_id is present.  **/
    user_id: string;

    /**A device-specific identifier, such as the Identifier for Vendor on iOS. Required unless user_id is present. If a device_id is not sent with the event, it will be set to a hashed version of the user_id.  **/
    device_id: string;

    /**A unique identifier for your event.  **/
    event_type: string;

    /**The timestamp of the event in milliseconds since epoch. If time is not sent with the event, it will be set to the request upload time.  **/
    time?: number;

    /**A dictionary of key-value pairs that represent additional data to be sent along with the event. You can store property values in an array. Date values are transformed into string values. Object depth may not exceed 40 layers.  **/
    event_properties?: object;

    /**A dictionary of key-value pairs that represent additional data tied to the user. You can store property values in an array. Date values are transformed into string values. Object depth may not exceed 40 layers.  **/
    user_properties?: object;

    /**This feature is only available to Enterprise customers who have purchased the Accounts add-on. This field adds a dictionary of key-value pairs that represent groups of users to the event as an event-level group. Note: You can only track up to 5 unique group types and 10 total groups. Any groups past that threshold will not be tracked.  **/
    groups?: object;

    /**The current version of your application.  **/
    app_version?: string;

    /**Platform of the device.  **/
    platform?: string;

    /**The name of the mobile operating system or browser that the user is using.  **/
    os_name?: string;

    /**The version of the mobile operating system or browser the user is using.  **/
    os_version?: string;

    /**The device brand that the user is using.  **/
    device_brand?: string;

    /**The device manufacturer that the user is using.  **/
    device_manufacturer?: string;

    /**The device model that the user is using.  **/
    device_model?: string;

    /**The carrier that the user is using.  **/
    carrier?: string;

    /**The current country of the user.  **/
    country?: string;

    /**The current region of the user.  **/
    region?: string;

    /**The current city of the user.  **/
    city?: string;

    /**The current Designated Market Area of the user.  **/
    dma?: string;

    /**The language set by the user.  **/
    language?: string;

    /**The price of the item purchased. Required for revenue data if the revenue field is not sent. You can use negative values to indicate refunds.  **/
    price?: number;

    /**The quantity of the item purchased. Defaults to 1 if not specified.  **/
    quantity?: number;

    /**revenue = price * quantity. If you send all 3 fields of price, quantity, and revenue, then (price * quantity) will be used as the revenue value. You can use negative values to indicate refunds.  **/
    revenue?: number;

    /**An identifier for the item purchased. You must send a price and quantity or revenue with this field.  **/
    productId?: string;

    /**The type of revenue for the item purchased. You must send a price and quantity or revenue with this field.  **/
    revenueType?: string;

    /**The current Latitude of the user.  **/
    location_lat?: number;

    /**The current Longitude of the user.  **/
    location_lng?: number;

    /**The IP address of the user. Use "$remote" to use the IP address on the upload request. We will use the IP address to reverse lookup a user's location (city, country, region, and DMA). Amplitude has the ability to drop the location and IP address from events once it reaches our servers. You can submit a request to our platform specialist team here to configure this for you.  **/
    ip?: string;

    /**(iOS) Identifier for Advertiser.  **/
    idfa?: string;

    /**(iOS) Identifier for Vendor.  **/
    idfv?: string;

    /**(Android) Google Play Services advertising ID  **/
    adid?: string;

    /**(Android) Android ID (not the advertising ID)  **/
    android_id?: string;

    /**(Optional) An incrementing counter to distinguish events with the same user_id and timestamp from each other. We recommend you send an event_id, increasing over time, especially if you expect events to occur simultanenously.  **/
    event_id?: number;

    /**(Optional) The start time of the session in milliseconds since epoch (Unix Timestamp), necessary if you want to associate events with a particular system. A session_id of -1 is the same as no session_id specified.  **/
    session_id?: number;

    /**(Optional) A unique identifier for the event. We will deduplicate subsequent events sent with an insert_id we have already seen before within the past 7 days. We recommend generation a UUID or using some combination of device_id, user_id, event_type, event_id, and time.  **/
    insert_id?: string;
}

interface IAmplitudeOptions {
    /** Minimum permitted length for user_id & device_id fields */
    min_id_length?: number
}
interface IAmplitudeUploadRequestBody {
    /** Amplitude project API key */
    api_key: string;

    /** Array of Events to upload */
    events: [IAmplitudeEvent];

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
        var qs = _.reduce(obj, function (result: string, value: Object, key: string) {
            if (!_.isNull(value) && !_.isUndefined(value)) {
                if (_.isArray(value)) {
                    result += _.reduce(value, function (result1: string, value1: Object) {
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

    track = async (logEvent: IAmplitudeEvent) => {
        await this.call(
            AmplitudeServiceFunction.httpApi,
            this.stringify({
                api_key: this.apiKey,
                events: [logEvent]
            } as IAmplitudeUploadRequestBody)
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
        } as IAmplitudeEvent;
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
        } as IAmplitudeEvent;

        await this.analytics!.track(logEvent);
    }
}
