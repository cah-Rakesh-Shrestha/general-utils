"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compare_versions_1 = __importDefault(require("compare-versions"));
class Semver {
    static compare(version1, version2) {
        /**
         * returns 1 if version1 > version2
         * returns 0 if version1 = version2
         * returns -1 if version1 < version2
         */
        return compare_versions_1.default(version1, version2);
    }
    static isValid(version) {
        return compare_versions_1.default.validate(version);
    }
    static isSame(version1, version2) {
        return compare_versions_1.default.compare(version1, version2, '=');
    }
    static isGreaterThan(version1, version2) {
        return compare_versions_1.default.compare(version1, version2, '>');
    }
    static isLessThan(version1, version2) {
        return compare_versions_1.default.compare(version1, version2, '<');
    }
    static isGreaterThanOrEqual(version1, version2) {
        return compare_versions_1.default.compare(version1, version2, '>=');
    }
    static isLessThanOrEqual(version1, version2) {
        return compare_versions_1.default.compare(version1, version2, '<=');
    }
}
exports.Semver = Semver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VtdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0Esd0VBQXFDO0FBRXJDLE1BQWEsTUFBTTtJQUVmLE1BQU0sQ0FBQyxPQUFPLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUM3Qzs7OztXQUlHO1FBQ0gsT0FBTywwQkFBTSxDQUFDLFFBQVEsRUFBRSxRQUFRLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFlO1FBQzFCLE9BQU8sMEJBQU0sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUM1QyxPQUFPLDBCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNuRCxPQUFPLDBCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE1BQU0sQ0FBQyxVQUFVLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUNoRCxPQUFPLDBCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDbkQsQ0FBQztJQUVELE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQzFELE9BQU8sMEJBQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQsTUFBTSxDQUFDLGlCQUFpQixDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDdkQsT0FBTywwQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BELENBQUM7Q0FFSjtBQW5DRCx3QkFtQ0MifQ==