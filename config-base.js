"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfigBase = void 0;
const deployment_info_1 = require("./deployment-info");
const env_1 = require("./env");
function deepFreeze(o) {
    const keys = Object.getOwnPropertyNames(o);
    keys.forEach(k => {
        if (typeof o[k] === "object") {
            //@ts-ignore
            o[k] = deepFreeze(o[k]);
        }
    });
    return Object.freeze(o);
}
/**
 * Base Class for all config objects
 */
class ConfigBase {
    constructor(defaultDeploymentFqn) {
        this.featureFlags = {};
        this.locale = env_1.Env.getString("DEPLOYMENT_LOCALE", "en-US");
        const fqn = env_1.Env.getString("DEPLOYMENT_FQN", defaultDeploymentFqn);
        this.deployment = deployment_info_1.DeploymentInfo.parseFQN(fqn);
    }
    lock() {
        return deepFreeze(this);
    }
}
exports.ConfigBase = ConfigBase;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWctYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBbUQ7QUFDbkQsK0JBQTRCO0FBRTVCLFNBQVMsVUFBVSxDQUFtQixDQUFJO0lBQ3hDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQWdCLENBQUM7SUFDMUQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNmLElBQUksT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQzVCLFlBQVk7WUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDMUIsQ0FBQztBQXVCRDs7R0FFRztBQUNILE1BQWEsVUFBVTtJQUtyQixZQUFZLG9CQUE0QjtRQUgvQixpQkFBWSxHQUF1QixFQUFFLENBQUM7UUFDdEMsV0FBTSxHQUFXLFNBQUcsQ0FBQyxTQUFTLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFHcEUsTUFBTSxHQUFHLEdBQUcsU0FBRyxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsRUFBRSxvQkFBb0IsQ0FBQyxDQUFBO1FBQ2pFLElBQUksQ0FBQyxVQUFVLEdBQUcsZ0NBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVELElBQUk7UUFDRixPQUFPLFVBQVUsQ0FBSSxJQUFXLENBQUMsQ0FBQztJQUNwQyxDQUFDO0NBQ0Y7QUFiRCxnQ0FhQyJ9