"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = exports.ValueDefaultsClass = void 0;
const deployment_info_1 = require("./deployment-info");
const errors_framework_1 = require("errors-framework");
const logger = console; // cannot use LogProxy here... creates circular dependency
const g = global;
const listEnv = !!process.env.LIST_ENV;
const allowGeneralEnvDefaults = !!process.env.ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.REACT_NATIVE_ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.EXPO_ALLOW_GENERAL_ENV_DEFAULTS ||
    g.Expo ||
    g.React ||
    process.env.SERVICE_START_MODE === "generateToken";
class ValueDefaultsClass {
}
exports.ValueDefaultsClass = ValueDefaultsClass;
class Env {
    /**
     * Returns the Deployment Type as set by the environment
     */
    static get deploymentType() {
        const val = process.env.DEPLOYMENT_TYPE ||
            process.env.REACT_NATIVE_DEPLOYMENT_TYPE ||
            process.env.EXPO_DEPLOYMENT_TYPE ||
            (g.Expo && g.Expo.Constants.manifest.releaseChannel) ||
            (g.React && g.React.deploymentType);
        const value = val ? val.toLowerCase() : deployment_info_1.DeploymentType.dev;
        return deployment_info_1.DeploymentType[value];
    }
    /**
     * Returns, if set, environment variable with the given name.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookup(name, defaults) {
        const safeDefaults = defaults || {};
        const fullySpecified = safeDefaults.dev &&
            safeDefaults.demo &&
            safeDefaults.test &&
            safeDefaults.qa &&
            safeDefaults.staging &&
            safeDefaults.production;
        if (!fullySpecified &&
            !(allowGeneralEnvDefaults || g.React) &&
            (this.deploymentType === deployment_info_1.DeploymentType.production ||
                this.deploymentType === deployment_info_1.DeploymentType.staging)) {
            if (listEnv) {
                logger.error(name, "(Missing)");
            }
            else {
                throw new errors_framework_1.OpError(Env.name, "lookup", "In production and staging deployments, you need to provide fully specified defaults to Env functions", `Missing default for: ${name}`);
            }
        }
        const defaultValue = fullySpecified
            ? safeDefaults[Env.deploymentType]
            : defaults;
        const value = (process.env[name] ||
            process.env["REACT_NATIVE_" + name] ||
            process.env["EXPO_" + name] ||
            (defaultValue !== undefined && typeof defaultValue === "object"
                ? defaultValue[Env.deploymentType]
                : defaultValue));
        if (listEnv && this.deploymentType === deployment_info_1.DeploymentType.dev) {
            //@ts-ignore
            if (String.prototype.cyan && String.prototype.red) {
                logger.debug(
                //@ts-ignore
                `${name}:`["cyan"], 
                //@ts-ignore
                value ? value : ">> Missing <<"["red"]);
            }
            else {
                logger.debug(`${name}:`, value ? value : ">> Missing <<");
            }
        }
        return value;
    }
    /**
     * Returns, if set, environment variable with the given name.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static get(name, defaults) {
        const value = Env.lookup(name, defaults);
        if (!value) {
            throw new errors_framework_1.OpError("Env", "getMandatoryValue", `Missing mandatory value ${name}`);
        }
        return value;
    }
    /**
     * Returns, if set, environment variable with the given name as a string value.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupString(name, defaults) {
        return Env.lookup(name, defaults);
    }
    /**
     * Returns, if set, environment variable with the given name as an integer value.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupInt(name, defaults) {
        const value = Env.lookup(name, defaults);
        return value && typeof value !== "number"
            ? Number.parseInt(value)
            : value;
    }
    /**
     * Returns, if set, environment variable with the given name as a float value.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupFloat(name, defaults) {
        const value = Env.lookup(name, defaults);
        return value ? Number.parseFloat(value) : undefined;
    }
    /**
     * Returns true if lookup environment variable is set
     * Otherwise returns false
     * @param name
     */
    static lookupBoolean(name, defaults) {
        const value = Env.lookup(name, defaults);
        return !(value === undefined ||
            value === "" ||
            value.toLocaleLowerCase() === "false");
    }
    /**
     * Returns, if set, environment variable with the given name as an array of strings.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupStringArray(name, defaults) {
        const value = Env.lookup(name, defaults);
        return value ? value.split(",").map(v => v.trim()) : undefined;
    }
    /**
     * Returns, if set, environment variable with the given name as an json object.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupJson(name, defaults) {
        const value = Env.lookup(name, defaults);
        try {
            if (value) {
                return JSON.parse(value);
            }
        }
        catch (e) {
            throw e;
        }
        return undefined;
    }
    /**
     * Returns, if set, environment variable with the given name as a string value.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getString(name, defaults) {
        const value = Env.lookupString(name, defaults);
        if (value === undefined) {
            throw new errors_framework_1.OpError("Env", "getString", `Missing value ${name}`);
        }
        return value;
    }
    static getBoolean(name, defaults) {
        const value = Env.lookup(name, defaults);
        return value && value === "true" ? true : false;
    }
    /**
     * Returns, if set, environment variable with the given name as an integer value.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getInt(name, defaults) {
        const value = Env.lookupInt(name, defaults);
        if (value === undefined) {
            throw new errors_framework_1.OpError("Env", "getInt", `Missing value ${name}`);
        }
        return value;
    }
    /**
     * Returns, if set, environment variable with the given name as a float value.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getFloat(name, defaults) {
        const value = Env.lookupFloat(name, defaults);
        if (value === undefined) {
            throw new errors_framework_1.OpError("Env", "getFloat", `Missing value ${name}`);
        }
        return value;
    }
    /**
     * Returns, if set, environment variable with the given name as an array of strings.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getStringArray(name, defaults) {
        const value = Env.lookupStringArray(name, defaults);
        if (value === undefined) {
            throw new errors_framework_1.OpError("Env", "getStringArray", `Missing value ${name}`);
        }
        return value;
    }
    static getJson(name, defaults) {
        let value;
        try {
            value = Env.lookupJson(name, defaults);
        }
        catch (e) {
            throw new errors_framework_1.OpError("Env", "getJson", `Invalid value for ${name}`);
        }
        if (value === undefined) {
            throw new errors_framework_1.OpError("Env", "getJson", `Missing value ${name}`);
        }
        return value;
    }
    static getSecretString(name, defaults) {
        let value = Env.getString(name, defaults);
        return {
            get secret() {
                return value;
            }
        };
    }
}
exports.Env = Env;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHVEQUFtRDtBQUNuRCx1REFBMkM7QUFJM0MsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsMERBQTBEO0FBSWxGLE1BQU0sQ0FBQyxHQUFRLE1BQU0sQ0FBQztBQUV0QixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDdkMsTUFBTSx1QkFBdUIsR0FDekIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCO0lBQ3hDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QztJQUNyRCxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0I7SUFDN0MsQ0FBQyxDQUFDLElBQUk7SUFDTixDQUFDLENBQUMsS0FBSztJQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssZUFBZSxDQUFDO0FBTXZELE1BQWEsa0JBQWtCO0NBTzlCO0FBUEQsZ0RBT0M7QUFRRCxNQUFhLEdBQUc7SUFDWjs7T0FFRztJQUNILE1BQU0sS0FBSyxjQUFjO1FBQ3JCLE1BQU0sR0FBRyxHQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTtZQUMzQixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QjtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQjtZQUNoQyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUNwRCxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUV4QyxNQUFNLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENB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