"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeIdentify = exports.DeIdentifyStrategy = void 0;
/**
 * De-identifies protected health information in accordance
 * with the HIPAA privacy rule using Safe Harbor Method
 * --------------------------------------------------------
 */
const moment_1 = __importDefault(require("moment"));
const lodash_1 = __importDefault(require("lodash"));
const canonical_date_1 = require("./canonical-date");
const DE_IDENTIFIED_AGE_THRESHOLD = 90;
const DE_IDENTIFIED_ZIP_CODE_LENGTH = 3;
const ANONIMISED_ZIP_CODE = "000";
/**
 * List of US zip codes with population less than 20,000
 * Valid as at: 2020-06-12
 *
 * Note: since this very short list best to keep it as local const for simplicity.
 * That said update this list every 6 months or so.
 */
const USZipWithPopulationLT20K = [
    "036",
    "059",
    "102",
    "203",
    "205",
    "369",
    "556",
    "692",
    "821",
    "823",
    "878",
    "879",
    "884",
    "893"
];
var DeIdentifyStrategy;
(function (DeIdentifyStrategy) {
    DeIdentifyStrategy["Age"] = "Age";
    DeIdentifyStrategy["Dob"] = "Dob";
    DeIdentifyStrategy["Hide"] = "Hide";
    DeIdentifyStrategy["Redact"] = "Redact";
    DeIdentifyStrategy["ZipCode"] = "ZipCode";
})(DeIdentifyStrategy = exports.DeIdentifyStrategy || (exports.DeIdentifyStrategy = {}));
class DeIdentify {
    /**
     * Sanitise given object with given strategy config
     * @param entityItem
     * @param strategyConfig
     */
    static sanitiseEntityItem(entityItem, strategyConfig) {
        const sanitisedEntityItem = Object.assign({});
        lodash_1.default.forEach(entityItem, (itemValue, itemKey) => {
            const strategy = lodash_1.default.get(strategyConfig, itemKey);
            if (strategy) {
                if (strategy === DeIdentifyStrategy.Hide) {
                    lodash_1.default.unset(sanitisedEntityItem, itemKey);
                }
                else {
                    lodash_1.default.set(sanitisedEntityItem, itemKey, DeIdentify.sanitise(itemValue, strategy));
                }
            }
            else {
                lodash_1.default.set(sanitisedEntityItem, itemKey, itemValue);
            }
        });
        return sanitisedEntityItem;
    }
    /**
     * Sanitise onlt hidden properties
     * @param entityItem
     * @param strategyConfig
     */
    static sanitiseOnlyHidden(entityItem, strategyConfig) {
        const sanitisedEntityItem = Object.assign({});
        lodash_1.default.forEach(entityItem, (itemValue, itemKey) => {
            const strategy = lodash_1.default.get(strategyConfig, itemKey);
            if (strategy) {
                if (strategy === DeIdentifyStrategy.Hide) {
                    lodash_1.default.unset(sanitisedEntityItem, itemKey);
                }
                else {
                    lodash_1.default.set(sanitisedEntityItem, itemKey, itemValue);
                }
            }
            else {
                lodash_1.default.set(sanitisedEntityItem, itemKey, itemValue);
            }
        });
        return sanitisedEntityItem;
    }
    static sanitise(data, strategy) {
        switch (strategy) {
            case DeIdentifyStrategy.Age:
                return DeIdentify.sanitiseAge(data).toString();
            case DeIdentifyStrategy.Dob:
                return DeIdentify.sanitiseDob(data);
            case DeIdentifyStrategy.ZipCode:
                return DeIdentify.sanitiseZipCode(data);
            case DeIdentifyStrategy.Redact:
            default:
                return DeIdentify.redact(data);
        }
    }
    static sanitiseAge(data) {
        const yearDiff = canonical_date_1.CanonicalDate.getYearDiff(data);
        return yearDiff >= DE_IDENTIFIED_AGE_THRESHOLD ? DE_IDENTIFIED_AGE_THRESHOLD : yearDiff;
    }
    static sanitiseDob(data) {
        let sanitisedDob;
        const yearDiff = canonical_date_1.CanonicalDate.getYearDiff(data);
        if (yearDiff >= DE_IDENTIFIED_AGE_THRESHOLD) {
            sanitisedDob = moment_1.default().subtract(DE_IDENTIFIED_AGE_THRESHOLD, 'years');
        }
        else {
            sanitisedDob = moment_1.default(data);
        }
        return sanitisedDob.format('YYYY');
    }
    static sanitiseZipCode(data) {
        let dataToSanitise = typeof data === "number" ?
            data.toString() :
            data;
        if (USZipWithPopulationLT20K.includes(dataToSanitise)) {
            return ANONIMISED_ZIP_CODE;
        }
        else {
            return dataToSanitise.slice(0, DE_IDENTIFIED_ZIP_CODE_LENGTH);
        }
    }
    static redact(data) {
        return '';
    }
}
exports.DeIdentify = DeIdentify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGUtaWRlbnRpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZS1pZGVudGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7OztHQUlHO0FBQ0gsb0RBQTRCO0FBQzVCLG9EQUF1QjtBQUN2QixxREFBaUQ7QUFFakQsTUFBTSwyQkFBMkIsR0FBRyxFQUFFLENBQUM7QUFDdkMsTUFBTSw2QkFBNkIsR0FBRyxDQUFDLENBQUM7QUFDeEMsTUFBTSxtQkFBbUIsR0FBRyxLQUFLLENBQUM7QUFFbEM7Ozs7OztHQU1HO0FBQ0gsTUFBTSx3QkFBd0IsR0FBRztJQUM3QixLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztDQUNSLENBQUM7QUFHRixJQUFZLGtCQU1YO0FBTkQsV0FBWSxrQkFBa0I7SUFDMUIsaUNBQVcsQ0FBQTtJQUNYLGlDQUFXLENBQUE7SUFDWCxtQ0FBYSxDQUFBO0lBQ2IsdUNBQWlCLENBQUE7SUFDakIseUNBQW1CLENBQUE7QUFDdkIsQ0FBQyxFQU5XLGtCQUFrQixHQUFsQiwwQkFBa0IsS0FBbEIsMEJBQWtCLFFBTTdCO0FBRUQsTUFBYSxVQUFVO0lBR25COzs7O09BSUc7SUFDSCxNQUFNLENBQUMsa0JBQWtCLENBQUMsVUFBZSxFQUFFLGNBQW1CO1FBQzFELE1BQU0sbUJBQW1CLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QyxnQkFBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLEVBQUU7WUFDekMsTUFBTSxRQUFRLEdBQUcsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQ2hELElBQUksUUFBUSxFQUFFO2dCQUNWLElBQUksUUFBUSxLQUFLLGtCQUFrQixDQUFDLElBQUksRUFBRTtvQkFDdEMsZ0JBQUMsQ0FBQyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxDQUFDLENBQUM7aUJBQ3pDO3FCQUFNO29CQUNILGdCQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO2lCQUNqRjthQUNKO2lCQUFNO2dCQUNILGdCQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNsRDtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNGLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFlLEVBQUUsY0FBbUI7UUFDM0QsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLGdCQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUN6QyxNQUFNLFFBQVEsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsSUFBSSxRQUFRLEVBQUU7Z0JBQ1YsSUFBSSxRQUFRLEtBQUssa0JBQWtCLENBQUMsSUFBSSxFQUFFO29CQUN0QyxnQkFBQyxDQUFDLEtBQUssQ0FBQyxtQkFBbUIsRUFBRSxPQUFPLENBQUMsQ0FBQztpQkFDekM7cUJBQU07b0JBQ0gsZ0JBQUMsQ0FBQyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUNsRDthQUNKO2lCQUFNO2dCQUNILGdCQUFDLENBQUMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNsRDtRQUNMLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxtQkFBbUIsQ0FBQztJQUMvQixDQUFDO0lBSUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFvQixFQUFFLFFBQTRCO1FBQzlELFFBQVEsUUFBUSxFQUFFO1lBQ2QsS0FBSyxrQkFBa0IsQ0FBQyxHQUFHO2dCQUN2QixPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7WUFFbkQsS0FBSyxrQkFBa0IsQ0FBQyxHQUFHO2dCQUN2QixPQUFPLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7WUFFeEMsS0FBSyxrQkFBa0IsQ0FBQyxPQUFPO2dCQUMzQixPQUFPLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLENBQUE7WUFFM0MsS0FBSyxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7WUFDL0I7Z0JBQ0ksT0FBTyxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBRXRDO0lBQ0wsQ0FBQztJQUdELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBMkI7UUFDMUMsTUFBTSxRQUFRLEdBQUcsOEJBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakQsT0FBTyxRQUFRLElBQUksMkJBQTJCLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUM7SUFFNUYsQ0FBQztJQUdELE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBMkI7UUFDMUMsSUFBSSxZQUEyQixDQUFDO1FBQ2hDLE1BQU0sUUFBUSxHQUFHLDhCQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRWpELElBQUksUUFBUSxJQUFJLDJCQUEyQixFQUFFO1lBQ3pDLFlBQVksR0FBRyxnQkFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLDJCQUEyQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQzFFO2FBQU07WUFDSCxZQUFZLEdBQUcsZ0JBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQjtRQUVELE9BQU8sWUFBWSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBR0QsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFvQjtRQUN2QyxJQUFJLGNBQWMsR0FBRyxPQUFPLElBQUksS0FBSyxRQUFRLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztZQUNqQixJQUFJLENBQUM7UUFDVCxJQUFJLHdCQUF3QixDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUNuRCxPQUFPLG1CQUFtQixDQUFDO1NBQzlCO2FBQU07WUFDSCxPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLDZCQUE2QixDQUFDLENBQUM7U0FDakU7SUFDTCxDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFvQjtRQUM5QixPQUFPLEVBQUUsQ0FBQztJQUNkLENBQUM7Q0FFSjtBQXhHRCxnQ0F3R0MifQ==