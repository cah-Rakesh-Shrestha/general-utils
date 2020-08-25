"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("jest");
const package_utils_1 = require("./package-utils");
class Base {
    constructor() {
        this.vBase = "vBase";
    }
    fBase() {
        return "fBase";
    }
    fCommon() {
        return "base:common";
    }
}
class Extension {
    constructor() {
        this.vExtension = "vExtension";
    }
    fExtension() {
        return "fExtension";
    }
    fCommon() {
        return "extension:common";
    }
}
describe("PackageUtils", () => {
    const subject1 = package_utils_1.PackageUtils.extend(new Base(), new Extension());
    const subject2 = package_utils_1.PackageUtils.extend(new Base(), new Extension());
    it("Makes base properties available", () => {
        expect(subject1.vBase).toEqual("vBase");
    });
    it("Makes extension properties available", () => {
        expect(subject1.vBase).toEqual("vBase");
    });
    it("Makes base methods available", () => {
        expect(subject1.fBase()).toEqual("fBase");
    });
    it("Makes extension methods available", () => {
        expect(subject1.fExtension()).toEqual("fExtension");
    });
    it("Overrides base properties when necessary", () => {
        expect(subject1.fCommon()).toEqual("extension:common");
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS11dGlscy50ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFja2FnZS11dGlscy50ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsZ0JBQWM7QUFDZCxtREFBK0M7QUFFL0MsTUFBTSxJQUFJO0lBQVY7UUFDRSxVQUFLLEdBQUcsT0FBTyxDQUFDO0lBT2xCLENBQUM7SUFOQyxLQUFLO1FBQ0gsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUNELE9BQU87UUFDTCxPQUFPLGFBQWEsQ0FBQztJQUN2QixDQUFDO0NBQ0Y7QUFFRCxNQUFNLFNBQVM7SUFBZjtRQUNFLGVBQVUsR0FBRyxZQUFZLENBQUM7SUFPNUIsQ0FBQztJQU5DLFVBQVU7UUFDUixPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBQ0QsT0FBTztRQUNMLE9BQU8sa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBRUQsUUFBUSxDQUFDLGNBQWMsRUFBRSxHQUFHLEVBQUU7SUFDNUIsTUFBTSxRQUFRLEdBQUcsNEJBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFDbEUsTUFBTSxRQUFRLEdBQUcsNEJBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsRUFBRSxJQUFJLFNBQVMsRUFBRSxDQUFDLENBQUM7SUFFbEUsRUFBRSxDQUFDLGlDQUFpQyxFQUFFLEdBQUcsRUFBRTtRQUN6QyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxQyxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQ0FBc0MsRUFBRSxHQUFHLEVBQUU7UUFDOUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsOEJBQThCLEVBQUUsR0FBRyxFQUFFO1FBQ3RDLE1BQU0sQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUMsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUNBQW1DLEVBQUUsR0FBRyxFQUFFO1FBQzNDLE1BQU0sQ0FBQyxRQUFRLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7SUFDdEQsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsMENBQTBDLEVBQUUsR0FBRyxFQUFFO1FBQ2xELE1BQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUN6RCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIn0=