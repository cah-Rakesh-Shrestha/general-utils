import uuid from "uuid/v1";
import { OpError } from "errors-framework";

/**
 * Enumerates possible deployment types
 */
export enum DeploymentType {
    dev = "dev",
    demo = "demo",
    test = "test",
    qa = "qa",
    staging = "staging",
    production = "production"
}

export type DeploymentInfoSpec = {
    companyDomain: string;
    type: DeploymentType;
    region?: string;
    moduleName: string;
    id?: string;
};

export class DeploymentInfo {
    private static instance: DeploymentInfo;
    private readonly spec: DeploymentInfoSpec;

    constructor(spec: DeploymentInfoSpec) {
        // make copy of spec so there's no unexpected modification for caller
        this.spec = {} as DeploymentInfoSpec;
        Object.assign(this.spec, spec);

        if (!this.spec.id) {
            this.spec.id = uuid();
        }
    }

    static init(spec: DeploymentInfoSpec) {
        DeploymentInfo.instance = new DeploymentInfo(spec);
        return DeploymentInfo.instance;
    }

    private reverseDomain(domain: string) {
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
        return this.spec.id!;
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

    static FQN(spec: DeploymentInfoSpec): string {
        const temp = new DeploymentInfo(spec);
        return temp.fqn;
    }

    static parseFQN(fqn: string) {
        const parts = fqn.split(".");

        if (parts.length < 4) {
            throw new OpError("DeploymentInfo", "parseFQN", "Malformed fqn");
        }

        const typeAndRegion = parts[parts.length - 2].split("-");
        const id = parts[parts.length - 1];
        return new DeploymentInfo({
            companyDomain: parts.slice(0, parts.length - 3).reverse().join("."),
            region: typeAndRegion.length === 2 ? typeAndRegion[1] : undefined,
            type: typeAndRegion[0] as DeploymentType,
            moduleName: parts[parts.length - 3],
            id: id
        });
    }
}
