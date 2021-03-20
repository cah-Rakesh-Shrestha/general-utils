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
exports.StringUtils = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RyaW5nLXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic3RyaW5nLXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSwwQ0FBNEI7QUFDNUIsdURBQTJDO0FBRTNDLE1BQWEsV0FBVztJQUVwQjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQywyQkFBMkIsQ0FDOUIsWUFBb0IsRUFDcEIsZ0JBQXdCLEVBQ3hCLGNBQXNCLEVBQ3RCLGlCQUEwQjtRQUcxQiwwRUFBMEU7UUFDMUUsSUFBSSxXQUFXLEdBQUcsSUFBSSxNQUFNLENBQ3hCLGdCQUFnQjtjQUNkLE1BQU07Y0FDTixjQUFjLEVBQ2QsR0FBRyxDQUFDLENBQUM7UUFFWCxNQUFNLGlCQUFpQixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFMUQsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ25ELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDcEIsTUFBTSxJQUFJLDBCQUFPLENBQ2IsV0FBVyxDQUFDLElBQUksRUFDaEIsNkJBQTZCLEVBQzdCLDZEQUE2RCxDQUNoRSxDQUFDO2FBQ0w7WUFFRCwwREFBMEQ7WUFDMUQsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUUsRUFBRTtnQkFDL0MsSUFBSSxPQUFPLGVBQWUsS0FBSyxRQUFRLEVBQUU7b0JBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksTUFBTSxDQUNsQixnQkFBZ0I7MEJBQ2QsR0FBRyxHQUFHLEVBQUU7MEJBQ1IsY0FBYyxFQUNkLEdBQUcsQ0FBQyxDQUFDO29CQUNYLFlBQVksR0FBRyxZQUFZLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxlQUFlLENBQUMsQ0FBQztpQkFDL0Q7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUVILDZGQUE2RjtZQUM3RixNQUFNLHlCQUF5QixHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEUsSUFBSSx5QkFBeUIsSUFBSSx5QkFBeUIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNuRSxNQUFNLElBQUksMEJBQU8sQ0FDYixXQUFXLENBQUMsSUFBSSxFQUNoQix3QkFBd0IsRUFDeEIsMkVBQTJFLENBQzlFLENBQUM7YUFDTDtTQUVKO1FBRUQsT0FBTyxZQUFZLENBQUM7SUFDeEIsQ0FBQztDQUNKO0FBM0RELGtDQTJEQyJ9