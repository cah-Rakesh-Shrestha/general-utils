const regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(\.(\d{1,}))?(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
export function reviveDate(value: string) {
    let testValue = value;

    if (testValue) {
        if (testValue[0] === '"') {
            testValue = testValue.slice(1);
        }
        if (testValue[testValue.length - 1] === '"') {
            testValue = testValue.substr(0, testValue.length - 2);
        }
    }

    if (
        typeof testValue !== "string" ||
        isNaN(Date.parse(testValue)) ||
        !testValue ||
        testValue.length <= 4 ||
        !regexIso8601.test(testValue)
    ) {
        return value;
    } else {
        const date = new Date(Date.parse(testValue));
        return date;
    }
}

export function reviveDatesInProperties<T extends Object>(target: T) {
    const keys = Object.keys(target) as (keyof T)[];
    keys.forEach(k => {
        if (!target[k]) {
            // do nothing
        } else if (typeof target[k] === "string") {
            target[k] = reviveDate(target[k] as any) as any;
        } else if (typeof target[k] === "object") {
            target[k] = reviveDatesInProperties(target[k]) as any;
        }
    });

    return target;
}
