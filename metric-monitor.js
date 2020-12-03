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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWV0cmljLW1vbml0b3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtZXRyaWMtbW9uaXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7R0FTRztBQUNILDBDQUE0QjtBQUM1Qix1REFBMkM7QUFDM0MscUVBQTRFO0FBRTVFLHVCQUF1QjtBQUN2QixNQUFNLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxDQUFDLFdBQVc7QUFFaEQsSUFBWSxjQUlYO0FBSkQsV0FBWSxjQUFjO0lBQ3RCLCtCQUFhLENBQUE7SUFDYixtQ0FBaUIsQ0FBQTtJQUNqQiwyQ0FBeUIsQ0FBQTtBQUM3QixDQUFDLEVBSlcsY0FBYyxHQUFkLHNCQUFjLEtBQWQsc0JBQWMsUUFJekI7QUFxQkQsTUFBYSxhQUFhO0lBQTFCO1FBSVkseUJBQW9CLEdBQWtCLEVBQUUsQ0FBQztRQUN6Qyx1QkFBa0IsR0FBa0IsRUFBRSxDQUFDO1FBQ3ZDLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsaUJBQVksR0FBVyxxQkFBcUIsQ0FBQztRQXdDckQsaUJBQVksR0FBRyxDQUFDLFNBQWlCLEVBQUUsRUFBRTtZQUNqQyxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMvQixDQUFDLENBQUE7UUFFRCxVQUFLLEdBQUcsQ0FBQyxJQUFZLEVBQUUsSUFBb0IsRUFBRSxFQUFFO1lBQzNDLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRSxFQUFFO2dCQUN0QixNQUFNLElBQUksMEJBQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSwrQkFBK0IsQ0FBQyxDQUFDO2FBQ25GO1lBRUQsTUFBTSxZQUFZLEdBQUcsR0FBRyxJQUFJLElBQUksa0JBQWtCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQztZQUMzRCxNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBRXpDLGlCQUFpQjtZQUNq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
