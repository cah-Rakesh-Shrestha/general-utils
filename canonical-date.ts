import { OpError } from "errors-framework";
import _ from "lodash";
import moment from 'moment';

const CanonicalDateRegEx = /\d{8}/;
const FullYearRegEx = /\d{4}/;
const ApproximateOffset: number = 1;

const MsPerDay = 1000 * 60 * 60 * 24;

export type DateItemType = string | number | Date;

export class CanonicalDate {
    private readonly _day: number;
    private readonly _month: number;
    private readonly _year: number;

    private constructor(day: number, month: number, year: number) {
        this._day = day;
        this._month = month;
        this._year = year;
    }

    /** creates a new CanonicalDate from the given date object */
    static fromDate(date: Date): CanonicalDate {
        return this.create(
            date.getDate(),
            date.getMonth() + 1,
            date.getFullYear()
        );
    }

    static isSame(date1: Date, date2: Date) {
        return (
            this.fromDate(date1).toCanonicalNumber() ===
            this.fromDate(date2).toCanonicalNumber()
        );
    }

    isSame(canonical: CanonicalDate) {
        return this.toCanonicalNumber() === canonical.toCanonicalNumber();
    }

    isApproximatelySame(canonical: CanonicalDate) {
        const lowOffsetDate = this.toDate();
        lowOffsetDate.setDate(lowOffsetDate.getDate() - ApproximateOffset);

        const highOffsetDate = this.toDate();
        highOffsetDate.setDate(highOffsetDate.getDate() + ApproximateOffset);

        return CanonicalDate.fromDate(lowOffsetDate).toCanonicalNumber() === canonical.toCanonicalNumber()
            || CanonicalDate.fromDate(highOffsetDate).toCanonicalNumber() === canonical.toCanonicalNumber()
            || this.toCanonicalNumber() === canonical.toCanonicalNumber();

    }

    /** Creates a CanonicalDate from a number in the format YYYYMMDD */
    static fromCanonicalNumber(num: number): CanonicalDate {
        const numString = num.toString();
        if (CanonicalDateRegEx.test(numString)) {
            const year = numString.substr(0, 4);
            const month = numString.substr(4, 2);
            const day = numString.substr(6, 2);
            return this.create(
                Number.parseInt(day),
                Number.parseInt(month),
                Number.parseInt(year)
            );
        }
        throw new OpError(
            CanonicalDate.name,
            "fromCanonicalNumber",
            "Number should be exactly of 8 digits"
        );
    }

    /** returns the canonical date as a number in the format YYYYMMDD */
    toCanonicalNumber(): number {
        return Number.parseInt(
            `${this.year}${_.padStart(
                this.month.toString(),
                2,
                "0"
            )}${_.padStart(this.day.toString(), 2, "0")}`
        );
    }

    /** returns the canonical date as a number in the format YYYYMMDD */
    static toCanonicalNumber(day: number, month: number, year: number): number {
        const cd = this.create(day, month, year);
        return cd.toCanonicalNumber();
    }

    toDate(): Date {
        return new Date(this.year, this.month - 1, this.day);
    }

    /** converts the given values to a number in the format YYYYMMDD */
    static create(day: number, month: number, year: number): CanonicalDate {
        if (
            day >= 1 &&
            day <= 31 &&
            month >= 1 &&
            month <= 12 &&
            FullYearRegEx.test(year.toString())
        ) {
            return new CanonicalDate(day, month, year);
        } else {
            throw new OpError(
                CanonicalDate.name,
                "create",
                "Invalid input params provided"
            );
        }
    }

    get day(): number {
        return this._day;
    }
    get month(): number {
        return this._month;
    }
    get year(): number {
        return this._year;
    }

    /** return delta between two dates in days */
    static dateDiffInDays(date1: DateItemType, date2?: DateItemType) {
        const date1AsMoment = moment(date1);
        const date2AsMoment = date2 ? moment(date2) : moment();

        if (date1AsMoment.isValid() && date2AsMoment.isValid()) {
            return date2AsMoment.diff(date1, 'days', false);
        } else {
            throw new OpError(
                CanonicalDate.name,
                "getYearDiff",
                "given items are not valid date items"
            );
        }
    }

    static getYearDiff(date1: DateItemType, date2?: DateItemType) {
        const date1AsMoment = moment(date1);
        const date2AsMoment = date2 ? moment(date2) : moment();

        if (date1AsMoment.isValid() && date2AsMoment.isValid()) {
            return date2AsMoment.diff(date1, 'years', false);
        } else {
            throw new OpError(
                CanonicalDate.name,
                "getYearDiff",
                "given items are not valid date items"
            );
        }
    }

    static validateDateItem(item: DateItemType): void {
        if (!moment(item).isValid()) {
            throw new OpError(
                CanonicalDate.name,
                "validateDateItem",
                "given item is not a valid date item"
            );
        }
    }

    static getDayPeriod = () => {
        const currentTime = new Date();
        const currentHour = currentTime.getHours();

        if (currentHour < 12) {
            return 'morning';

        } else if (currentHour < 18) {
            return 'afternoon';

        } else {
            return 'evening';
        }
    }

}
