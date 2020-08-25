"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const v1_1 = __importDefault(require("uuid/v1"));
const errors_framework_1 = require("errors-framework");
/**
 * Enumerates possible deployment types
 */
var DeploymentType;
(function (DeploymentType) {
    DeploymentType["dev"] = "dev";
    DeploymentType["demo"] = "demo";
    DeploymentType["test"] = "test";
    DeploymentType["qa"] = "qa";
    DeploymentType["staging"] = "staging";
    DeploymentType["production"] = "production";
})(DeploymentType = exports.DeploymentType || (exports.DeploymentType = {}));
class DeploymentInfo {
    constructor(spec) {
        // make copy of spec so there's no unexpected modification for caller
        this.spec = {};
        Object.assign(this.spec, spec);
        if (!this.spec.id) {
            this.spec.id = v1_1.default();
        }
    }
    static init(spec) {
        DeploymentInfo.instance = new DeploymentInfo(spec);
        return DeploymentInfo.instance;
    }
    reverseDomain(domain) {
        const parts = domain.split(".");
        return parts.slice().reverse().join(".");
    }
    get fqn() {
        const parts = [
            this.reverseDomain(this.spec.companyDomain),
            this.spec.moduleName,
            this.spec.type + (this.spec.region ? `-${this.region}` : ""),
            this.spec.id
        ].filter(v => !!v);
        return parts.join(".");
    }
    get id() {
        return this.spec.id;
    }
    get type() {
        return this.spec.type;
    }
    get region() {
        return this.spec.region;
    }
    get companyDomain() {
        return this.spec.companyDomain;
    }
    get moduleName() {
        return this.spec.moduleName;
    }
    static get() {
        return DeploymentInfo.instance;
    }
    static FQN(spec) {
        const temp = new DeploymentInfo(spec);
        return temp.fqn;
    }
    static parseFQN(fqn) {
        const parts = fqn.split(".");
        if (parts.length < 4) {
            throw new errors_framework_1.OpError("DeploymentInfo", "parseFQN", "Malformed fqn");
        }
        const typeAndRegion = parts[parts.length - 2].split("-");
        const id = parts[parts.length - 1];
        return new DeploymentInfo({
            companyDomain: parts.slice(0, parts.length - 3).reverse().join("."),
            region: typeAndRegion.length === 2 ? typeAndRegion[1] : undefined,
            type: typeAndRegion[0],
            moduleName: parts[parts.length - 3],
            id: id
        });
    }
}
exports.DeploymentInfo = DeploymentInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwbG95bWVudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaURBQTJCO0FBQzNCLHVEQUEyQztBQUUzQzs7R0FFRztBQUNILElBQVksY0FPWDtBQVBELFdBQVksY0FBYztJQUN0Qiw2QkFBVyxDQUFBO0lBQ1gsK0JBQWEsQ0FBQTtJQUNiLCtCQUFhLENBQUE7SUFDYiwyQkFBUyxDQUFBO0lBQ1QscUNBQW1CLENBQUE7SUFDbkIsMkNBQXlCLENBQUE7QUFDN0IsQ0FBQyxFQVBXLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBT3pCO0FBVUQsTUFBYSxjQUFjO0lBSXZCLFlBQVksSUFBd0I7UUFDaEMscUVBQXFFO1FBQ3JFLElBQUksQ0FBQyxJQUFJLEdBQUcsRUFBd0IsQ0FBQztRQUNyQyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFL0IsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEdBQUcsWUFBSSxFQUFFLENBQUM7U0FDekI7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUF3QjtRQUNoQyxjQUFjLENBQUMsUUFBUSxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ25ELE9BQU8sY0FBYyxDQUFDLFFBQVEsQ0FBQztJQUNuQyxDQUFDO0lBRU8sYUFBYSxDQUFDLE1BQWM7UUFDaEMsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNoQyxPQUFPLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELElBQUksR0FBRztRQUNILE1BQU0sS0FBSyxHQUFHO1lBQ1YsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQztZQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVU7WUFDcEIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztZQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7U0FDZixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQixPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQztJQUVELElBQUksRUFBRTtRQUNGLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFHLENBQUM7SUFDekIsQ0FBQztJQUVELElBQUksSUFBSTtRQUNKLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDMUIsQ0FBQztJQUVELElBQUksTUFBTTtRQUNOLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDNUIsQ0FBQztJQUVELElBQUksYUFBYTtRQUNiLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUM7SUFDbkMsQ0FBQztJQUVELElBQUksVUFBVTtRQUNWLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDaEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxHQUFHO1FBQ04sT0FBTyxjQUFjLENBQUMsUUFBUSxDQUFDO0lBQ25DLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQXdCO1FBQy9CLE1BQU0sSUFBSSxHQUFHLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQztJQUNwQixDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFXO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0IsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNsQixNQUFNLElBQUksMEJBQU8sQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDcEU7UUFFRCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekQsTUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDbkMsT0FBTyxJQUFJLGNBQWMsQ0FBQztZQUN0QixhQUFhLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDO1lBQ25FLE1BQU0sRUFBRSxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTO1lBQ2pFLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFtQjtZQUN4QyxVQUFVLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1lBQ25DLEVBQUUsRUFBRSxFQUFFO1NBQ1QsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNKO0FBaEZELHdDQWdGQyJ9