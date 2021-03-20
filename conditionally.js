"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conditionally = exports.SkipCondition = void 0;
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
const conditionally = function (condition) {
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
exports.conditionally = conditionally;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZGl0aW9uYWxseS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbmRpdGlvbmFsbHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtCQUE0QjtBQUM1QiwwQ0FBNEI7QUFFNUIsSUFBWSxhQUlYO0FBSkQsV0FBWSxhQUFhO0lBQ3JCLHNEQUFxQyxDQUFBO0lBQ3JDLGtEQUFpQyxDQUFBO0lBQ2pDLDBDQUF5QixDQUFBO0FBQzdCLENBQUMsRUFKVyxhQUFhLEdBQWIscUJBQWEsS0FBYixxQkFBYSxRQUl4QjtBQUtELE1BQU0sb0JBQW9CLEdBQUc7SUFDekIsU0FBRyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsZUFBZSxFQUFFLE1BQU0sQ0FBQztRQUNqRCxDQUFDLENBQUMsYUFBYSxDQUFDLGVBQWU7UUFDL0IsQ0FBQyxDQUFDLFNBQVM7SUFDZixTQUFHLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO1FBQy9DLENBQUMsQ0FBQyxhQUFhLENBQUMsYUFBYTtRQUM3QixDQUFDLENBQUMsU0FBUztJQUNmLFNBQUcsQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUM7UUFDNUMsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxTQUFTO1FBQ3pCLENBQUMsQ0FBQyxTQUFTO0NBQ2xCLENBQUM7QUFFSyxNQUFNLGFBQWEsR0FBRyxVQUN6QixTQUEwQztJQUUxQyxNQUFNLFVBQVUsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFdEUsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLG9CQUFvQixFQUFFLFVBQVUsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDL0QsOENBQThDO1FBQzlDLE9BQU87WUFDSCxFQUFFO1lBQ0YsUUFBUTtTQUNYLENBQUM7S0FDTDtTQUFNO1FBQ0gsa0JBQWtCO1FBQ2xCLE9BQU87WUFDSCxFQUFFLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBYSxFQUFFLE9BQWdCLEVBQUUsRUFBRTtnQkFDbEQsRUFBRSxDQUFDLGFBQWEsSUFBSSxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUUsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9DLENBQUM7WUFDRCxRQUFRLEVBQUUsQ0FBQyxJQUFZLEVBQUUsRUFBYSxFQUFFLEVBQUU7Z0JBQ3RDLE9BQU8sUUFBUSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUU7b0JBQ3ZCLEVBQUUsQ0FBQyxhQUFhLElBQUksRUFBRSxFQUFFLEdBQUcsRUFBRSxHQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxDQUFDLENBQUMsQ0FBQztZQUNQLENBQUM7U0FDSixDQUFDO0tBQ0w7QUFDTCxDQUFDLENBQUM7QUF4QlcsUUFBQSxhQUFhLGlCQXdCeEIifQ==