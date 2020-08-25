"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./env");
const _ = __importStar(require("lodash"));
var SkipCondition;
(function (SkipCondition) {
    SkipCondition["noExternalTests"] = "NO_EXTERNAL_TESTS";
    SkipCondition["noBrokenTests"] = "NO_BROKEN_TESTS";
    SkipCondition["noDBTests"] = "NO_DB_TESTS";
})(SkipCondition = exports.SkipCondition || (exports.SkipCondition = {}));
const activeSkipConditions = [
    env_1.Env.getBoolean(SkipCondition.noExternalTests, "true")
        ? SkipCondition.noExternalTests
        : undefined,
    env_1.Env.getBoolean(SkipCondition.noBrokenTests, "true")
        ? SkipCondition.noBrokenTests
        : undefined,
    env_1.Env.getBoolean(SkipCondition.noDBTests, "false")
        ? SkipCondition.noDBTests
        : undefined
];
exports.conditionally = function (condition) {
    const conditions = Array.isArray(condition) ? condition : [condition];
    if (_.intersection(activeSkipConditions, conditions).length === 0) {
        // the given condition(s) not currently active
        return {
            it,
            describe
        };
    }
    else {
        // we need to skip
        return {
            it: (name, cb, timeout) => {
                it(`SKIPPING: ${name}`, () => { }, timeout);
            },
            describe: (name, cb) => {
                return describe(name, () => {
                    it(`SKIPPING: ${name}`, () => { });
                });
            }
        };
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uYWxseS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmRpdGlvbmFsbHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsK0JBQTRCO0FBQzVCLDBDQUE0QjtBQUU1QixJQUFZLGFBSVg7QUFKRCxXQUFZLGFBQWE7SUFDckIsc0RBQXFDLENBQUE7SUFDckMsa0RBQWlDLENBQUE7SUFDakMsMENBQXlCLENBQUE7QUFDN0IsQ0FBQyxFQUpXLGFBQWEsR0FBYixxQkFBYSxLQUFiLHFCQUFhLFFBSXhCO0FBS0QsTUFBTSxvQkFBb0IsR0FBRztJQUN6QixTQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxlQUFlLEVBQUUsTUFBTSxDQUFDO1FBQ2pELENBQUMsQ0FBQyxhQUFhLENBQUMsZUFBZTtRQUMvQixDQUFDLENBQUMsU0FBUztJQUNmLFNBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUM7UUFDL0MsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxhQUFhO1FBQzdCLENBQUMsQ0FBQyxTQUFTO0lBQ2YsU0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQztRQUM1QyxDQUFDLENBQUMsYUFBYSxDQUFDLFNBQVM7UUFDekIsQ0FBQyxDQUFDLFNBQVM7Q0FDbEIsQ0FBQztBQUVXLFFBQUEsYUFBYSxHQUFHLFVBQ3pCLFNBQTBDO0lBRTFDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUV0RSxJQUFJLENBQUMsQ0FBQyxZQUFZLENBQUMsb0JBQW9CLEVBQUUsVUFBVSxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUMvRCw4Q0FBOEM7UUFDOUMsT0FBTztZQUNILEVBQUU7WUFDRixRQUFRO1NBQ1gsQ0FBQztLQUNMO1NBQU07UUFDSCxrQkFBa0I7UUFDbEIsT0FBTztZQUNILEVBQUUsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFhLEVBQUUsT0FBZ0IsRUFBRSxFQUFFO2dCQUNsRCxFQUFFLENBQUMsYUFBYSxJQUFJLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDL0MsQ0FBQztZQUNELFFBQVEsRUFBRSxDQUFDLElBQVksRUFBRSxFQUFhLEVBQUUsRUFBRTtnQkFDdEMsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRTtvQkFDdkIsRUFBRSxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3RDLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQztTQUNKLENBQUM7S0FDTDtBQUNMLENBQUMsQ0FBQyJ9