import "jest";
import { Semver } from "./semver";

describe("Semver tests", () => {
    it("validates given semver", () => {
        expect(Semver.isValid("abc")).toBeFalsy();
        expect(Semver.isValid("1.2-rc.3")).toBeFalsy();
        expect(Semver.isValid("a.b.c")).toBeFalsy();
        expect(Semver.isValid("a.1.b")).toBeFalsy();
        expect(Semver.isValid("1.2.a")).toBeFalsy();
        expect(Semver.isValid(">1.2.3")).toBeFalsy();
        expect(Semver.isValid(">=1.2.3")).toBeFalsy();
        expect(Semver.isValid("^1.2.3")).toBeFalsy();

        expect(Semver.isValid("1.2.3")).toBeTruthy();
        expect(Semver.isValid("1")).toBeTruthy();
        expect(Semver.isValid("0.1")).toBeTruthy();
        expect(Semver.isValid("00.1.0003")).toBeTruthy();
        expect(Semver.isValid("00.1.0003.004")).toBeTruthy();
        expect(Semver.isValid("1.2.3-rc-4")).toBeTruthy();
    });

    
    it("checks if given 2 semvers are equal", () => {
        expect(() => Semver.isSame("abc", "1.2.3")).toThrow();
        expect(() => Semver.isSame("1.2-rc.3", "1.2-rc.3")).toThrow();
        expect(() => Semver.isSame("a.b.c", "a.b")).toThrow();
        expect(() => Semver.isSame("a.1.b", "a.1.b.c")).toThrow();

        expect(Semver.isSame("1.2.3", "1.2")).toBeFalsy();
        expect(Semver.isSame("00.1.0003.004", "0.1.0003")).toBeFalsy();
        expect(Semver.isSame("1.2.3-rc-4", "1.2.3")).toBeFalsy();

        expect(Semver.isSame("1","01")).toBeTruthy();
        expect(Semver.isSame("0001","01")).toBeTruthy();
        expect(Semver.isSame("0001","1")).toBeTruthy();
        expect(Semver.isSame("0.1", "0.1.0")).toBeTruthy();
        expect(Semver.isSame("00.01.3.0", "0.01.3")).toBeTruthy();
        expect(Semver.isSame("00.1.0003", "0.1.0003")).toBeTruthy();
    });


    it("checks if semver 1 is greater than semver 2", () => {
        expect(() => Semver.isGreaterThan("abc", "def")).toThrow();
        expect(() => Semver.isGreaterThan("1.2-rc.3", "1.2.3-rc.3")).toThrow();
        expect(() => Semver.isGreaterThan("a.b.c", "a.b")).toThrow();
        expect(() => Semver.isGreaterThan("a.1.b", "a.0.b")).toThrow();
        expect(Semver.isGreaterThan("1.2.3", "1.2")).toBeTruthy();
        expect(Semver.isGreaterThan("00.1.0003.004", "0.1.0003")).toBeTruthy();
        expect(Semver.isGreaterThan("1","01")).toBeFalsy();
        expect(Semver.isGreaterThan("0001","01")).toBeFalsy();
        expect(Semver.isGreaterThan("0001","10")).toBeFalsy();
        expect(Semver.isGreaterThan("0.1.0", "0.1")).toBeFalsy();
        expect(Semver.isGreaterThan("2.5.1", "2.15.0")).toBeFalsy();
        expect(Semver.isGreaterThan("00.1.3.0", "0.01.2")).toBeTruthy();
        expect(Semver.isGreaterThan("2", "1.99.99")).toBeTruthy();
        expect(Semver.isGreaterThan("2", "1")).toBeTruthy();
    });

    it("checks if semver 1 is lesser than semver 2", () => {
        expect(() => Semver.isLessThan("abc", "def")).toThrow();
        expect(Semver.isLessThan("1.2.3", "1.2")).toBeFalsy();
        expect(Semver.isLessThan("00.1.0003.004", "0.1.0003")).toBeFalsy();
        expect(Semver.isLessThan("1","01")).toBeFalsy();
        expect(Semver.isLessThan("0001","01")).toBeFalsy();
        expect(Semver.isLessThan("0001","10")).toBeTruthy();
        expect(Semver.isLessThan("0.1.0", "0.1")).toBeFalsy();
        expect(Semver.isLessThan("2.5.1", "2.15.0")).toBeTruthy();
        expect(Semver.isLessThan("00.1.3.0", "0.01.2")).toBeFalsy();
        expect(Semver.isLessThan("1.99.99", "2")).toBeTruthy();
        expect(Semver.isLessThan("2.0", "2.0.1")).toBeTruthy();
    });
    
    it("checks if semver 1 is greater than or equal to semver 2", () => {
        expect(() => Semver.isGreaterThanOrEqual("abc", "def")).toThrow();
        expect(() => Semver.isGreaterThanOrEqual("1.2-rc.3", "1.2.3-rc.3")).toThrow();
        expect(Semver.isGreaterThanOrEqual("1.2.3", "1.2")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("00.1.0003.004", "0.1.0003")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("1","01")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("0001","01")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("0001","10")).toBeFalsy();
        expect(Semver.isGreaterThanOrEqual("0.1.0", "0.1")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("2.5.1", "2.15.0")).toBeFalsy();
        expect(Semver.isGreaterThanOrEqual("00.1.3.0", "0.01.2")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("2", "1.99.99")).toBeTruthy();
        expect(Semver.isGreaterThanOrEqual("2", "1")).toBeTruthy();
    });

});
