"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Semver = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VtdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VtdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUNBLHdFQUFxQztBQUVyQyxNQUFhLE1BQU07SUFFZixNQUFNLENBQUMsT0FBTyxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDN0M7Ozs7V0FJRztRQUNILE9BQU8sMEJBQU0sQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBZTtRQUMxQixPQUFPLDBCQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDNUMsT0FBTywwQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxNQUFNLENBQUMsYUFBYSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDbkQsT0FBTywwQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxNQUFNLENBQUMsVUFBVSxDQUFDLFFBQWdCLEVBQUUsUUFBZ0I7UUFDaEQsT0FBTywwQkFBTSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxNQUFNLENBQUMsb0JBQW9CLENBQUMsUUFBZ0IsRUFBRSxRQUFnQjtRQUMxRCxPQUFPLDBCQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDcEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxRQUFnQixFQUFFLFFBQWdCO1FBQ3ZELE9BQU8sMEJBQU0sQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0NBRUo7QUFuQ0Qsd0JBbUNDIn0=