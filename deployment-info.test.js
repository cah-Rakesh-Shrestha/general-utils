"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const deployment_info_1 = require("./deployment-info");
describe("DeploymentId", () => {
    it("Generates an FQN using static method", () => {
        const result = deployment_info_1.DeploymentInfo.FQN({
            companyDomain: "some-company.com.au",
            region: "us",
            moduleName: "some-system",
            type: deployment_info_1.DeploymentType.dev,
            id: "test-1"
        });
        expect(result).toBe("au.com.some-company.some-system.dev-us.test-1");
    });
    it("Generates an FQN using static method without region", () => {
        const result = deployment_info_1.DeploymentInfo.FQN({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: deployment_info_1.DeploymentType.production,
            id: "test-1"
        });
        expect(result).toBe("au.com.some-company.some-system.production.test-1");
    });
    it("Generates an FQN using singleton method without region", () => {
        deployment_info_1.DeploymentInfo.init({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: deployment_info_1.DeploymentType.production,
            id: "test-1"
        });
        expect(deployment_info_1.DeploymentInfo.get().fqn).toBe("au.com.some-company.some-system.production.test-1");
    });
    it("Generates an id using singleton method", () => {
        deployment_info_1.DeploymentInfo.init({
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            type: deployment_info_1.DeploymentType.production
        });
        expect(deployment_info_1.DeploymentInfo.get().id).toBeDefined();
    });
    it("Has correct property values using singleton method", () => {
        const spec = {
            companyDomain: "some-company.com.au",
            moduleName: "some-system",
            region: "au",
            type: deployment_info_1.DeploymentType.staging,
            id: "test-1"
        };
        deployment_info_1.DeploymentInfo.init(spec);
        const result = deployment_info_1.DeploymentInfo.get();
        expect(result.companyDomain).toBe(spec.companyDomain);
        expect(result.moduleName).toBe(spec.moduleName);
        expect(result.region).toBe(spec.region);
        expect(result.type).toBe(spec.type);
        expect(result.id).toBe(spec.id);
    });
    it("Can parse an FQN with a region spec", () => {
        const result = deployment_info_1.DeploymentInfo.parseFQN("au.com.some-company.some-system.dev-us.test-1");
        expect(result.companyDomain).toBe("some-company.com.au");
        expect(result.moduleName).toBe("some-system");
        expect(result.type).toBe(deployment_info_1.DeploymentType.dev);
        expect(result.region).toBe("us");
        expect(result.id).toBe("test-1");
    });
    it("Can parse an FQN without a region spec", () => {
        const result = deployment_info_1.DeploymentInfo.parseFQN("au.com.some-company.some-system.production.test-1");
        expect(result.companyDomain).toBe("some-company.com.au");
        expect(result.moduleName).toBe("some-system");
        expect(result.type).toBe(deployment_info_1.DeploymentType.production);
        expect(result.id).toBe("test-1");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVwbG95bWVudC1pbmZvLnRlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZXBsb3ltZW50LWluZm8udGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGdCQUFjO0FBQ2QsdURBQW1FO0FBRW5FLFFBQVEsQ0FBQyxjQUFjLEVBQUUsR0FBRyxFQUFFO0lBQzFCLEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDNUMsTUFBTSxNQUFNLEdBQUcsZ0NBQWMsQ0FBQyxHQUFHLENBQUM7WUFDOUIsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxNQUFNLEVBQUUsSUFBSTtZQUNaLFVBQVUsRUFBRSxhQUFhO1lBQ3pCLElBQUksRUFBRSxnQ0FBYyxDQUFDLEdBQUc7WUFDeEIsRUFBRSxFQUFFLFFBQVE7U0FDZixDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLCtDQUErQyxDQUFDLENBQUM7SUFDekUsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMscURBQXFELEVBQUUsR0FBRyxFQUFFO1FBQzNELE1BQU0sTUFBTSxHQUFHLGdDQUFjLENBQUMsR0FBRyxDQUFDO1lBQzlCLGFBQWEsRUFBRSxxQkFBcUI7WUFDcEMsVUFBVSxFQUFFLGFBQWE7WUFDekIsSUFBSSxFQUFFLGdDQUFjLENBQUMsVUFBVTtZQUMvQixFQUFFLEVBQUUsUUFBUTtTQUNmLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsbURBQW1ELENBQUMsQ0FBQztJQUM3RSxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyx3REFBd0QsRUFBRSxHQUFHLEVBQUU7UUFDOUQsZ0NBQWMsQ0FBQyxJQUFJLENBQUM7WUFDaEIsYUFBYSxFQUFFLHFCQUFxQjtZQUNwQyxVQUFVLEVBQUUsYUFBYTtZQUN6QixJQUFJLEVBQUUsZ0NBQWMsQ0FBQyxVQUFVO1lBQy9CLEVBQUUsRUFBRSxR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