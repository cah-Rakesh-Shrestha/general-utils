import "jest";
import { ConfigBase } from "./config-base";
import { DeploymentType } from "./deployment-info";

describe("ConfigBase", () => {
    it("Has deployment info", () => {
        const config = new ConfigBase("com.scalamed.jest.dev.test-1");
        expect(config.deployment.companyDomain).toEqual("scalamed.com");
        expect(config.deployment.moduleName).toEqual("jest");
        expect(config.deployment.id).toEqual("test-1");
        expect(config.deployment.type).toEqual(DeploymentType.dev);
    });

    it("Can lock itself", () => {
        const config = new ConfigBase("com.scalamed.jest.dev.test-1");
        const locked = config.lock();
        //@ts-ignore
        expect(() => (locked.deployment.type = DeploymentType.staging)).toThrow();
    });
});
