"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_framework_1 = require("errors-framework");
const env_1 = require("./env");
const deployment_info_1 = require("./deployment-info");
exports.LogTextColor = {
    Error: "red",
    Warning: "yellow",
    Info: "cyan",
    Debug: "green",
    Event: "blue",
    Page: "magenta",
    Success: "green",
    Fail: "red"
};
exports.LogTextStyle = {
    Italic: "italic",
    Dim: "dim"
};
/*
 * Extern definition for React Native build setting.
 * Indicates, when true, that currently running process is a debug build
 */
const inDevMode = env_1.Env.deploymentType !== deployment_info_1.DeploymentType.production &&
    env_1.Env.deploymentType !== deployment_info_1.DeploymentType.staging;
const inJest = !!env_1.Env.lookupString("JEST_WORKER_ID");
class DefaultLogProvider {
    constructor() {
        this.info = console.info.bind(console);
        this.warn = console.warn.bind(console);
        this.error = console.error.bind(console);
        this.debug = inDevMode ? console.debug.bind(console) : () => { };
        this.event = console.info.bind(console);
        this.page = console.info.bind(console);
    }
}
exports.DefaultLogProvider = DefaultLogProvider;
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
class LogProxy {
    /**
     * Constructor.
     * @param prefix Used as prefix for log messages.  Identify the physical file or logical module for which the logger will be used.
     */
    constructor(prefix) {
        this.prefix = prefix;
    }
    /**
     * Sets provider for all LogProxy instances.
     * @param provider Provider to be used by all LogProxy instances
     */
    static setLogProvider(provider) {
        LogProxy._provider = provider;
    }
    /**
     * Returns the active log provider.
     */
    static getProvider() {
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
    makeText(message, type, errorRef) {
        const lead = errorRef ? `${type} <${errorRef}>` : "";
        if (this.prefix || lead) {
            if (LogProxy._useColors) {
                return (`[${lead ? lead + ":" : ""}${this.prefix}] `[exports.LogTextColor[type]] + message[exports.LogTextColor[type]]);
            }
            else {
                return `[${lead ? lead + ":" : ""}${this.prefix}] ${message}`;
            }
        }
        else {
            return `${message}`;
        }
    }
    /**
     * Log a debug message.
     * @param message
     * @param args
     */
    debug(message, ...args) {
        const provider = LogProxy.getProvider();
        if (provider &&
            provider.debug &&
            typeof provider.debug === "function") {
            provider.debug(this.makeText(message, "Debug"), ...args);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't have debug()", "Debug"));
        }
    }
    /**
     * Log an informational message.
     * @param message
     * @param args
     */
    info(message, ...args) {
        const provider = LogProxy.getProvider();
        if (provider && provider.info && typeof provider.info === "function") {
            provider.info(this.makeText(message, "Info"), ...args);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't have info()", "Info"));
        }
    }
    /**
     * Log a warning message.
     * @param message
     * @param args
     */
    warn(message, ...args) {
        const provider = LogProxy.getProvider();
        if (provider && provider.warn && typeof provider.warn === "function") {
            provider.warn(this.makeText(message, "Warning"), ...args);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't have warn()", "Warning"));
        }
    }
    /**
     * Log an error message.
     *
     * @param e
     * @param args
     * @returns An object with a throw method the caller can use to re-throw an exception after logging it.
     */
    error(e, ...args) {
        const provider = LogProxy.getProvider();
        if (provider &&
            provider.error &&
            typeof provider.error === "function") {
            provider.error(this.makeText(errors_framework_1.BaseError.toString(e), "Error", e.errorRef), ...args);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't have error()", "Error", e.errorRef), e.type, ...args);
        }
    }
    /**
     * Log an event.
     *
     * @param trackingId
     * @param name
     * @param additionalProps
     */
    event(deviceId, name, trackingId, additionalProps) {
        const provider = LogProxy.getProvider();
        if (provider &&
            provider.event &&
            typeof provider.event === "function") {
            provider.event(deviceId, this.makeText(name, "Event"), trackingId, additionalProps);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't offer event()", "Event"));
        }
    }
    /**
     * Log a Page visit.
     * @param trackingId
     * @param name
     * @param additionalProps
     */
    page(deviceId, name, trackingId, additionalProps) {
        const provider = LogProxy.getProvider();
        if (provider && provider.page && typeof provider.page === "function") {
            provider.page(deviceId, this.makeText(name, "Page"), trackingId, additionalProps);
        }
        else if (!inJest) {
            console.log(this.makeText("Current log provider doesn't have page()", "Page"));
        }
    }
}
LogProxy._useColors = false;
exports.LogProxy = LogProxy;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXByb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdURBQXlEO0FBQ3pELCtCQUE0QjtBQUM1Qix1REFBbUQ7QUFZdEMsUUFBQSxZQUFZLEdBQVE7SUFDN0IsS0FBSyxFQUFFLEtBQUs7SUFDWixPQUFPLEVBQUUsUUFBUTtJQUNqQixJQUFJLEVBQUUsTUFBTTtJQUNaLEtBQUssRUFBRSxPQUFPO0lBQ2QsS0FBSyxFQUFFLE1BQU07SUFDYixJQUFJLEVBQUUsU0FBUztJQUNmLE9BQU8sRUFBRSxPQUFPO0lBQ2hCLElBQUksRUFBRSxLQUFLO0NBQ2QsQ0FBQztBQUVXLFFBQUEsWUFBWSxHQUFRO0lBQzdCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLEdBQUcsRUFBRSxLQUFLO0NBQ2IsQ0FBQztBQStCRjs7O0dBR0c7QUFFSCxNQUFNLFNBQVMsR0FDWCxTQUFHLENBQUMsY0FBYyxLQUFLLGdDQUFjLENBQUMsVUFBVTtJQUNoRCxTQUFHLENBQUMsY0FBYyxLQUFLLGdDQUFjLENBQUMsT0FBTyxDQUFDO0FBRWxELE1BQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxTQUFHLENBQUMsWUFBWSxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFJcEQsTUFBYSxrQkFBa0I7SUFBL0I7UUFDSSxTQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEMsU0FBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLFVBQUssR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNwQyxVQUFLLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLEdB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