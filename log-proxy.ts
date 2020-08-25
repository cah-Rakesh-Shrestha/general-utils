import { IBaseError, BaseError } from "errors-framework";
import { Env } from "./env";
import { DeploymentType } from "./deployment-info";

/**
 * non-ePHI attributes only
 */
export type UserTraits = {
    isInternalUser: boolean;
    /** Comma separated values for multiple roles */
    roles: string;
    fqn: string;
};

export const LogTextColor: any = {
    Error: "red",
    Warning: "yellow",
    Info: "cyan",
    Debug: "green",
    Event: "blue",
    Page: "magenta",
    Success: "green",
    Fail: "red"
};

export const LogTextStyle: any = {
    Italic: "italic",
    Dim: "dim"
};

/**
 * Base interface supported by all EventProperties objects
 */
export interface IEventProperties {
    readonly systemFqn: string;
}

/**
 * Required interface for a log provider, e.g., console, winston etc.
 */
export interface ILogProvider {
    debug(message: string, ...args: any[]): void;
    info(message: string, ...args: any[]): void;
    warn(message: string, ...args: any[]): void;
    error(message: string, ...args: any[]): void;
    event(
        deviceId: string,
        name: string,
        trackingId?: string,
        additionalProps?: IEventProperties
    ): void;
    page(
        deviceId: string,
        name: string,
        trackingId?: string,
        additionalProps?: IEventProperties
    ): void;
}

/*
 * Extern definition for React Native build setting.
 * Indicates, when true, that currently running process is a debug build
 */

const inDevMode =
    Env.deploymentType !== DeploymentType.production &&
    Env.deploymentType !== DeploymentType.staging;

const inJest = !!Env.lookupString("JEST_WORKER_ID");

type MessageType = "Error" | "Warning" | "Info" | "Debug" | "Event" | "Page";

export class DefaultLogProvider implements ILogProvider {
    info = console.info.bind(console);
    warn = console.warn.bind(console);
    error = console.error.bind(console);
    debug = inDevMode ? console.debug.bind(console) : () => { };
    event = console.info.bind(console);
    page = console.info.bind(console);
}

/**
 * Proxy class interfacing between the system and the underlying logger.
 * Use this instead of writing directly to console or another logger.
 * At the top of each file or logical module, instantiate the LogProxy instance for that file/module, and use it to log.
 *
 * e.g. in my-file.ts:
 *      const log = new LogProxy('my-file');
 *
 * -- NOTE --
 * Never put any ePHI or other sensitive data like passwords into the log.
 *
 */
export class LogProxy {
    private static _provider?: ILogProvider;
    private static _useColors: boolean = false;
    private readonly prefix: string;

    /**
     * Sets provider for all LogProxy instances.
     * @param provider Provider to be used by all LogProxy instances
     */
    static setLogProvider(provider?: ILogProvider) {
        LogProxy._provider = provider;
    }

    /**
     * Returns the active log provider.
     */
    private static getProvider() {
        return LogProxy._provider || (!inJest && new DefaultLogProvider());
    }

    /**
     * Sets provider for color output
     * @param colors
     */
    static useColors(use = false) {
        LogProxy._useColors = use;
    }


    /**
     * Generates the text to be logged.
     * @param message
     * @param type
     * @param errorRef
     */
    private makeText(message: string, type: MessageType, errorRef?: string) {
        const lead = errorRef ? `${type} <${errorRef}>` : "";

        if (this.prefix || lead) {
            if (LogProxy._useColors) {
                return (
                    `[${lead ? lead + ":" : ""}${this.prefix}] `[
                    LogTextColor[type as any]
                    ] + message[LogTextColor[type as any]]
                );
            } else {
                return `[${lead ? lead + ":" : ""}${this.prefix}] ${message}`;
            }
        } else {
            return `${message}`;
        }
    }

    /**
     * Constructor.
     * @param prefix Used as prefix for log messages.  Identify the physical file or logical module for which the logger will be used.
     */
    constructor(prefix: string) {
        this.prefix = prefix;
    }

    /**
     * Log a debug message.
     * @param message
     * @param args
     */
    debug(message: string, ...args: any[]): void {
        const provider = LogProxy.getProvider();
        if (
            provider &&
            provider.debug &&
            typeof provider.debug === "function"
        ) {
            provider.debug(this.makeText(message, "Debug"), ...args);
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't have debug()",
                    "Debug"
                )
            );
        }
    }

    /**
     * Log an informational message.
     * @param message
     * @param args
     */
    info(message: string, ...args: any): void {
        const provider = LogProxy.getProvider();
        if (provider && provider.info && typeof provider.info === "function") {
            provider.info(this.makeText(message, "Info"), ...args);
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't have info()",
                    "Info"
                )
            );
        }
    }

    /**
     * Log a warning message.
     * @param message
     * @param args
     */
    warn(message: string, ...args: any): void {
        const provider = LogProxy.getProvider();
        if (provider && provider.warn && typeof provider.warn === "function") {
            provider.warn(this.makeText(message, "Warning"), ...args);
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't have warn()",
                    "Warning"
                )
            );
        }
    }

    /**
     * Log an error message.
     *
     * @param e
     * @param args
     * @returns An object with a throw method the caller can use to re-throw an exception after logging it.
     */
    error(e: IBaseError, ...args: any): void {
        const provider = LogProxy.getProvider();

        if (
            provider &&
            provider.error &&
            typeof provider.error === "function"
        ) {
            provider.error(
                this.makeText(BaseError.toString(e), "Error", e.errorRef),
                ...args
            );
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't have error()",
                    "Error",
                    e.errorRef
                ),
                e.type,
                ...args
            );
        }
    }

    /**
     * Log an event.
     *
     * @param trackingId
     * @param name
     * @param additionalProps
     */
    event(
        deviceId: string,
        name: string,
        trackingId?: string,
        additionalProps?: IEventProperties
    ): void {
        const provider = LogProxy.getProvider();
        if (
            provider &&
            provider.event &&
            typeof provider.event === "function"
        ) {
            provider.event(
                deviceId,
                this.makeText(name, "Event"),
                trackingId,
                additionalProps
            );
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't offer event()",
                    "Event"
                )
            );
        }
    }

    /**
     * Log a Page visit.
     * @param trackingId
     * @param name
     * @param additionalProps
     */
    page(
        deviceId: string,
        name: string,
        trackingId?: string,
        additionalProps?: IEventProperties
    ): void {
        const provider = LogProxy.getProvider();
        if (provider && provider.page && typeof provider.page === "function") {
            provider.page(deviceId, this.makeText(name, "Page"), trackingId, additionalProps);
        } else if (!inJest) {
            console.log(
                this.makeText(
                    "Current log provider doesn't have page()",
                    "Page"
                )
            );
        }
    }
}
