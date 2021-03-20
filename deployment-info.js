"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeploymentInfo = exports.DeploymentType = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1pbmZvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGVwbG95bWVudC1pbmZvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLGlEQUEyQjtBQUMzQix1REFBMkM7QUFFM0M7O0dBRUc7QUFDSCxJQUFZLGNBT1g7QUFQRCxXQUFZLGNBQWM7SUFDdEIsNkJBQVcsQ0FBQTtJQUNYLCtCQUFhLENBQUE7SUFDYiwrQkFBYSxDQUFBO0lBQ2IsMkJBQVMsQ0FBQTtJQUNULHFDQUFtQixDQUFBO0lBQ25CLDJDQUF5QixDQUFBO0FBQzdCLENBQUMsRUFQVyxjQUFjLEdBQWQsc0JBQWMsS0FBZCxzQkFBYyxRQU96QjtBQVVELE1BQWEsY0FBYztJQUl2QixZQUFZLElBQXdCO1FBQ2hDLHFFQUFxRTtRQUNyRSxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQXdCLENBQUM7UUFDckMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9CLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRTtZQUNmLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLFlBQUksRUFBRSxDQUFDO1NBQ3pCO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBd0I7UUFDaEMsY0FBYyxDQUFDLFFBQVEsR0FBRyxJQUFJLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUM7SUFDbkMsQ0FBQztJQUVPLGFBQWEsQ0FBQyxNQUFjO1FBQ2hDLE1BQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDaEMsT0FBTyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxJQUFJLEdBQUc7UUFD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