"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWJhc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb25maWctYmFzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVEQUFtRDtBQUNuRCwrQkFBNEI7QUFFNUIsU0FBUyxVQUFVLENBQW1CLENBQUk7SUFDeEMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBZ0IsQ0FBQztJQUMxRCxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2YsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDNUIsWUFBWTtZQUNaLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDekI7SUFDSCxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixDQUFDO0FBdUJEOztHQUVHO0FBQ0gsTUFBYSxVQUFVO0lBS3JCLFlBQVksb0JBQTRCO1FBSC9CLGlCQUFZLEdBQXVCLEVBQUUsQ0FBQztRQUN0QyxXQUFNLEdBQVcsU0FBRyxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUdwRSxNQUFNLEdBQUcsR0FBRyxTQUFHLENBQUMsU0FBUyxDQUFDLGdCQUFnQixFQUFFLG9CQUFvQixDQUFDLENBQUE7UUFDakUsSUFBSSxDQUFDLFVBQVUsR0FBRyxnQ0FBYyxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQsSUFBSTtRQUNGLE9BQU8sVUFBVSxDQUFJLElBQVcsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRjtBQWJELGdDQWFDIn0=