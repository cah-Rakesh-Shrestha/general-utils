import { DeploymentType } from "./deployment-info";
import { OpError } from "errors-framework";
/** IMP: This is to make ENV module available in Expo generated Binary */
//@ts-ignore
import ExpoConstants from "expo-constants";
//@ts-ignore
import * as ExpoUpdates from 'expo-updates';

const logger = console; // cannot use LogProxy here... creates circular dependency

declare var process: any;

const listEnv = !!process.env.LIST_ENV;
const allowGeneralEnvDefaults =
    !!process.env.ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.REACT_NATIVE_ALLOW_GENERAL_ENV_DEFAULTS ||
    !!process.env.EXPO_ALLOW_GENERAL_ENV_DEFAULTS ||
    // If Expo ? allowDefaults = true. For generated Binary process.env.ALLOW_GENERAL... may not be available
    ExpoConstants.manifest !== undefined ||
    ExpoUpdates.releaseChannel !== undefined ||
    process.env.SERVICE_START_MODE === "generateToken";

export interface IEnvJson {
    [key: string]: string;
}

export class ValueDefaultsClass<T> {
    dev: T | undefined;
    test: T | undefined;
    demo: T | undefined;
    qa: T | undefined;
    staging: T | undefined;
    production: T | undefined;
}

export type EnvValue = string | number | string[] | Secret<string>;
export type ValueDefaults<T> = ValueDefaultsClass<T> | T;
export type Secret<T> = {
    secret: string;
};

export class Env {
    /**
     * Returns the Deployment Type as set by the environment
     */
    static get deploymentType(): DeploymentType {
        const val =
            process.env.DEPLOYMENT_TYPE ||
                process.env.REACT_NATIVE_DEPLOYMENT_TYPE ||
                process.env.EXPO_DEPLOYMENT_TYPE ||
                ExpoConstants.manifest.releaseChannel ||
                ExpoUpdates.releaseChannel !== 'default' ? ExpoUpdates.releaseChannel : DeploymentType.dev;

        const value = val ? val.toLowerCase() : DeploymentType.dev;

        return DeploymentType[value as keyof typeof DeploymentType] as DeploymentType;
    }

    /**
     * Returns, if set, environment variable with the given name.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    private static lookup<T extends EnvValue>(
        name: string,
        defaults?: ValueDefaults<T>
    ): T | undefined {
        const safeDefaults: any = defaults || {};
        const fullySpecified =
            safeDefaults.dev &&
            safeDefaults.demo &&
            safeDefaults.test &&
            safeDefaults.qa &&
            safeDefaults.staging &&
            safeDefaults.production;

        if (
            !fullySpecified &&
            !(allowGeneralEnvDefaults) &&
            (this.deploymentType === DeploymentType.production ||
                this.deploymentType === DeploymentType.staging)
        ) {
            if (listEnv) {
                logger.error(name, "(Missing)");
            } else {
                throw new OpError(
                    Env.name,
                    "lookup",
                    "In production and staging deployments, you need to provide fully specified defaults to Env functions",
                    `Missing default for: ${name}`
                );
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
                : defaultValue)) as T;

        if (listEnv && this.deploymentType === DeploymentType.dev) {
            //@ts-ignore
            if (String.prototype.cyan && String.prototype.red) {
                logger.debug(
                    //@ts-ignore
                    `${name}:`["cyan"],
                    //@ts-ignore
                    value ? value : ">> Missing <<"["red"]
                );
            } else {
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
    private static get<T extends EnvValue>(
        name: string,
        defaults?: ValueDefaults<T>
    ): T {
        const value = Env.lookup<T>(name, defaults);
        if (!value) {
            throw new OpError(
                "Env",
                "getMandatoryValue",
                `Missing mandatory value ${name}`
            );
        }
        return value;
    }

    /**
     * Returns, if set, environment variable with the given name as a string value.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupString(
        name: string,
        defaults?: ValueDefaults<string>
    ): string | undefined {
        return Env.lookup<string>(name, defaults);
    }

    /**
     * Returns, if set, environment variable with the given name as an integer value.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupInt(
        name: string,
        defaults?: ValueDefaults<number>
    ): number | undefined {
        const value = Env.lookup<number>(name, defaults);
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
    static lookupFloat(
        name: string,
        defaults?: ValueDefaults<string>
    ): number | undefined {
        const value = Env.lookup<string>(name, defaults);
        return value ? Number.parseFloat(value) : undefined;
    }
    /**
     * Returns true if lookup environment variable is set
     * Otherwise returns false
     * @param name
     */
    static lookupBoolean(
        name: string,
        defaults?: ValueDefaults<string>
    ): boolean | undefined {
        const value = Env.lookup<string>(name, defaults);
        return !(
            value === undefined ||
            value === "" ||
            value.toLocaleLowerCase() === "false"
        );
    }

    /**
     * Returns, if set, environment variable with the given name as an array of strings.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupStringArray(
        name: string,
        defaults?: ValueDefaults<string>
    ): string[] | undefined {
        const value = Env.lookup<string>(name, defaults);
        return value ? value.split(",").map(v => v.trim()) : undefined;
    }

    /**
     * Returns, if set, environment variable with the given name as an json object.
     * Otherwise returns undefined
     * @param name
     * @param defaults
     */
    static lookupJson(
        name: string,
        defaults?: ValueDefaults<string>
    ): IEnvJson | undefined {
        const value = Env.lookup<string>(name, defaults);
        try {
            if (value) {
                return JSON.parse(value);
            }
        } catch (e) {
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
    static getString(name: string, defaults?: ValueDefaults<string>): string {
        const value = Env.lookupString(name, defaults);
        if (value === undefined) {
            throw new OpError("Env", "getString", `Missing value ${name}`);
        }
        return value;
    }

    static getBoolean(name: string, defaults?: ValueDefaults<string>): boolean {
        const value = Env.lookup<string>(name, defaults);
        return value && value === "true" ? true : false;
    }

    /**
     * Returns, if set, environment variable with the given name as an integer value.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getInt(name: string, defaults?: ValueDefaults<number>): number {
        const value = Env.lookupInt(name, defaults);
        if (value === undefined) {
            throw new OpError("Env", "getInt", `Missing value ${name}`);
        }
        return value;
    }

    /**
     * Returns, if set, environment variable with the given name as a float value.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getFloat(name: string, defaults?: ValueDefaults<string>): number {
        const value = Env.lookupFloat(name, defaults);
        if (value === undefined) {
            throw new OpError("Env", "getFloat", `Missing value ${name}`);
        }
        return value;
    }

    /**
     * Returns, if set, environment variable with the given name as an array of strings.
     * Otherwise throws an error.
     * @param name
     * @param defaults
     */
    static getStringArray(
        name: string,
        defaults?: ValueDefaults<string>
    ): string[] {
        const value = Env.lookupStringArray(name, defaults);
        if (value === undefined) {
            throw new OpError("Env", "getStringArray", `Missing value ${name}`);
        }
        return value;
    }

    static getJson(name: string, defaults?: ValueDefaults<string>) {
        let value;
        try {
            value = Env.lookupJson(name, defaults);
        } catch (e) {
            throw new OpError("Env", "getJson", `Invalid value for ${name}`);
        }

        if (value === undefined) {
            throw new OpError("Env", "getJson", `Missing value ${name}`);
        }
        return value;
    }

    static getSecretString(
        name: string,
        defaults?: ValueDefaults<string>
    ): Secret<string> {
        let value = Env.getString(name, defaults);

        return {
            get secret() {
                return value;
            }
        };
    }
}
