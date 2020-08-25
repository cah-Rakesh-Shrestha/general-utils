import * as _ from "lodash";
import { OpError } from "errors-framework";

export class StringHelper {

    /**
     * Substitute palceholders in given strings with respective parameterised values
     * 
     * @param searchString
     * @param replacementParams 
     */
    static substitutePlaceholderParams(
        searchString: string,
        searchStartBound: string,
        searchEndBound: string,
        replacementParams?: object,
    ): string {

        // Check if searchString has any placeholder variables that need replacing
        var searchRegex = new RegExp(
            searchStartBound
            + "\\w+"
            + searchEndBound
            , "g");

        const placeholderParams = searchString.match(searchRegex);

        if (placeholderParams && placeholderParams.length > 0) {
            if (!replacementParams) {
                throw new OpError(
                    StringHelper.name,
                    "substitutePlaceholderParams",
                    `at least one placeholder param is required for substitution`
                );
            }

            // Do variable substitution with respective string values 
            _.each(replacementParams, (substituteValue, key) => {
                if (typeof substituteValue === "string") {
                    var regex = new RegExp(
                        searchStartBound
                        + `${key}`
                        + searchEndBound
                        , "g");
                    searchString = searchString.replace(regex, substituteValue);
                }
            });

            // Finally check if searchString still have any un-substituted placholder variables left over
            const palceholderVariablesCheck = searchString.match(searchRegex);
            if (palceholderVariablesCheck && palceholderVariablesCheck.length > 0) {
                throw new OpError(
                    StringHelper.name,
                    "substituteStringParams",
                    `All of the placeholder params in given search string were not substituted`
                );
            }

        }

        return searchString;
    }
}