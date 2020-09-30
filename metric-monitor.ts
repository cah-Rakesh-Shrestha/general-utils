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
import * as _ from "lodash";
import { OpError } from "errors-framework";
import { FetchMethod, WebServiceProxyBase } from "./web-service-proxy-base";

/** Specify defaults */
const DEFAULT_SYNC_INTERVAL = 60000; // 1 minute

export enum MetricDataType {
    User = 'User',
    ApiApp = 'ApiApp',
    PatientApp = 'PatientApp'
}

export type MetricData = {
    /**
     * type of data (events) being monitored: User, ApiApp, PatientApp
     */
    type: MetricDataType;

    /**
     * name of event, eg UserLoginDone
     */
    name: string;

    /**
     * time of this event in milliseconds
     */
    timestamp: number;
}

export type MetricDataSet = _.Dictionary<number>;

export class MetricMonitor {
    private serviceProxy?: MetricServiceProxy;
    private authToken?: string;

    private metricDataActiveList: MetricDataSet = {};
    private metricDataWaitList: MetricDataSet = {};
    private isSyncing: boolean = false;
    private syncInterval: number = DEFAULT_SYNC_INTERVAL;


    init(fetchMethod: FetchMethod, host: string, syncInterval?: number) {
        if (this.isInitialized()) {
            this.serviceProxy = new MetricServiceProxy(fetchMethod, host);
        }

        // Overwite sync interval if set
        if (syncInterval) {
            this.syncInterval = syncInterval;
        }

        setInterval(async () => await this.sync(), this.syncInterval);
    }

    private isInitialized() {
        return !this.serviceProxy;
    }

    private async sync() {
        if (!this.authToken || Object.keys(this.metricDataActiveList).length === 0) {
            return;
        }
        this.isSyncing = true;
        try {
            await this.serviceProxy!.sync(this.metricDataActiveList, this.authToken);

            // Move wait list data over to active list and reset wait list
            this.metricDataActiveList = this.metricDataWaitList;
            this.metricDataWaitList = {}

        } catch (e) {
            throw new OpError(MetricMonitor.name, 'sync', e)

        } finally {
            this.isSyncing = false;
        }
    }

    setAuthToken = (authToken: string) => {
        this.authToken = authToken;
    }

    event = (name: string, type: MetricDataType) => {
        if (this.isInitialized()) {
            throw new OpError(MetricMonitor.name, 'event', 'MetricMonitor not Initialized');
        }

        const dataPointKey = `${type}/${encodeURIComponent(name)}`;
        const dataPointValue = Date.now() / 1000;

        // add this event
        if (this.isSyncing) {
            this.metricDataWaitList[dataPointKey] = dataPointValue;

        } else {
            this.metricDataActiveList[dataPointKey] = dataPointValue;

        }
    }

}

class MetricServiceProxy extends WebServiceProxyBase {

    constructor(fetchMethod: FetchMethod, host: string) {
        super(fetchMethod, host);
    }

    onNeedCallBody = (data: any) => {
        return data;
    }

    onNeedCallHeaders = (authToken: string) => {
        return { 'Authorization': `Bearer ${authToken}` }
    }

    onNeedQueryString = (data: any) => {
        return typeof data === 'object' ? this.stringify(data) : data
    }

    onNeedCallHtmlResponse(htmlData?: string) {
        if (htmlData && htmlData.indexOf('success') < 0) {
            throw new OpError(MetricServiceProxy.name, 'onNeedCallHtmlResponse', htmlData)
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

    sync = async (metricData: MetricDataSet, authToken: string) => {
        await this.call(
            '',
            { "data": metricData },
            authToken
        );
    }
}

