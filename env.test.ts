import "jest";
import { Env, ValueDefaults } from "./env";
import { DeploymentType } from "./deployment-info";

describe("Env", () => {
    it("lookupString works", () => {
        process.env.VALUE_1 = "value1";
        expect(Env.lookupString("VALUE_1")).toBe("value1");
    });

    it("lookupInt works", () => {
        process.env.VALUE_1 = "1";
        expect(Env.lookupInt("VALUE_1")).toBe(1);
        expect(Env.lookupInt("VALUE_2")).toBeUndefined();
        expect(Env.lookupInt("VALUE_2", 2)).toBe(2);
    });

    it("lookupFloat works", () => {
        process.env.VALUE_1 = "5.45";
        expect(Env.lookupFloat("VALUE_1")).toBe(5.45);
    });

    it("lookupStringArray works", () => {
        process.env.VALUE_1 = "hello, world";
        expect(Env.lookupStringArray("VALUE_1")).toEqual(["hello", "world"]);
    });

    it("lookupBoolean returns true if lookup value exists", () => {
        process.env.VALUE_1 = "not empty";
        expect(Env.lookupBoolean("VALUE_1")).toBeTruthy();
    });

    it("lookupBoolean returns false if lookup value does not exist", () => {
        expect(Env.lookupBoolean("NOT_EXISTENT_VALUE")).toBeFalsy();
    });

    it("lookupJson returns Json if lookup value exists", () => {
        process.env.JSON_VALUE = '{"key": "value"}';
        const expectedValue = { key: "value" };
        expect(Env.lookupJson("JSON_VALUE")).toEqual(expectedValue);
    });

    it("lookupJson with defaults returns Json", () => {
        const expectedValue = { key: "value" };
        expect(Env.lookupJson("JSON_DEFAULT_VALUE", '{"key": "value"}')).toEqual(expectedValue);
    });

    it("lookupJson returns undefined if lookup value does not exist", () => {
        expect(Env.lookupJson("NOT_EXISTENT_VALUE")).toBeUndefined();
    });

    it("getString works", () => {
        process.env.VALUE_1 = "value1";
        expect(Env.getString("VALUE_1")).toBe("value1");
    });

    it("getInt works", () => {
        process.env.VALUE_1 = "1";
        expect(Env.getInt("VALUE_1")).toBe(1);
    });

    it("getFloat works", () => {
        process.env.VALUE_1 = "5.45";
        expect(Env.getFloat("VALUE_1")).toBe(5.45);
    });

    it("getStringArray works", () => {
        process.env.VALUE_1 = "hello, world";
        expect(Env.getStringArray("VALUE_1")).toEqual(["hello", "world"]);
    });

    it("getString blows up if value does not exist", () => {
        delete process.env.VALUE_1;
        expect(() => Env.getString("VALUE_1")).toThrow();
    });

    it("Standard Defaults work", () => {
        const defaults: ValueDefaults<string> = {
            dev: "dev",
            demo: "demo",
            qa: "qa",
            test: "test",
            staging: "staging",
            production: "prod"
        };
        process.env.DEPLOYMENT_TYPE = "dev";
        expect(Env.getString("VALUE_1", defaults)).toEqual("dev");
    });

    it("Custom defaults work", () => {
        process.env.DEPLOYMENT_TYPE = "dev";
        expect(Env.getString("VALUE_1", "hello")).toEqual("hello");
    });

    it("Custom defaults error out in prod", () => {
        process.env.DEPLOYMENT_TYPE = DeploymentType.production;
        expect(() => Env.getString("VALUE_1", "hello")).toThrow();
    });

    it("getJson returns Json if lookup value exists", () => {
        process.env.DEPLOYMENT_TYPE = "dev";
        process.env.JSON_VALUE = '{"key": "value"}';
        const expectedValue = { key: "value" };
        expect(Env.getJson("JSON_VALUE")).toEqual(expectedValue);
    });

    it("getJson with defaults returns Json", () => {
        const expectedValue = { key: "value" };
        expect(Env.getJson("JSON_DEFAULT_VALUE", '{"key": "value"}')).toEqual(expectedValue);
    });

    it("getJson throws undefined if value does not exist", () => {
        expect(() => Env.getJson("NOT_EXISTENT_VALUE")).toThrow();
    });

    it("getSecret returns secret accessor", () => {
        process.env.DEPLOYMENT_TYPE = "dev";
        process.env.VALUE_1 = new Date().toString();
        expect(Env.getSecretString("VALUE_1").secret).toEqual(
            process.env.VALUE_1
        );
    });
});
