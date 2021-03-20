"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplitudeLogProvider = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW1wbGl0dWRlLWxvZy1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFtcGxpdHVkZS1sb2ctcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHVEQUEyQztBQUMzQyxpREFBMkI7QUFDM0IscUVBQTRFO0FBQzVFLDJDQUErRTtBQUMvRSwwQ0FBNEI7QUFFNUIsSUFBSyxrQkFFSjtBQUZELFdBQUssa0JBQWtCO0lBQ25CLDRDQUFzQixDQUFBO0FBQzFCLENBQUMsRUFGSSxrQkFBa0IsS0FBbEIsa0JBQWtCLFFBRXRCO0FBRUQsSUFBSyx3QkFLSjtBQUxELFdBQUssd0JBQXdCO0lBQ3pCLCtDQUFtQixDQUFBO0lBQ25CLGlEQUFxQixDQUFBO0lBQ3JCLCtDQUFtQixDQUFBO0lBQ25CLDhDQUFrQixDQUFBO0FBQ3RCLENBQUMsRUFMSSx3QkFBd0IsS0FBeEIsd0JBQXdCLFFBSzVCO0FBcUJELE1BQU0sY0FBZSxTQUFRLDRDQUFtQjtJQUc1QyxZQUFZLFdBQXdCLEVBQUUsSUFBWSxFQUFFLE1BQWM7UUFDOUQsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUk3QixtQkFBYyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsR0FBRyxFQUFFO1lBQ3JCLE9BQU8sRUFBRSxDQUFDO1FBQ2QsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM5QixPQUFPLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQ2pFLENBQUMsQ0FBQTtRQVNELGNBQVMsR0FBRyxVQUFVLEdBQVc7WUFDN0IsSUFBSSxF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