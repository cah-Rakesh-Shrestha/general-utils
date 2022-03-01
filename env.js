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
const expo_constants_1 = __importDefault(require("expo-constants"));
const ExpoUpdates = __importStar(require("expo-updates"));
const logger = console; // cannot use LogProxy here... creates circular dependency
const listEnv = !!process.env.LIST_ENV;
const allowGeneralEnvDefaults = !!process.env.ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.REACT_NATIVE_ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.EXPO_ALLOW_GENERAL_ENV_DEFAULTS ||
    // If Expo ? allowDefaults = true. For generated Binary process.env.ALLOW_GENERAL... may not be available
    expo_constants_1.default.manifest !== undefined ||
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
            (expo_constants_1.default.manifest && expo_constants_1.default.manifest.releaseChannel) ||
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW52LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZW52LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSx1REFBbUQ7QUFDbkQsdURBQTJDO0FBQzNDLHlFQUF5RTtBQUN6RSxvRUFBMkM7QUFDM0MsMERBQTRDO0FBRTVDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLDBEQUEwRDtBQUlsRixNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUM7QUFDdkMsTUFBTSx1QkFBdUIsR0FDekIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsMEJBQTBCO0lBQ3hDLENBQUMsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QztJQUNyRCxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0I7SUFDN0MseUdBQXlHO0lBQ3pHLHdCQUFhLENBQUMsUUFBUSxLQUFLLFNBQVM7SUFDcEMsV0FBVyxDQUFDLGNBQWMsS0FBSyxTQUFTO0lBQ3hDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEtBQUssZUFBZSxDQUFDO0FBTXZELE1BQWEsa0JBQWtCO0NBTzlCO0FBUEQsZ0RBT0M7QUFRRCxNQUFhLEdBQUc7SUFDWjs7T0FFRztJQUNILE1BQU0sS0FBSyxjQUFjO1FBQ3JCLE1BQU0sR0FBRyxHQUNMLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZTtZQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QjtZQUN4QyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQjtZQUNoQyxDQUFHLHdCQUFhLENBQUMsUUFBUSxJQUFJLHdCQUFhLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQztZQUNuRSxXQUFXLENBQUMsY0FBYyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsZ0NBQWMsQ0FBQyxHQUFH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