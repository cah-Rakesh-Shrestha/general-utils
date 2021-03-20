"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviveDatesInProperties = exports.reviveDate = void 0;
const regexIso8601 = /^(\d{4}|\+\d{6})(?:-(\d{2})(?:-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2})(\.(\d{1,}))?(Z|([\-+])(\d{2}):(\d{2}))?)?)?)?$/;
function reviveDate(value) {
    let testValue = value;
    if (testValue) {
        if (testValue[0] === '"') {
            testValue = testValue.slice(1);
        }
        if (testValue[testValue.length - 1] === '"') {
            testValue = testValue.substr(0, testValue.length - 2);
        }
    }
    if (typeof testValue !== "string" ||
        isNaN(Date.parse(testValue)) ||
        !testValue ||
        testValue.length <= 4 ||
        !regexIso8601.test(testValue)) {
        return value;
    }
    else {
        const date = new Date(Date.parse(testValue));
        return date;
    }
}
exports.reviveDate = reviveDate;
function reviveDatesInProperties(target) {
    const keys = Object.keys(target);
    keys.forEach(k => {
        if (!target[k]) {
            // do nothing
        }
        else if (typeof target[k] === "string") {
            target[k] = reviveDate(target[k]);
        }
        else if (typeof target[k] === "object") {
            target[k] = reviveDatesInProperties(target[k]);
        }
    });
    return target;
}
exports.reviveDatesInProperties = reviveDatesInProperties;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yZXZpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0ZS1yZXZpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sWUFBWSxHQUFHLGtIQUFrSCxDQUFDO0FBQ3hJLFNBQWdCLFVBQVUsQ0FBQyxLQUFhO0lBQ3BDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQztJQUV0QixJQUFJLFNBQVMsRUFBRTtRQUNYLElBQUksU0FBUyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUN0QixTQUFTLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUNsQztRQUNELElBQUksU0FBUyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ3pDLFNBQVMsR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQ3pEO0tBQ0o7SUFFRCxJQUNJLE9BQU8sU0FBUyxLQUFLLFFBQVE7UUFDN0IsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDNUIsQ0FBQyxTQUFTO1FBQ1YsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDO1FBQ3JCLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFDL0I7UUFDRSxPQUFPLEtBQUssQ0FBQztLQUNoQjtTQUFNO1FBQ0gsTUFBTSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sSUFBSSxDQUFDO0tBQ2Y7QUFDTCxDQUFDO0FBeEJELGdDQXdCQztBQUVELFNBQWdCLHVCQUF1QixDQUFtQixNQUFTO0lBQy9ELE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFnQixDQUFDO0lBQ2hELElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ1osYUFBYTtTQUNoQjthQUFNLElBQUksT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBUSxDQUFRLENBQUM7U0FDbkQ7YUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLFFBQVEsRUFBRTtZQUN0QyxNQUFNLENBQUMsQ0FBQyxDQUFDLEdBQUcsdUJBQXVCLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFRLENBQUM7U0FDekQ7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUM7QUFiRCwwREFhQyJ9