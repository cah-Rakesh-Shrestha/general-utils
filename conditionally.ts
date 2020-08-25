import { Env } from "./env";
import * as _ from "lodash";

export enum SkipCondition {
    noExternalTests = "NO_EXTERNAL_TESTS",
    noBrokenTests = "NO_BROKEN_TESTS",
    noDBTests = "NO_DB_TESTS"
}

declare const it: any;
declare const describe: any;

const activeSkipConditions = [
    Env.getBoolean(SkipCondition.noExternalTests, "true")
        ? SkipCondition.noExternalTests
        : undefined,
    Env.getBoolean(SkipCondition.noBrokenTests, "true")
        ? SkipCondition.noBrokenTests
        : undefined,
    Env.getBoolean(SkipCondition.noDBTests, "false")
        ? SkipCondition.noDBTests
        : undefined
];

export const conditionally = function(
    condition: SkipCondition | SkipCondition[]
) {
    const conditions = Array.isArray(condition) ? condition : [condition];

    if (_.intersection(activeSkipConditions, conditions).length === 0) {
        // the given condition(s) not currently active
        return {
            it,
            describe
        };
    } else {
        // we need to skip
        return {
            it: (name: string, cb?: Function, timeout?: number) => {
                it(`SKIPPING: ${name}`, () => {}, timeout);
            },
            describe: (name: string, cb?: Function) => {
                return describe(name, () => {
                    it(`SKIPPING: ${name}`, () => {});
                });
            }
        };
    }
};
