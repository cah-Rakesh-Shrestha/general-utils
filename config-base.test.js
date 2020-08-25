"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const config_base_1 = require("./config-base");
const deployment_info_1 = require("./deployment-info");
describe("ConfigBase", () => {
    it("Has deployment info", () => {
        const config = new config_base_1.ConfigBase("com.scalamed.jest.dev.test-1");
        expect(config.deployment.companyDomain).toEqual("scalamed.com");
        expect(config.deployment.moduleName).toEqual("jest");
        expect(config.deployment.id).toEqual("test-1");
        expect(config.deployment.type).toEqual(deployment_info_1.DeploymentType.dev);
    });
    it("Can lock itself", () => {
        const config = new config_base_1.ConfigBase("com.scalamed.jest.dev.test-1");
        const locked = config.lock();
        //@ts-ignore
        expect(() => (locked.deployment.type = deployment_info_1.DeploymentType.staging)).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLWJhc2UudGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmZpZy1iYXNlLnRlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxnQkFBYztBQUNkLCtDQUEyQztBQUMzQyx1REFBbUQ7QUFFbkQsUUFBUSxDQUFDLFlBQVksRUFBRSxHQUFHLEVBQUU7SUFDeEIsRUFBRSxDQUFDLHFCQUFxQixFQUFFLEdBQUcsRUFBRTtRQUMzQixNQUFNLE1BQU0sR0FBRyxJQUFJLHdCQUFVLENBQUMsOEJBQThCLENBQUMsQ0FBQztRQUM5RCxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDaEUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsZ0NBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUMvRCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxpQkFBaUIsRUFBRSxHQUFHLEVBQUU7UUFDdkIsTUFBTSxNQUFNLEdBQUcsSUFBSSx3QkFBVSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFDOUQsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQzdCLFlBQVk7UUFDWixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksR0FBRyxnQ0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDOUUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUMsQ0FBQyJ9