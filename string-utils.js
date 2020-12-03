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
class StringUtils {
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
                throw new errors_framework_1.OpError(StringUtils.name, "substitutePlaceholderParams", `at least one placeholder param is required for substitution`);
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
                throw new errors_framework_1.OpError(StringUtils.name, "substituteStringParams", `All of the placeholder params in given search string were not substituted`);
            }
        }
        return searchString;
    }
}
exports.StringUtils = StringUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RyaW5nLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUM1Qix1REFBMkM7QUFFM0MsTUFBYSxXQUFXO0lBRXBCOzs7OztPQUtHO0lBQ0gsTUFBTSxDQUFDLDJCQUEyQixDQUM5QixZQUFvQixFQUNwQixnQkFBd0IsRUFDeEIsY0FBc0IsRUFDdEIsaUJBQTBCO1FBRzFCLDBFQUEwRTtRQUMxRSxJQUFJLFdBQVcsR0FBRyxJQUFJLE1BQU0sQ0FDeEIsZ0JBQWdCO2NBQ2QsTUFBTTtjQUNOLGNBQWMsRUFDZCxHQUFHLENBQUMsQ0FBQztRQUVYLE1BQU0saUJBQWlCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUUxRCxJQUFJLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDbkQsSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUNwQixNQUFNLElBQUksMEJBQU8sQ0FDYixXQUFXLENBQUMsSUFBSSxFQUNoQiw2QkFBNkIsRUFDN0IsNkRBQTZELENBQ2hFLENBQUM7YUFDTDtZQUVELDBEQUEwRDtZQUMxRCxDQUFDLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxFQUFFO2dCQUMvQyxJQUFJLE9BQU8sZUFBZSxLQUFLLFFBQVEsRUFBRTtvQkFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQ2xCLGdCQUFnQjswQkFDZCxHQUFHLEdBQUcsRUFBRTswQkFDUixjQUFjLEVBQ2QsR0FBRyxDQUFDLENBQUM7b0JBQ1gsWUFBWSxHQUFHLFlBQVksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGVBQWUsQ0FBQyxDQUFDO2lCQUMvRDtZQUNMLENBQUMsQ0FBQyxDQUFDO1lBRUgsNkZBQTZGO1lBQzdGLE1BQU0seUJBQXlCLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNsRSxJQUFJLHlCQUF5QixJQUFJLHlCQUF5QixDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7Z0JBQ25FLE1BQU0sSUFBSSwwQkFBTyxDQUNiLFdBQVcsQ0FBQyxJQUFJLEVBQ2hCLHdCQUF3QixFQUN4QiwyRUFBMkUsQ0FDOUUsQ0FBQzthQUNMO1NBRUo7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN4QixDQUFDO0NBQ0o7QUEzREQsa0NBMkRDIn0=