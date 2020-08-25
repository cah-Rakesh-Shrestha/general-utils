import "jest";
import { CanonicalDate } from "./canonical-date";

describe("Canonical Date", () => {
    it("creates CanonicalDate", () => {
        expect(() => CanonicalDate.create(-1, 1, 2001)).toThrow();
        expect(() => CanonicalDate.create(32, 1, 2001)).toThrow();
        expect(() => CanonicalDate.create(1, -1, 2001)).toThrow();
        expect(() => CanonicalDate.create(1, 13, 2001)).toThrow();
        expect(() => CanonicalDate.create(1, 13, 2)).toThrow();
        expect(() => CanonicalDate.create(1, 13, 20)).toThrow();
        expect(() => CanonicalDate.create(1, 13, 200)).toThrow();
        expect(CanonicalDate.create(1, 1, 2001)).toHaveProperty("day", 1);
    });

    it("tests fromDate", () => {
        expect(() => CanonicalDate.fromDate(new Date("13/13/2010"))).toThrow();
        const today = new Date();
        expect(CanonicalDate.fromDate(today)).toHaveProperty(
            "day",
            today.getDate()
        );
    });

    it("tests fromCanonicalNumber", () => {
        expect(() => CanonicalDate.fromCanonicalNumber(1)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(10)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(101)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(1010)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(10101)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(101010)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(1010101)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(10101313)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(10001000)).toThrow();
        expect(() => CanonicalDate.fromCanonicalNumber(1000100000)).toThrow();

        expect(CanonicalDate.fromCanonicalNumber(20140201)).toHaveProperty(
            "day",
            1
        );
    });

    it("tests toCanonicalNumber", () => {
        expect(() => CanonicalDate.toCanonicalNumber(0, 0, 2100)).toThrow();
        expect(() => CanonicalDate.toCanonicalNumber(1, 0, 2100)).toThrow();
        expect(() => CanonicalDate.toCanonicalNumber(1, 1, 1)).toThrow();
        expect(() => CanonicalDate.toCanonicalNumber(1, 1, 10)).toThrow();
        expect(() => CanonicalDate.toCanonicalNumber(1, 1, 100)).toThrow();

        expect(CanonicalDate.toCanonicalNumber(1, 1, 2001)).toBe(20010101);
    });
});
