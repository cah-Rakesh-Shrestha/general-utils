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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetricMonitor = exports.MetricDataType = void 0;
/**
 * Metrics data is collected via MonitorDataPoint.event() method
 * data is converted to timeSeriesData point and stored into
 * metricDataActiveList if isSyncing is false
 * metricDataWaitList if isSyncing is true
 *
 * MonitorDataPoint.sync() method is invoked at set interval to send data
 * to service api which parses and sends them to GoogleCloud
 *
 */
const _ = __importStar(require("lodash"));
const errors_framework_1 = require("errors-framework");
const web_service_proxy_base_1 = require("./web-service-proxy-base");
/** Specify defaults */
const DEFAULT_SYNC_INTERVAL = 60000; // 1 minute
var MetricDataType;
(function (MetricDataType) {
    MetricDataType["User"] = "User";
    MetricDataType["ApiApp"] = "ApiApp";
    MetricDataType["PatientApp"] = "PatientApp";
})(MetricDataType = exports.MetricDataType || (exports.MetricDataType = {}));
class MetricMonitor {
    constructor() {
        this.metricDataActiveList = {};
        this.metricDataWaitList = {};
        this.isSyncing = false;
        this.syncInterval = DEFAULT_SYNC_INTERVAL;
        this.setAuthToken = (authToken) => {
            this.authToken = authToken;
        };
        this.event = (name, type) => {
            if (this.isInitialized()) {
                throw new errors_framework_1.OpError(MetricMonitor.name, 'event', 'MetricMonitor not Initialized');
            }
            const dataPointKey = `${type}/${encodeURIComponent(name)}`;
            const dataPointValue = Date.now() / 1000;
            // add this event
            if (this.isSyncing) {
                this.metricDataWaitList[dataPointKey] = dataPointValue;
            }
            else {
                this.metricDataActiveList[dataPointKey] = dataPointValue;
            }
        };
    }
    init(fetchMethod, host, syncInterval) {
        if (this.isInitialized()) {
            this.serviceProxy = new MetricServiceProxy(fetchMethod, host);
        }
        // Overwite sync interval if set
        if (syncInterval) {
            this.syncInterval = syncInterval;
        }
        setInterval(() => __awaiter(this, void 0, void 0, function* () { return yield this.sync(); }), this.syncInterval);
    }
    isInitialized() {
        return !this.serviceProxy;
    }
    sync() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.authToken || Object.keys(this.metricDataActiveList).length === 0) {
                return;
            }
            this.isSyncing = true;
            try {
                yield this.serviceProxy.sync(this.metricDataActiveList, this.authToken);
                // Move wait list data over to active list and reset wait list
                this.metricDataActiveList = this.metricDataWaitList;
                this.metricDataWaitList = {};
            }
            catch (e) {
                throw new errors_framework_1.OpError(MetricMonitor.name, 'sync', e);
            }
            finally {
                this.isSyncing = false;
            }
        });
    }
}
exports.MetricMonitor = MetricMonitor;
class MetricServiceProxy extends web_service_proxy_base_1.WebServiceProxyBase {
    constructor(fetchMethod, host) {
        super(fetchMethod, host);
        this.onNeedCallBody = (data) => {
            return data;
        };
        this.onNeedCallHeaders = (authToken) => {
            return { 'Authorization': `Bearer ${authToken}` };
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
        this.sync = (metricData, authToken) => __awaiter(this, void 0, void 0, function* () {
            yield this.call('', { "data": metricData }, authToken);
        });
    }
    onNeedCallHtmlResponse(htmlData) {
        if (htmlData && htmlData.indexOf('success') < 0) {
            throw new errors_framework_1.OpError(MetricServiceProxy.name, 'onNeedCallHtmlResponse', htmlData);
        }
        return htmlData;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLW1vbml0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRyaWMtbW9uaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7OztHQVNHO0FBQ0gsMENBQTRCO0FBQzVCLHVEQUEyQztBQUMzQyxxRUFBNEU7QUFFNUUsdUJBQXVCO0FBQ3ZCLE1BQU0scUJBQXFCLEdBQUcsS0FBSyxDQUFDLENBQUMsV0FBVztBQUVoRCxJQUFZLGNBSVg7QUFKRCxXQUFZLGNBQWM7SUFDdEIsK0JBQWEsQ0FBQTtJQUNiLG1DQUFpQixDQUFBO0lBQ2pCLDJDQUF5QixDQUFBO0FBQzdCLENBQUMsRUFKVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQUl6QjtBQXFCRCxNQUFhLGFBQWE7SUFBMUI7UUFJWSx5QkFBb0IsR0FBa0IsRUFBRSxDQUFDO1FBQ3pDLHVCQUFrQixHQUFrQixFQUFFLENBQUM7UUFDdkMsY0FBUyxHQUFZLEtBQUssQ0FBQztRQUMzQixpQkFBWSxHQUFXLHFCQUFxQixDQUFDO1FBd0NyRCxpQkFBWSxHQUFHLENBQUMsU0FBaUIsRUFBRSxFQUFFO1lBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1FBQy9CLENBQUMsQ0FBQTtRQUVELFVBQUssR0FBRyxDQUFDLElBQVksRUFBRSxJQUFvQixFQUFFLEVBQUU7WUFDM0MsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUU7Z0JBQ3RCLE1BQU0sSUFBSSwwQkFBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLCtCQUErQixDQUFDLENBQUM7YUFDbkY7WUFFRCxNQUFNLFlBQVksR0FBRyxHQUFHLElBQUksSUFBSSxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzNELE1BQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFFekMsaUJBQWlCO1lBQ2pCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtnQkFDaEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFlBQVksQ0FBQyxHQUFHLGNBQWMsQ0FBQzthQUUxRDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLEdBQUcsY0FBYyxDQUFDO2FBRTVEO1FBQ0wsQ0FBQyxDQUFBO0lBRUwsQ0FBQztJQTNERyxJQUFJLENBQUMsV0FBd0IsRUFBRSxJQUFZLEVBQUUsWUFBcUI7UUFDOUQsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDdEIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLGtCQUFrQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUNqRTtRQUVELGdDQUFnQztRQUNoQyxJQUFJLFlBQVksRUFBRTtZQUNkLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1NBQ3BDO1FBRUQsV0FBVyxDQUFDLEdBQVMsRUFBRSxnREFBQyxPQUFBLE1BQU0sSUFBSSxDQUFDLElBQUksRUFBRSxDQUFBLEdBQUEsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDbEUsQ0FBQztJQUVPLGFBQWE7UUFDakIsT0FBTyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUM7SUFDOUIsQ0FBQztJQUVhLElBQUk7O1lBQ2QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUN4RSxPQUFPO2FBQ1Y7WUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJO2dCQUNBLE1BQU0sSUFBSSxDQUFDLFlBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFekUsOERBQThEO2dCQUM5RCxJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDO2dCQUNwRCxJQUFJLENBQUMsa0JBQWtCLEdBQUcsRUFBRSxDQUFBO2FBRS9CO1lBQUMsT0FBTyxDQUFDLEVBQUU7Z0JBQ1IsTUFBTSxJQUFJLDBCQUFPLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUE7YUFFbkQ7b0JBQVM7Z0JBQ04sSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7YUFDMUI7UUFDTCxDQUFDO0tBQUE7Q0F3Qko7QUFyRUQsc0NBcUVDO0FBRUQsTUFBTSxrQkFBbUIsU0FBUSw0Q0FBbUI7SUFFaEQsWUFBWSxXQUF3QixFQUFFLElBQVk7UUFDOUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUc3QixtQkFBYyxHQUFHLENBQUMsSUFBUyxFQUFFLEVBQUU7WUFDM0IsT0FBTyxJQUFJLENBQUM7UUFDaEIsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsQ0FBQyxTQUFpQixFQUFFLEVBQUU7WUFDdEMsT0FBTyxFQUFFLGVBQWUsRUFBRSxVQUFVLFNBQVMsRUFBRSxFQUFFLENBQUE7UUFDckQsQ0FBQyxDQUFBO1FBRUQsc0JBQWlCLEdBQUcsQ0FBQyxJQUFTLEVBQUUsRUFBRTtZQUM5QixPQUFPLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFBO1FBQ2pFLENBQUMsQ0FBQTtRQVNELGNBQVMsR0FBRyxVQUFVLEdBQVc7WUFDN0IsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxNQUFjLEVBQUUsS0FBYSxFQUFFLEdBQVc7Z0JBQ3ZFLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtvQkFDM0MsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO3dCQUNsQixNQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsVUFBVSxPQUFlLEVBQUUsTUFBYzs0QkFDL0QsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2dDQUM3QyxPQUFPLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLEdBQUcsR0FBRyxDQUFDO2dDQUNwQyxPQUFPLE9BQU8sQ0FBQTs2QkFDakI7aUNBQU07Z0NBQ0gsT0FBTyxPQUFPLENBQUM7NkJBQ2xCO3dCQUNMLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtxQkFDVDt5QkFBTTt3QkFDSCxNQUFNLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxLQUFLLEdBQUcsR0FBRyxDQUFDO3FCQUNyQztvQkFDRCxPQUFPLE1BQU0sQ0FBQztpQkFDakI7cUJBQU07b0JBQ0gsT0FBTyxNQUFNLENBQUE7aUJBQ2hCO1lBQ0wsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQixPQUFPLEVBQUUsQ0FBQztRQUNkLENBQUMsQ0FBQztRQUVGLFNBQUksR0FBRyxDQUFPLFVBQXlCLEVBQUUsU0FBaUIsRUFBRSxFQUFFO1lBQzFELE1BQU0sSUFBSSxDQUFDLElBQUksQ0FDWCxFQUFFLEVBQ0YsRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQ3RCLFNBQVMsQ0FDWixDQUFDO1FBQ04sQ0FBQyxDQUFBLENBQUE7SUFsREQsQ0FBQztJQWNELHNCQUFzQixDQUFDLFFBQWlCO1FBQ3BDLElBQUksUUFBUSxJQUFJLFFBQVEsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdDLE1BQU0sSUFBSSwwQkFBTyxDQUFDLGtCQUFrQixDQUFDLElBQUksRUFBRSx3QkFBd0IsRUFBRSxRQUFRLENBQUMsQ0FBQTtTQUNqRjtRQUNELE9BQU8sUUFBUSxDQUFDO0lBQ3BCLENBQUM7Q0FnQ0oifQ==