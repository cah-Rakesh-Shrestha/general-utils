import { OpError } from "errors-framework";
import { IServiceProxy } from "./i-service-proxy";
import { reviveDatesInProperties } from "./date-reviver";

"use strict";

export type FetchMethod = (uri: string, options: any) => Promise<any>;

export type CallMethod = "POST" | "GET" | "PUT" | "DEL" | "OPTIONS";

/**
 * Base class for Remote Service Proxies
 */
export abstract class WebServiceProxyBase implements IServiceProxy {
    readonly hostName: string;
    readonly serviceName?: string;
    readonly port?: number;
    readonly callMethod: CallMethod;

    private fetchMethod: FetchMethod;

    constructor(
        fetchMethod: FetchMethod,
        hostName: string,
        serviceName?: string,
        port?: number,
        method: CallMethod = "POST"
    ) {
        this.fetchMethod = fetchMethod;
        this.hostName = hostName;
        this.serviceName = serviceName;
        this.port = port;
        this.callMethod = method;
    }

    /** Creates a new proxy method that accepts no data */
    createProxyMethod<TResult>(serviceFunction: string) {
        return (authToken?: string): Promise<TResult> => {
            return this.call(serviceFunction, undefined, authToken);
        };
    }

    /** Creates a new proxy method that accepts data */
    createProxyMethodWithData<TData, TResult>(serviceFunction: string) {
        return (data: TData, authToken?: string): Promise<TResult> => {
            return this.call(serviceFunction, data, authToken);
        };
    }

    /** Creates a new proxy call that accepts no data */
    createProxyCall<TResult>() {
        return (authToken?: string): Promise<TResult> => {
            return this.call(undefined, undefined, authToken);
        };
    }

    /** Creates a new proxy call that accepts data */
    createProxyCallWithData<TData, TResult>() {
        return (data: TData, authToken?: string): Promise<TResult> => {
            return this.call(undefined, data, authToken);
        };
    }

    abstract onNeedCallHeaders(authToken?: string): any;

    abstract onNeedCallBody(data: any): any;

    abstract onNeedQueryString(data: any): any;

    /**
     * For remote HTTP calls where an text/html response is expected. This method should be overridden.
     * ScalaMed APIs do not return HTML response hence by default exception is thrown.
     */
    onNeedCallHtmlResponse(htmlData?: string) {
        throw new OpError(
            "WebServiceProxyBase",
            "call",
            "Invalid HTML response received",
            htmlData
        );
    }

    async call(
        serviceFunction?: string,
        data?: any,
        authToken?: string,
        header?: any,
        method?: CallMethod
    ): Promise<any> {

        method = method || this.callMethod;

        let uri = `${this.hostName}${this.port ? ":" + this.port : ""}${
            serviceFunction ? `/${
                this.serviceName ? this.serviceName + "." : ""
                }${serviceFunction}` : ""
            }`;
        let options;

        if (method === "GET") {
            const headers = header ? header : this.onNeedCallHeaders(authToken);
            const queryParams = this.onNeedQueryString(data) || "";
            uri += queryParams ? `?${queryParams}` : "";
            options = {
                method,
                headers
            };
        } else {
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

        const result = await this.fetchMethod(uri, options);

        const contentType = result.headers.get("Content-Type").toLowerCase();
        let resultValue;
        if (
            contentType.includes("text/plain") ||
            contentType.includes("text/html")
        ) {
            resultValue = await result.text();
        } else {
            let resultValueText;
            try {
                resultValueText = await result.text();
                resultValue = reviveDatesInProperties(JSON.parse(resultValueText));
            } catch (e) {
                if (resultValueText) {
                    throw e;
                } else {
                    resultValue = undefined; // NOTE: turning result to text return empty string for an undefined body
                }
            }
        }

        if (resultValue && resultValue.error) {
            throw resultValue.error;
        } else if (resultValue && contentType.includes("text/html")) {
            this.onNeedCallHtmlResponse(resultValue);
        } else {
            return resultValue;
        }
    }
}
