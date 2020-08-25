"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGUtaWRlbnRpZnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJkZS1pZGVudGlmeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7O0dBSUc7QUFDSCxvREFBNEI7QUFDNUIsb0RBQXVCO0FBQ3ZCLHFEQUFpRDtBQUVqRCxNQUFNLDJCQUEyQixHQUFHLEVBQUUsQ0FBQztBQUN2QyxNQUFNLDZCQUE2QixHQUFHLENBQUMsQ0FBQztBQUN4QyxNQUFNLG1CQUFtQixHQUFHLEtBQUssQ0FBQztBQUVsQzs7Ozs7O0dBTUc7QUFDSCxNQUFNLHdCQUF3QixHQUFHO0lBQzdCLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0lBQ0wsS0FBSztJQUNMLEtBQUs7SUFDTCxLQUFLO0NBQ1IsQ0FBQztBQUdGLElBQVksa0JBTVg7QUFORCxXQUFZLGtCQUFrQjtJQUMxQixpQ0FBVyxDQUFBO0lBQ1gsaUNBQVcsQ0FBQTtJQUNYLG1DQUFhLENBQUE7SUFDYix1Q0FBaUIsQ0FBQTtJQUNqQix5Q0FBbUIsQ0FBQTtBQUN2QixDQUFDLEVBTlcsa0JBQWtCLEdBQWxCLDBCQUFrQixLQUFsQiwwQkFBa0IsUUFNN0I7QUFFRCxNQUFhLFVBQVU7SUFHbkI7Ozs7T0FJRztJQUNILE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFlLEVBQUUsY0FBbUI7UUFDMUQsTUFBTSxtQkFBbUIsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLGdCQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsRUFBRSxPQUFPLEVBQUUsRUFBRTtZQUN6QyxNQUFNLFFBQVEsR0FBRyxnQkFBQyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDaEQsSUFBSSxRQUFR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