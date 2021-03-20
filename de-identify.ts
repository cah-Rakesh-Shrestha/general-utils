/**
 * De-identifies protected health information in accordance 
 * with the HIPAA privacy rule using Safe Harbor Method
 * --------------------------------------------------------
 */
import moment from 'moment';
import _ from "lodash";
import { CanonicalDate } from "./canonical-date";

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

export type SourceDataType = string | number;
export enum DeIdentifyStrategy {
    Age = 'Age',
    Dob = 'Dob',
    Hide = 'Hide',
    Redact = 'Redact',
    ZipCode = 'ZipCode',
}

export class DeIdentify {


    /**
     * Sanitise given object with given strategy config
     * @param entityItem 
     * @param strategyConfig 
     */
    static sanitiseEntityItem(entityItem: any, strategyConfig: any) {
        const sanitisedEntityItem = Object.assign({});
        _.forEach(entityItem, (itemValue, itemKey) => {
            const strategy = _.get(strategyConfig, itemKey);
            if (strategy) {
                if (strategy === DeIdentifyStrategy.Hide) {
                    _.unset(sanitisedEntityItem, itemKey);
                } else {
                    _.set(sanitisedEntityItem, itemKey, DeIdentify.sanitise(itemValue, strategy));
                }
            } else {
                _.set(sanitisedEntityItem, itemKey, itemValue);
            }
        })
        return sanitisedEntityItem;
    }

    /**
     * Sanitise onlt hidden properties
     * @param entityItem 
     * @param strategyConfig 
     */
     static sanitiseOnlyHidden(entityItem: any, strategyConfig: any) {
        const sanitisedEntityItem = Object.assign({});
        _.forEach(entityItem, (itemValue, itemKey) => {
            const strategy = _.get(strategyConfig, itemKey);
            if (strategy) {
                if (strategy === DeIdentifyStrategy.Hide) {
                    _.unset(sanitisedEntityItem, itemKey);
                } else {
                    _.set(sanitisedEntityItem, itemKey, itemValue);
                }
            } else {
                _.set(sanitisedEntityItem, itemKey, itemValue);
            }
        })
        return sanitisedEntityItem;
    }



    static sanitise(data: SourceDataType, strategy: DeIdentifyStrategy): string {
        switch (strategy) {
            case DeIdentifyStrategy.Age:
                return DeIdentify.sanitiseAge(data).toString();

            case DeIdentifyStrategy.Dob:
                return DeIdentify.sanitiseDob(data);

            case DeIdentifyStrategy.ZipCode:
                return DeIdentify.sanitiseZipCode(data)

            case DeIdentifyStrategy.Redact:
            default:
                return DeIdentify.redact(data);

        }
    }


    static sanitiseAge(data: SourceDataType | Date): number {
        const yearDiff = CanonicalDate.getYearDiff(data);
        return yearDiff >= DE_IDENTIFIED_AGE_THRESHOLD ? DE_IDENTIFIED_AGE_THRESHOLD : yearDiff;

    }


    static sanitiseDob(data: SourceDataType | Date): string {
        let sanitisedDob: moment.Moment;
        const yearDiff = CanonicalDate.getYearDiff(data);

        if (yearDiff >= DE_IDENTIFIED_AGE_THRESHOLD) {
            sanitisedDob = moment().subtract(DE_IDENTIFIED_AGE_THRESHOLD, 'years');
        } else {
            sanitisedDob = moment(data);
        }

        return sanitisedDob.format('YYYY');
    }


    static sanitiseZipCode(data: SourceDataType) {
        let dataToSanitise = typeof data === "number" ?
            data.toString() :
            data;
        if (USZipWithPopulationLT20K.includes(dataToSanitise)) {
            return ANONIMISED_ZIP_CODE;
        } else {
            return dataToSanitise.slice(0, DE_IDENTIFIED_ZIP_CODE_LENGTH);
        }
    }

    static redact(data: SourceDataType): string {
        return '';
    }

}