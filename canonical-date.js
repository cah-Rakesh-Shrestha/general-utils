"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errors_framework_1 = require("errors-framework");
const lodash_1 = __importDefault(require("lodash"));
const moment_1 = __importDefault(require("moment"));
const CanonicalDateRegEx = /\d{8}/;
const FullYearRegEx = /\d{4}/;
const ApproximateOffset = 1;
const MsPerDay = 1000 * 60 * 60 * 24;
class CanonicalDate {
    constructor(day, month, year) {
        this._day = day;
        this._month = month;
        this._year = year;
    }
    /** creates a new CanonicalDate from the given date object */
    static fromDate(date) {
        return this.create(date.getDate(), date.getMonth() + 1, date.getFullYear());
    }
    static isSame(date1, date2) {
        return (this.fromDate(date1).toCanonicalNumber() ===
            this.fromDate(date2).toCanonicalNumber());
    }
    isSame(canonical) {
        return this.toCanonicalNumber() === canonical.toCanonicalNumber();
    }
    isApproximatelySame(canonical) {
        const lowOffsetDate = this.toDate();
        lowOffsetDate.setDate(lowOffsetDate.getDate() - ApproximateOffset);
        const highOffsetDate = this.toDate();
        highOffsetDate.setDate(highOffsetDate.getDate() + ApproximateOffset);
        return CanonicalDate.fromDate(lowOffsetDate).toCanonicalNumber() === canonical.toCanonicalNumber()
            || CanonicalDate.fromDate(highOffsetDate).toCanonicalNumber() === canonical.toCanonicalNumber()
            || this.toCanonicalNumber() === canonical.toCanonicalNumber();
    }
    /** Creates a CanonicalDate from a number in the format YYYYMMDD */
    static fromCanonicalNumber(num) {
        const numString = num.toString();
        if (CanonicalDateRegEx.test(numString)) {
            const year = numString.substr(0, 4);
            const month = numString.substr(4, 2);
            const day = numString.substr(6, 2);
            return this.create(Number.parseInt(day), Number.parseInt(month), Number.parseInt(year));
        }
        throw new errors_framework_1.OpError(CanonicalDate.name, "fromCanonicalNumber", "Number should be exactly of 8 digits");
    }
    /** returns the canonical date as a number in the format YYYYMMDD */
    toCanonicalNumber() {
        return Number.parseInt(`${this.year}${lodash_1.default.padStart(this.month.toString(), 2, "0")}${lodash_1.default.padStart(this.day.toString(), 2, "0")}`);
    }
    /** returns the canonical date as a number in the format YYYYMMDD */
    static toCanonicalNumber(day, month, year) {
        const cd = this.create(day, month, year);
        return cd.toCanonicalNumber();
    }
    toDate() {
        return new Date(this.year, this.month - 1, this.day);
    }
    /** converts the given values to a number in the format YYYYMMDD */
    static create(day, month, year) {
        if (day >= 1 &&
            day <= 31 &&
            month >= 1 &&
            month <= 12 &&
            FullYearRegEx.test(year.toString())) {
            return new CanonicalDate(day, month, year);
        }
        else {
            throw new errors_framework_1.OpError(CanonicalDate.name, "create", "Invalid input params provided");
        }
    }
    get day() {
        return this._day;
    }
    get month() {
        return this._month;
    }
    get year() {
        return this._year;
    }
    /** return delta between two dates in days */
    static dateDiffInDays(date1, date2) {
        const date1AsMoment = moment_1.default(date1);
        const date2AsMoment = date2 ? moment_1.default(date2) : moment_1.default();
        if (date1AsMoment.isValid() && date2AsMoment.isValid()) {
            return date2AsMoment.diff(date1, 'days', false);
        }
        else {
            throw new errors_framework_1.OpError(CanonicalDate.name, "getYearDiff", "given items are not valid date items");
        }
    }
    static getYearDiff(date1, date2) {
        const date1AsMoment = moment_1.default(date1);
        const date2AsMoment = date2 ? moment_1.default(date2) : moment_1.default();
        if (date1AsMoment.isValid() && date2AsMoment.isValid()) {
            return date2AsMoment.diff(date1, 'years', false);
        }
        else {
            throw new errors_framework_1.OpError(CanonicalDate.name, "getYearDiff", "given items are not valid date items");
        }
    }
    static validateDateItem(item) {
        if (!moment_1.default(item).isValid()) {
            throw new errors_framework_1.OpError(CanonicalDate.name, "validateDateItem", "given item is not a valid date item");
        }
    }
}
CanonicalDate.getDayPeriod = () => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    if (currentHour < 12) {
        return 'morning';
    }
    else if (currentHour < 18) {
        return 'afternoon';
    }
    else {
        return 'evening';
    }
};
exports.CanonicalDate = CanonicalDate;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fub25pY2FsLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYW5vbmljYWwtZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVEQUEyQztBQUMzQyxvREFBdUI7QUFDdkIsb0RBQTRCO0FBRTVCLE1BQU0sa0JBQWtCLEdBQUcsT0FBTyxDQUFDO0FBQ25DLE1BQU0sYUFBYSxHQUFHLE9BQU8sQ0FBQztBQUM5QixNQUFNLGlCQUFpQixHQUFXLENBQUMsQ0FBQztBQUVwQyxNQUFNLFFBQVEsR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7QUFJckMsTUFBYSxhQUFhO0lBS3RCLFlBQW9CLEdBQVcsRUFBRSxLQUFhLEVBQUUsSUFBWTtRQUN4RCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNoQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQztRQUNwQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsNkRBQTZEO0lBQzdELE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBVTtRQUN0QixPQUFPLElBQUksQ0FBQyxNQUFNLENBQ2QsSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUNkLElBQUksQ0FBQyxRQUFRLEVBQUUsR0FBRyxDQUFDLEVBQ25CLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FDckIsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQVcsRUFBRSxLQUFXO1FBQ2xDLE9BQU8sQ0FDSCxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixFQUFFO1lBQ3hDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsaUJBQWlCLEVBQUUsQ0FDM0MsQ0FBQztJQUNOLENBQUM7SUFFRCxNQUFNLENBQUMsU0FBd0I7UUFDM0IsT0FBTyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsS0FBSyxTQUFT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