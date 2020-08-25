import "jest";
import { DeploymentInfo, DeploymentType } from "./deployment-info";

describe("DeploymentId", () => {
    it("Generates an FQN using static method", () => {
        const result = DeploymentInfo.FQN({
            companyDomain: "some-company.com.au",
            region: "us",
            moduleName: "some-system",
            type: DeploymentType.dev,
            id: "test-1"
        });

        expect(result).toBe("au.com.some-company.some-system.dev-us.test-1");
    });

    it("Generates an FQN using static method without region", () => {
        const result = DeploymentInfo.FQN({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: DeploymentType.production,
            id: "test-1"
        });

        expect(result).toBe("au.com.some-company.some-system.production.test-1");
    });

    it("Generates an FQN using singleton method without region", () => {
        DeploymentInfo.init({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: DeploymentType.production,
            id: "test-1"
        });

        expect(DeploymentInfo.get().fqn).toBe(
            "au.com.some-company.some-system.production.test-1"
        );
    });

    it("Generates an id using singleton method", () => {
        DeploymentInfo.init({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: DeploymentType.production
        });

        expect(DeploymentInfo.get().id).toBeDefined();
    });

    it("Has correct property values using singleton method", () => {
        const spec = {
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            region: "au",
            type: DeploymentType.staging,
            id: "test-1"
        };

        DeploymentInfo.init(spec);

        const result = DeploymentInfo.get();

        expect(result.companyDomain).toBe(spec.companyDomain);
        expect(result.moduleName).toBe(spec.moduleName);
        expect(result.region).toBe(spec.region);
        expect(result.type).toBe(spec.type);
        expect(result.id).toBe(spec.id);
    });

    it("Can parse an FQN with a region spec", () => {
        const result = DeploymentInfo.parseFQN(
            "au.com.some-company.some-system.dev-us.test-1"
        );

        expect(result.companyDomain).toBe("some-company.com.au");
        expect(result.moduleName).toBe("some-system");
        expect(result.type).toBe(DeploymentType.dev);
        expect(result.region).toBe("us");
        expect(result.id).toBe("test-1");
    });

    it("Can parse an FQN without a region spec", () => {
        const result = DeploymentInfo.parseFQN(
            "au.com.some-company.some-system.production.test-1"
        );

        expect(result.companyDomain).toBe("some-company.com.au");
        expect(result.moduleName).toBe("some-system");
        expect(result.type).toBe(DeploymentType.production);
        expect(result.id).toBe("test-1");
    });
});
