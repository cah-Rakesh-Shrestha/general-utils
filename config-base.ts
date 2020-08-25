import { DeploymentInfo } from "./deployment-info";
import { Env } from "./env";

function deepFreeze<T extends Object>(o: T): Readonly<T> {
  const keys = Object.getOwnPropertyNames(o) as (keyof T)[];
  keys.forEach(k => {
    if (typeof o[k] === "object") {
      //@ts-ignore
      o[k] = deepFreeze(o[k]);
    }
  });
  return Object.freeze(o);
}

export type FeatureFlagsConfig = {
  readonly [featureName: string]: boolean;
};

/**
 * Base interface supported by all config objects
 */
export interface IConfig {
  /** Information about the currently running deployment */
  readonly deployment: DeploymentInfo;

  /** Locale setting used in deployment, e.g, en-US */
  readonly locale: string;

  /** Toggles that turn individual features on and off */
  readonly featureFlags: FeatureFlagsConfig;

  /** Method for locking all values in the config so they cannot be altered at runtime */
  lock<T extends IConfig>(): Readonly<T>;
}

/**
 * Base Class for all config objects
 */
export class ConfigBase {
  readonly deployment: DeploymentInfo;
  readonly featureFlags: FeatureFlagsConfig = {};
  readonly locale: string = Env.getString("DEPLOYMENT_LOCALE", "en-US");

  constructor(defaultDeploymentFqn: string) {
    const fqn = Env.getString("DEPLOYMENT_FQN", defaultDeploymentFqn)
    this.deployment = DeploymentInfo.parseFQN(fqn);
  }

  lock<T extends IConfig>(): Readonly<T> {
    return deepFreeze<T>(this as any);
  }
}
