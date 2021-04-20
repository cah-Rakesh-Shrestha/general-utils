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
exports.WebServiceProxyBase = void 0;
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
                throw new errors_framework_1.OpError(WebServiceProxyBase.name, "call", resultValue.__error);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXNlcnZpY2UtcHJveHktYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYi1zZXJ2aWNlLXByb3h5LWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdURBQTJDO0FBRTNDLGlEQUF5RDtBQUV6RCxZQUFZLENBQUM7QUFNYjs7R0FFRztBQUNILE1BQXNCLG1CQUFtQjtJQVFyQyxZQUNJLFdBQXdCLEVBQ3hCLFFBQWdCLEVBQ2hCLFdBQW9CLEVBQ3BCLElBQWEsRUFDYixTQUFxQixNQUFNO1FBRTNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxzREFBc0Q7SUFDdEQsaUJBQWlCLENBQVUsZUFBdUI7UUFDOUMsT0FBTyxDQUFDLFNBQWtCLEVBQW9CLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELG1EQUFtRDtJQUNuRCx5QkFBeUIsQ0FBaUIsZUFBdUI7UUFDN0QsT0FBTyxDQUFDLElBQVcsRUFBRSxTQUFrQixFQUFvQixFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsZUFBZTtRQUNYLE9BQU8sQ0FBQyxTQUFrQixFQUFvQixFQUFFO1lBQzVDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FB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