"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Env = exports.ValueDefaultsClass = void 0;
const deployment_info_1 = require("./deployment-info");
const errors_framework_1 = require("errors-framework");
/** IMP: This is to make ENV module available in Expo generated Binary */
//@ts-ignore
const expo_constants_1 = __importDefault(require("expo-constants"));
//@ts-ignore
const ExpoUpdates = __importStar(require("expo-updates"));
const logger = console; // cannot use LogProxy here... creates circular dependency
const listEnv = !!process.env.LIST_ENV;
const allowGeneralEnvDefaults = !!process.env.ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.REACT_NATIVE_ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.EXPO_ALLOW_GENERAL_ENV_DEFAULTS ||
    // If Expo ? allowDefaults = true. For generated Binary process.env.ALLOW_GENERAL... may not be available
    (expo_constants_1.default.manifest && expo_constants_1.default.manifest.releaseChannel) ||
    ExpoUpdates.releaseChannel !== undefined ||
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
            expo_constants_1.default.manifest.releaseChannel ||
            ExpoUpdates.releaseChannel !== 'default' ? ExpoUpdates.releaseChannel : deployment_info_1.DeploymentType.dev;
        const value = val ? val.toLowerCase() : deployment_info_1.DeploymentType.dev;
        return deployment_info_1.DeploymentType[value] || deployment_info_1.DeploymentType.dev;
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
            !(allowGeneralEnvDefaults) &&
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1REFBbUQ7QUFDbkQsdURBQTJDO0FBQzNDLHlFQUF5RTtBQUN6RSxZQUFZO0FBQ1osb0VBQTJDO0FBQzNDLFlBQVk7QUFDWiwwREFBNEM7QUFFNUMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsMERBQTBEO0FBSWxGLE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQztBQUN2QyxNQUFNLHVCQUF1QixHQUN6QixDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywwQkFBMEI7SUFDeEMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUNBQXVDO0lBQ3JELENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQjtJQUM3Qyx5R0FBeUc7SUFDekcsQ0FBRyx3QkFBYSxDQUFDLFFBQVEsSUFBSSx3QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUM7SUFDbkUsV0FBVyxDQUFDLGNBQWMsS0FBSyxTQUFTO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssZUFBZSxDQUFDO0FBTXZELE1BQWEsa0JBQWtCO0NBTzlCO0FBUEQsZ0RBT0M7QUFRRCxNQUFhLEdBQUc7SUFDWjs7T0FFRztJQUNILE1BQU0sS0FBSyxjQUFjO1FBQ3JCLE1BQU0sR0FBRyxHQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QjtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQjtZQUNoQyx3QkFBYSxDQUFDLFFBQVEsQ0FBQyxjQUFjO1lBQ3JDLFdBQVcsQ0FBQyxjQUFjLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMs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