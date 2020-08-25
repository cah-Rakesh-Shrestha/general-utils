"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const errors_framework_1 = require("errors-framework");
class StringHelper {
    /**
     * Substitute palceholders in given strings with respective parameterised values
     *
     * @param searchString
     * @param replacementParams
     */
    static substitutePlaceholderParams(searchString, searchStartBound, searchEndBound, replacementParams) {
        // Check if searchString has any placeholder variables that need replacing
        var searchRegex = new RegExp(searchStartBound
            + "\\w+"
            + searchEndBound, "g");
        const placeholderParams = searchString.match(searchRegex);
        if (placeholderParams && placeholderParams.length > 0) {
            if (!replacementParams) {
                throw new errors_framework_1.OpError(StringHelper.name, "substitutePlaceholderParams", `at least one placeholder param is required for substitution`);
            }
            // Do variable substitution with respective string values 
            _.each(replacementParams, (substituteValue, key) => {
                if (typeof substituteValue === "string") {
                    var regex = new RegExp(searchStartBound
                        + `${key}`
                        + searchEndBound, "g");
                    searchString = searchString.replace(regex, substituteValue);
                }
            });
            // Finally check if searchString still have any un-substituted placholder variables left over
            const palceholderVariablesCheck = searchString.match(searchRegex);
            if (palceholderVariablesCheck && palceholderVariablesCheck.length > 0) {
                throw new errors_framework_1.OpError(StringHelper.name, "substituteStringParams", `All of the placeholder params in given search string were not substituted`);
            }
        }
        return searchString;
    }
}
exports.StringHelper = StringHelper;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLWhlbHBlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInN0cmluZy1oZWxwZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsMENBQTRCO0FBQzVCLHVEQUEyQztBQUUzQyxNQUFhLFlBQVk7SUFFckI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsMkJBQTJCLENBQzlCLFlBQW9CLEVBQ3BCLGdCQUF3QixFQUN4QixjQUFzQixFQUN0QixpQkFBMEI7UUFHMUIsMEVBQTBFO1FBQzFFLElBQUksV0FBVyxHQUFHLElBQUksTUFBTSxDQUN4QixnQkFBZ0I7Y0FDZCxNQUFNO2NBQ04sY0FBYyxFQUNkLEdBQUcsQ0FBQyxDQUFDO1FBRVgsTUFBTSxpQkFBaUIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRTFELElBQUksaUJBQWlCLElBQUksaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNuRCxJQUFJLENBQUMsaUJBQWlCLEVBQUU7Z0JBQ3BCLE1BQU0sSUFBSSwwQkFBTyxDQUNiLFlBQVksQ0FBQyxJQUFJLEVBQ2pCLDZCQUE2QixFQUM3Qiw2REFBNkQsQ0FDaEUsQ0FBQzthQUNMO1lBRUQsMERBQTBEO1lBQzFELENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQyxlQUFlLEVBQUUsR0FBRyxFQUFFLEVBQUU7Z0JBQy9DLElBQUksT0FBTyxlQUFlLEtBQUssUUFBUSxFQUFFO29CQUNyQyxJQUFJLEtBQUssR0FBRyxJQUFJLE1BQU0sQ0FDbEIsZ0JBQWdCOzBCQUNkLEdBQUcsR0FBRyxFQUFFOzBCQUNSLGNBQWMsRUFDZCxHQUFHLENBQUMsQ0FBQztvQkFDWCxZQUFZLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsZUFBZSxDQUFDLENBQUM7aUJBQy9EO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFFSCw2RkFBNkY7WUFDN0YsTUFBTSx5QkFBeUIsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ2xFLElBQUkseUJBQXlCLElBQUkseUJBQXlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDbkUsTUFBTSxJQUFJLDBCQUFPLENBQ2IsWUFBWSxDQUFDLElBQUksRUFDakIsd0JBQXdCLEVBQ3hCLDJFQUEyRSxDQUM5RSxDQUFDO2FBQ0w7U0FFSjtRQUVELE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7Q0FDSjtBQTNERCxvQ0EyREMifQ==