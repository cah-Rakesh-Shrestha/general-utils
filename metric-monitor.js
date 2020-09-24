"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
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
            const dataPointKey = `${type}/${name}`;
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
            yield this.serviceProxy.sync(this.metricDataActiveList, this.authToken);
            // Move wait list data over to active list and reset wait list
            this.metricDataActiveList = this.metricDataWaitList;
            this.metricDataWaitList = {};
            this.isSyncing = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLW1vbml0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRyaWMtbW9uaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7R0FTRztBQUNILDBDQUE0QjtBQUM1Qix1REFBMkM7QUFDM0MscUVBQTRFO0FBRTVFLHVCQUF1QjtBQUN2QixNQUFNLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxDQUFDLFdBQVc7QUFFaEQsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3RCLCtCQUFhLENBQUE7SUFDYixtQ0FBaUIsQ0FBQTtJQUNqQiwyQ0FBeUIsQ0FBQTtBQUM3QixDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7QUFxQkQsTUFBYSxhQUFhO0lBQTFCO1FBSVkseUJBQW9CLEdBQWtCLEVBQUUsQ0FBQztRQUN6Qyx1QkFBa0IsR0FBa0IsRUFBRSxDQUFDO1FBQ3ZDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsaUJBQVksR0FBVyxxQkFBcUIsQ0FBQztRQWtDckQsaUJBQVksR0FBRyxDQUFDLFNBQWlCLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMvQixDQUFDLENBQUE7UUFFRCxVQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFO1lBQzNDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUN0QixNQUFNLElBQUksMEJBQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2FBQ25GO1lBRUQsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLElBQUksSUFBSSxFQUFFLENBQUM7WUFDdkMsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztZQUV6QyxpQkFBaUI7WUFDakIsSUFBSSxJQUFJLENBQUMs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