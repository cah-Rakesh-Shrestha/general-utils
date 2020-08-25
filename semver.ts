import { OpError } from "errors-framework";
import semver from "compare-versions"

export class Semver {

    static compare(version1: string, version2: string) {
        /**
         * returns 1 if version1 > version2
         * returns 0 if version1 = version2
         * returns -1 if version1 < version2
         */
        return semver(version1, version2);
    }

    static isValid(version: string) {
        return semver.validate(version);
    }

    static isSame(version1: string, version2: string){
        return semver.compare(version1, version2, '=');
    }

    static isGreaterThan(version1: string, version2: string){
        return semver.compare(version1, version2, '>');
    }

    static isLessThan(version1: string, version2: string){
        return semver.compare(version1, version2, '<');
    }

    static isGreaterThanOrEqual(version1: string, version2: string){
        return semver.compare(version1, version2, '>=');
    }

    static isLessThanOrEqual(version1: string, version2: string){
        return semver.compare(version1, version2, '<=');
    }
        
}
