"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CanonicalDate = void 0;
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
exports.CanonicalDate = CanonicalDate;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fub25pY2FsLWRhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjYW5vbmljYWwtZGF0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1REFBMkM7QUFDM0Msb0RBQXVCO0FBQ3ZCLG9EQUE0QjtBQUU1QixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQztBQUNuQyxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUM7QUFDOUIsTUFBTSxpQkFBaUIsR0FBVyxDQUFDLENBQUM7QUFFcEMsTUFBTSxRQUFRLEdBQUcsSUFBSSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDO0FBSXJDLE1BQWEsYUFBYTtJQUt0QixZQUFvQixHQUFXLEVBQUUsS0FBYSxFQUFFLElBQVk7UUFDeEQsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUM7UUFDaEIsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELDZEQUE2RDtJQUM3RCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQVU7UUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUNkLElBQUksQ0FBQyxPQUFPLEVBQUUsRUFDZCxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQ3JCLENBQUM7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFXLEVBQUUsS0FBVztRQUNsQyxPQUFPLENBQ0gsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQyxpQkFBaUIsRUFBRTtZQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLGlCQUFpQixFQUFFLENBQzNDLENBQUM7SUFDTixDQUFDO0lBRUQsTUFBTSxDQUFDLFNBQXdCO1FBQzNCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixFQUFFLEtBQUssU0FB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