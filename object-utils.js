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
class ObjectUtils {
    /** Dictionary Related */
    static getDictionaryItemWithLowestValue(dictionary) {
        const itemWithLowestValue = _.first(_.sortBy(dictionary));
        return Object.keys(_.pickBy(dictionary, item => item === itemWithLowestValue))[0];
    }
}
exports.ObjectUtils = ObjectUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2JqZWN0LXV0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsib2JqZWN0LXV0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLDBDQUE0QjtBQUc1QixNQUFhLFdBQVc7SUFFcEIseUJBQXlCO0lBQ3pCLE1BQU0sQ0FBQyxnQ0FBZ0MsQ0FBSSxVQUEyQjtRQUNsRSxNQUFNLG1CQUFtQixHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFdEYsQ0FBQztDQUNKO0FBUkQsa0NBUUMifQ==