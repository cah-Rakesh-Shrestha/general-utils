"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_framework_1 = require("errors-framework");
const v4_1 = __importDefault(require("uuid/v4"));
const web_service_proxy_base_1 = require("./web-service-proxy-base");
const log_proxy_1 = require("./log-proxy");
const _ = __importStar(require("lodash"));
var AmplitudeEventType;
(function (AmplitudeEventType) {
    AmplitudeEventType["identify"] = "$identify";
})(AmplitudeEventType || (AmplitudeEventType = {}));
var AmplitudeServiceFunction;
(function (AmplitudeServiceFunction) {
    AmplitudeServiceFunction["httpApi"] = "httpapi";
    AmplitudeServiceFunction["identify"] = "identify";
    AmplitudeServiceFunction["userMap"] = "usermap";
    AmplitudeServiceFunction["batchApi"] = "batch";
})(AmplitudeServiceFunction || (AmplitudeServiceFunction = {}));
class AmplitudeProxy extends web_service_proxy_base_1.WebServiceProxyBase {
    constructor(fetchMethod, host, apiKey) {
        super(fetchMethod, host);
        this.onNeedCallBody = (data) => {
            return data;
        };
        this.onNeedCallHeaders = () => {
            return {};
        };
        this.onNeedQueryString = (data) => {
            return typeof data === 'object' ? this.stringify(data) : data;
        };
        this.stringify = function (obj) {
            var qs = _.reduce(obj, function (result, value, key) {
                if (!_.isNull(value) && !_.isUndefined(value)) {
                    if (_.isArray(value)) {
                        result += _.reduce(value, function (result1, value1) {
                            if (!_.isNull(value1) && !_.isUndefined(value1)) {
                                result1 += key + '=' + value1 + '&';
                                return result1;
                            }
                            else {
                                return result1;
                            }
                        }, '');
                    }
                    else {
                        result += key + '=' + value + '&';
                    }
                    return result;
                }
                else {
                    return result;
                }
            }, '').slice(0, -1);
            return qs;
        };
        this.setAlias = (previousId, userId) => __awaiter(this, void 0, void 0, function* () {
            const mapping = {
                user_id: previousId,
                global_user_id: userId
            };
            yield this.call(AmplitudeServiceFunction.userMap, this.stringify({
                api_key: this.apiKey,
                mapping: JSON.stringify(mapping)
            }), undefined, {
                'Accept-Encoding': 'identity'
            });
        });
        this.identify = (deviceId, userId, userTraits) => __awaiter(this, void 0, void 0, function* () {
            const identification = {
                device_id: deviceId,
                user_id: userId,
                user_properties: {
                    $set: Object.assign({}, userTraits, { id: userId })
                },
                // IMP: Amplitude supports only 5 Groups. Also, the feature is available for enterprise users only
                groups: {
                    role: userTraits.roles
                }
                // TODO: We can retry analytics call in case of failure and we should use insert_id for de-duplication
                // insert_id: ''
            };
            yield this.call(AmplitudeServiceFunction.identify, this.stringify({
                api_key: this.apiKey,
                identification: JSON.stringify(identification)
            }), undefined, {
                'Accept-Encoding': 'identity'
            });
        });
        this.track = (logEvent) => __awaiter(this, void 0, void 0, function* () {
            yield this.call(AmplitudeServiceFunction.httpApi, this.stringify({
                api_key: this.apiKey,
                event: JSON.stringify(logEvent)
            }));
        });
        this.apiKey = apiKey;
    }
    onNeedCallHtmlResponse(htmlData) {
        if (htmlData && htmlData.indexOf('success') < 0) {
            throw new errors_framework_1.OpError(AmplitudeProxy.name, 'onNeedCallHtmlResponse', htmlData);
        }
        return htmlData;
    }
}
class AmplitudeLogProvider extends log_proxy_1.DefaultLogProvider {
    constructor() {
        super(...arguments);
        /**
         * This method associates two ids with each other.
         * It can also be used to link anonymousId with trackingId when available (for logged-in User)
         *
         * @param previousTrackingId : old_id
         * @param newTrackingId : new_id
         */
        this.setAlias = (previousTrackingId, newTrackingId) => __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized()) {
                throw new errors_framework_1.OpError(AmplitudeLogProvider.name, 'setAlias', 'Amplitude not Initialized');
            }
            yield this.analytics.setAlias(previousTrackingId, newTrackingId);
        });
        this.event = (deviceId, name, trackingId, additionalProps) => __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized()) {
                throw new errors_framework_1.OpError('AmplitudeLogProvider', 'event', 'Amplitude not Initialized');
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
            yield this.analytics.track(logEvent);
        });
        this.page = (deviceId, name, trackingId, additionalProps) => __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized()) {
                throw new errors_framework_1.OpError('AmplitudeLogProvider', 'page', 'Amplitude not Initialized');
            }
            const eventTimestamp = new Date().getTime();
            let logEvent = {
                device_id: deviceId,
                event_type: `Page ${name} loaded`,
                event_properties: Object.assign({}, additionalProps, { name }),
                time: eventTimestamp,
                session_id: additionalProps ? additionalProps.sessionId : undefined,
                user_id: trackingId
                // TODO: We can retry analytics call in case of failure and we should use insert_id for de-duplication
                // insert_id: ''
            };
            yield this.analytics.track(logEvent);
        });
    }
    init(fetchMethod, host, apiKey) {
        if (this.isInitialized())
            this.analytics = new AmplitudeProxy(fetchMethod, host, apiKey);
    }
    isInitialized() {
        return !this.analytics;
    }
    /**
     * Generates new AnonymousId
     */
    createAnonymousId() {
        return `${AmplitudeLogProvider.anonymousIdPrefix}${v4_1.default()}`;
    }
    /**
     * This method allows client to set the user identity and associate additional traits for that user.
     *
     * @param trackingId: string
     * @param userTraits: UserTraits : non ePHI info only. fqn is userFqn i.e. com.xyz.userId
     */
    processUserTraits(deviceId, trackingId, userTraits) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isInitialized()) {
                throw new errors_framework_1.OpError(AmplitudeLogProvider.name, 'processUserTraits', 'Amplitude not Initialized');
            }
            yield this.analytics.identify(deviceId, trackingId, userTraits);
        });
    }
}
AmplitudeLogProvider.anonymousIdPrefix = 'anonym:';
exports.AmplitudeLogProvider = AmplitudeLogProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGl0dWRlLWxvZy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpdHVkZS1sb2ctcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1REFBMkM7QUFDM0MsaURBQTJCO0FBQzNCLHFFQUE0RTtBQUM1RSwyQ0FBK0U7QUFDL0UsMENBQTRCO0FBRTVCLElBQUssa0JBRUo7QUFGRCxXQUFLLGtCQUFrQjtJQUNuQiw0Q0FBc0IsQ0FBQTtBQUMxQixDQUFDLEVBRkksa0JBQWtCLEtBQWxCLGtCQUFrQixRQUV0QjtBQUVELElBQUssd0JBS0o7QUFMRCxXQUFLLHdCQUF3QjtJQUN6QiwrQ0FBbUIsQ0FBQTtJQUNuQixpREFBcUIsQ0FBQTtJQUNyQiwrQ0FBbUIsQ0FBQTtJQUNuQiw4Q0FBa0IsQ0FBQTtBQUN0QixDQUFDLEVBTEksd0JBQXdCLEtBQXhCLHdCQUF3QixRQUs1QjtBQXFCRCxNQUFNLGNBQWUsU0FBUSw0Q0FBbUI7SUFHNUMsWUFBWSxXQUF3QixFQUFFLElBQVksRUFBRSxNQUFjO1FBQzlELEtBQUssQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFJN0IsbUJBQWMsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQzNCLE9BQU8sSUFBSSxDQUFDO1FBQ2hCLENBQUMsQ0FBQTtRQUVELHNCQUFpQixHQUFHLEdBQUcsRUFBRTtZQUNyQixPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQTtRQUVELHNCQUFpQixHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDOUIsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQTtRQUNqRSxDQUFDLENBQUE7UUFTRCxjQUFTLEdBQUcsVUFBVSxHQUFXO1lBQzdCLElBQUksRUFBRSxHQUFHLENBQUMs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