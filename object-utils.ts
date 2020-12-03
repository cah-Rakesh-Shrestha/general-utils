import * as _ from "lodash";
import { OpError } from "errors-framework";

export class ObjectUtils {

    /** Dictionary Related */
    static getDictionaryItemWithLowestValue<T>(dictionary: _.Dictionary<T>): string {
        const itemWithLowestValue = _.first(_.sortBy(dictionary));
        return Object.keys(_.pickBy(dictionary, item => item === itemWithLowestValue))[0];

    }
}