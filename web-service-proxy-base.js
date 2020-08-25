"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_framework_1 = require("errors-framework");
const date_reviver_1 = require("./date-reviver");
"use strict";
/**
 * Base class for Remote Service Proxies
 */
class WebServiceProxyBase {
    constructor(fetchMethod, hostName, serviceName, port, method = "POST") {
        this.fetchMethod = fetchMethod;
        this.hostName = hostName;
        this.serviceName = serviceName;
        this.port = port;
        this.callMethod = method;
    }
    /** Creates a new proxy method that accepts no data */
    createProxyMethod(serviceFunction) {
        return (authToken) => {
            return this.call(serviceFunction, undefined, authToken);
        };
    }
    /** Creates a new proxy method that accepts data */
    createProxyMethodWithData(serviceFunction) {
        return (data, authToken) => {
            return this.call(serviceFunction, data, authToken);
        };
    }
    /** Creates a new proxy call that accepts no data */
    createProxyCall() {
        return (authToken) => {
            return this.call(undefined, undefined, authToken);
        };
    }
    /** Creates a new proxy call that accepts data */
    createProxyCallWithData() {
        return (data, authToken) => {
            return this.call(undefined, data, authToken);
        };
    }
    /**
     * For remote HTTP calls where an text/html response is expected. This method should be overridden.
     * ScalaMed APIs do not return HTML response hence by default exception is thrown.
     */
    onNeedCallHtmlResponse(htmlData) {
        throw new errors_framework_1.OpError("WebServiceProxyBase", "call", "Invalid HTML response received", htmlData);
    }
    call(serviceFunction, data, authToken, header) {
        return __awaiter(this, void 0, void 0, function* () {
            let uri = `${this.hostName}${this.port ? ":" + this.port : ""}${serviceFunction ? `/${this.serviceName ? this.serviceName + "." : ""}${serviceFunction}` : ""}`;
            let options;
            if (this.callMethod === "GET") {
                const queryParams = this.onNeedQueryString(data) || "";
                uri += queryParams ? `?${queryParams}` : "";
                options = {
                    method: this.callMethod
                };
            }
            else {
                const headers = header ? header : this.onNeedCallHeaders(authToken);
                const body = this.onNeedCallBody(data) || "";
                const isObject = typeof body === "object";
                headers["Content-Type"] = isObject
                    ? "application/json; charset=utf-8"
                    : "text/plain; charset=utf-8";
                options = {
                    method: this.callMethod,
                    headers,
                    body: isObject ? JSON.stringify(body) : body.toString(),
                    timeout: 60000
                };
            }
            const result = yield this.fetchMethod(uri, options);
            const contentType = result.headers.get("Content-Type").toLowerCase();
            let resultValue;
            if (contentType.includes("text/plain") ||
                contentType.includes("text/html")) {
                resultValue = yield result.text();
            }
            else {
                let resultValueText;
                try {
                    resultValueText = yield result.text();
                    resultValue = date_reviver_1.reviveDatesInProperties(JSON.parse(resultValueText));
                }
                catch (e) {
                    if (resultValueText) {
                        throw e;
                    }
                    else {
                        resultValue = undefined; // NOTE: turning result to text return empty string for an undefined body
                    }
                }
            }
            if (resultValue && resultValue.__error) {
                if (resultValue.__error.type === errors_framework_1.ErrorType.user) {
                    throw new errors_framework_1.UserError(resultValue.__error.category, resultValue.__error.details, resultValue.__error.debugInfo);
                }
                throw new errors_framework_1.OpError("WebServiceProxyBase", "call", resultValue.__error);
            }
            else if (resultValue && contentType.includes("text/html")) {
                this.onNeedCallHtmlResponse(resultValue);
            }
            else {
                return resultValue;
            }
        });
    }
}
exports.WebServiceProxyBase = WebServiceProxyBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXNlcnZpY2UtcHJveHktYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYi1zZXJ2aWNlLXByb3h5LWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHVEQUFpRTtBQUVqRSxpREFBeUQ7QUFFekQsWUFBWSxDQUFDO0FBTWI7O0dBRUc7QUFDSCxNQUFzQixtQkFBbUI7SUFRckMsWUFDSSxXQUF3QixFQUN4QixRQUFnQixFQUNoQixXQUFvQixFQUNwQixJQUFhLEVBQ2IsU0FBcUIsTUFBTTtRQUUzQixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUN6QixJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztRQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztJQUM3QixDQUFDO0lBRUQsc0RBQXNEO0lBQ3RELGlCQUFpQixDQUFVLGVBQXVCO1FBQzlDLE9BQU8sQ0FBQyxTQUFrQixFQUFvQixFQUFFO1lBQzVDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQzVELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxtREFBbUQ7SUFDbkQseUJBQXlCLENBQWlCLGVBQXVCO1FBQzdELE9BQU8sQ0FBQyxJQUFXLEVBQUUsU0FBa0IsRUFBb0IsRUFBRTtZQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN2RCxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsb0RBQW9EO0lBQ3BELGVBQWU7UUFDWCxPQUFPLENBQUMsU0FBa0IsRUFBb0IsRUFBRTtZQUM1QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFNBQVMs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