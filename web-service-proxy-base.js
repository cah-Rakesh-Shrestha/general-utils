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
    call(serviceFunction, data, authToken, header, method) {
        return __awaiter(this, void 0, void 0, function* () {
            method = method || this.callMethod;
            let uri = `${this.hostName}${this.port ? ":" + this.port : ""}${serviceFunction ? `/${this.serviceName ? this.serviceName + "." : ""}${serviceFunction}` : ""}`;
            let options;
            if (method === "GET") {
                const headers = header ? header : this.onNeedCallHeaders(authToken);
                const queryParams = this.onNeedQueryString(data) || "";
                uri += queryParams ? `?${queryParams}` : "";
                options = {
                    method,
                    headers
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
                    method,
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
            if (resultValue && resultValue.error) {
                throw resultValue.error;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLXNlcnZpY2UtcHJveHktYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndlYi1zZXJ2aWNlLXByb3h5LWJhc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsdURBQTJDO0FBRTNDLGlEQUF5RDtBQUV6RCxZQUFZLENBQUM7QUFNYjs7R0FFRztBQUNILE1BQXNCLG1CQUFtQjtJQVFyQyxZQUNJLFdBQXdCLEVBQ3hCLFFBQWdCLEVBQ2hCLFdBQW9CLEVBQ3BCLElBQWEsRUFDYixTQUFxQixNQUFNO1FBRTNCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO1FBQy9CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0lBQzdCLENBQUM7SUFFRCxzREFBc0Q7SUFDdEQsaUJBQWlCLENBQVUsZUFBdUI7UUFDOUMsT0FBTyxDQUFDLFNBQWtCLEVBQW9CLEVBQUU7WUFDNUMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDNUQsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUVELG1EQUFtRDtJQUNuRCx5QkFBeUIsQ0FBaUIsZUFBdUI7UUFDN0QsT0FBTyxDQUFDLElBQVcsRUFBRSxTQUFrQixFQUFvQixFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3ZELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxvREFBb0Q7SUFDcEQsZUFBZTtRQUNYLE9BQU8sQ0FBQyxTQUFrQixFQUFvQixFQUFFO1lBQzVDLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBQ3RELENBQUMsQ0FBQztJQUNOLENBQUM7SUFFRCxpREFBaUQ7SUFDakQsdUJBQXVCO1FBQ25CLE9BQU8sQ0FBQyxJQUFXLEVBQUUsU0FBa0IsRUFBb0IsRUFBRTtZQUN6RCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUM7SUFDTixDQUFDO0lBUUQ7OztPQUdHO0lBQ0gsc0JBQXNCLENBQUMsUUFBaUI7UUFDcEMsTUFBTSxJQUFJLDBCQUFPLENBQ2IscUJBQXFCLEVBQ3JCLE1BQU0sRUFDTixnQ0FBZ0MsRUFDaEMsUUFBUSxDQUNYLENBQUM7SUFDTixDQUFDO0lBRUssSUFBSSxDQUNOLGVBQXdCLEVBQ3hCLElBQVUsRUFDVixTQUFrQixFQUNsQixNQUFZLEVBQ1osTUFBbUI7O1lBR25CLE1BQU0sR0FBRyxNQUFNLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUVuQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FDekQsZUFBZSxDQUFDLENBQUMsQ0FBQyxJQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUM1QyxHQUFHLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUMzQixFQUFFLENBQUM7WUFDUCxJQUFJLE9BQU8sQ0FBQztZQUVaLElBQUksTUFBTSxLQUFLLEtBQUssRUFBRTtnQkFDbEIsTUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDcEUsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDdkQsR0FBRyxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO2dCQUM1QyxPQUFPLEdBQUc7b0JBQ04sTUFBTTtvQkFDTixPQUFPO2lCQUNWLENBQUM7YUFDTDtpQkFBTTtnQkFDSCxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNwRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztnQkFDN0MsTUFBTSxRQUFRLEdBQUcsT0FBTyxJQUFJLEtBQUssUUFBUSxDQUFDO2dCQUUxQyxPQUFPLENBQUMsY0FBYyxDQUFDLEdBQUcsUUFBUTtvQkFDOUIsQ0FBQyxDQUFDLGlDQUFpQztvQkFDbkMsQ0FBQyxDQUFDLDJCQUEyQixDQUFDO2dCQUVsQyxPQUFPLEdBQUc7b0JBQ04sTUFBTTtvQkFDTixPQUFPO29CQUNQLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7b0JBQ3ZELE9BQU8sRUFBRSxLQUFLO2lCQUNqQixDQUFDO2FBQ0w7WUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBRXBELE1BQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3JFLElBQUksV0FBVyxDQUFDO1lBQ2hCLElBQ0ksV0FBVyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUM7Z0JBQ2xDLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQ25DO2dCQUNFLFdBQVcsR0FBRyxNQUFNLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzthQUNyQztpQkFBTTtnQkFDSCxJQUFJLGVBQWUsQ0FBQztnQkFDcEIsSUFBSTtvQkFDQSxlQUFlLEdBQUcsTUFBTSxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7b0JBQ3RDLFdBQVcsR0FBRyxzQ0FBdUIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7aUJBQ3RFO2dCQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNSLElBQUksZUFBZSxFQUFFO3dCQUNqQixNQUFNLENBQUMsQ0FBQztxQkFDWDt5QkFBTTt3QkFDSCxXQUFXLEdBQUcsU0FBUyxDQUFDLENBQUMseUVBQXlFO3FCQUNyRztpQkFDSjthQUNKO1lBRUQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtnQkFDbEMsTUFBTSxXQUFXLENBQUMsS0FBSyxDQUFDO2FBQzNCO2lCQUFNLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JBQ3pELElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUM1QztpQkFBTTtnQkFDSCxPQUFPLFdBQVcsQ0FBQzthQUN0QjtRQUNMLENBQUM7S0FBQTtDQUNKO0FBOUlELGtEQThJQyJ9