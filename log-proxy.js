"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogProxy = exports.DefaultLogProvider = exports.LogTextStyle = exports.LogTextColor = void 0;
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
exports.LogProxy = LogProxy;
LogProxy._useColors = false;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9nLXByb3h5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibG9nLXByb3h5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUF5RDtBQUN6RCwrQkFBNEI7QUFDNUIsdURBQW1EO0FBWXRDLFFBQUEsWUFBWSxHQUFRO0lBQzdCLEtBQUssRUFBRSxLQUFLO0lBQ1osT0FBTyxFQUFFLFFBQVE7SUFDakIsSUFBSSxFQUFFLE1BQU07SUFDWixLQUFLLEVBQUUsT0FBTztJQUNkLEtBQUssRUFBRSxNQUFNO0lBQ2IsSUFBSSxFQUFFLFNBQVM7SUFDZixPQUFPLEVBQUUsT0FBTztJQUNoQixJQUFJLEVBQUUsS0FBSztDQUNkLENBQUM7QUFFVyxRQUFBLFlBQVksR0FBUTtJQUM3QixNQUFNLEVBQUUsUUFBUTtJQUNoQixHQUFHLEVBQUUsS0FBSztDQUNiLENBQUM7QUErQkY7OztHQUdHO0FBRUgsTUFBTSxTQUFTLEdBQ1gsU0FBRyxDQUFDLGNBQWMsS0FBSyxnQ0FBYyxDQUFDLFVBQVU7SUFDaEQsU0FBRyxDQUFDLGNBQWMsS0FBSyxnQ0FBYyxDQUFDLE9BQU8sQ0FBQztBQUVsRCxNQUFNLE1BQU0sR0FBRyxDQUFDLENBQUMsU0FBRyxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBSXBELE1BQWEsa0JBQWtCO0lBQS9CO1FBQ0ksU0FBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2xDLFNBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNsQyxVQUFLLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDcEMsVUFBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxH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