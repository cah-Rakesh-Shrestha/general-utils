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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXNlcnZpY2UtcHJveHktYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYi1zZXJ2aWNlLXByb3h5LWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx1REFBaUU7QUFFakUsaURBQXlEO0FBRXpELFlBQVksQ0FBQztBQU1iOztHQUVHO0FBQ0gsTUFBc0IsbUJBQW1CO0lBUXJDLFlBQ0ksV0FBd0IsRUFDeEIsUUFBZ0IsRUFDaEIsV0FBb0IsRUFDcEIsSUFBYSxFQUNiLFNBQXFCLE1BQU07UUFFM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFDekIsSUFBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7UUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxNQUFNLENBQUM7SUFDN0IsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxpQkFBaUIsQ0FBVSxlQUF1QjtRQUM5QyxPQUFPLENBQUMsU0FBa0IsRUFBb0IsRUFBRTtZQUM1QyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM1RCxDQUFDLENBQUM7SUFDTixDQUFDO0lBRUQsbURBQW1EO0lBQ25ELHlCQUF5QixDQUFpQixlQUF1QjtRQUM3RCxPQUFPLENBQUMsSUFBVyxFQUFFLFNBQWtCLEVBQW9CLEVBQUU7WUFDekQsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDdkQsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELG9EQUFvRDtJQUNwRCxlQUFlO1FBQ1gsT0FBTyxDQUFDLFNBQWtCLEVBQW9CLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxTQUFT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