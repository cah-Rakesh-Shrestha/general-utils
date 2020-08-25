"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
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
                    $set: Object.assign(Object.assign({}, userTraits), { id: userId })
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
                event_properties: Object.assign(Object.assign({}, additionalProps), { name }),
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
exports.AmplitudeLogProvider = AmplitudeLogProvider;
AmplitudeLogProvider.anonymousIdPrefix = 'anonym:';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGl0dWRlLWxvZy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpdHVkZS1sb2ctcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsdURBQTJDO0FBQzNDLGlEQUEyQjtBQUMzQixxRUFBNEU7QUFDNUUsMkNBQStFO0FBQy9FLDBDQUE0QjtBQUU1QixJQUFLLGtCQUVKO0FBRkQsV0FBSyxrQkFBa0I7SUFDbkIsNENBQXNCLENBQUE7QUFDMUIsQ0FBQyxFQUZJLGtCQUFrQixLQUFsQixrQkFBa0IsUUFFdEI7QUFFRCxJQUFLLHdCQUtKO0FBTEQsV0FBSyx3QkFBd0I7SUFDekIsK0NBQW1CLENBQUE7SUFDbkIsaURBQXFCLENBQUE7SUFDckIsK0NBQW1CLENBQUE7SUFDbkIsOENBQWtCLENBQUE7QUFDdEIsQ0FBQyxFQUxJLHdCQUF3QixLQUF4Qix3QkFBd0IsUUFLNUI7QUFxQkQsTUFBTSxjQUFlLFNBQVEsNENBQW1CO0lBRzVDLFlBQVksV0FBd0IsRUFBRSxJQUFZLEVBQUUsTUFBYztRQUM5RCxLQUFLLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBSTdCLG1CQUFjLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUMzQixPQUFPLElBQUksQ0FBQztRQUNoQixDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxHQUFHLEVBQUU7WUFDckIsT0FBTyxFQUFFLENBQUM7UUFDZCxDQUFDLENBQUE7UUFFRCxzQkFBaUIsR0FBRyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQzlCLE9BQU8sT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUE7UUFDakUsQ0FBQyxDQUFBO1FBU0QsY0FBUyxHQUFHLFVBQVUsR0FBVztZQUM3QixJQUFJLEVBQUUsR0FBRyxDQUFD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