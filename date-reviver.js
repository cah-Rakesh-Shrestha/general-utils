"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yZXZpdmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiZGF0ZS1yZXZpdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsTUFBTSxZQUFZLEdBQUcsa0hBQWtILENBQUM7QUFDeEksU0FBZ0IsVUFBVSxDQUFDLEtBQWE7SUFDcEMsSUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDO0lBRXRCLElBQUksU0FBUyxFQUFFO1FBQ1gsSUFBSSxTQUFTLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxFQUFFO1lBQ3RCLFNBQVMsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xDO1FBQ0QsSUFBSSxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDekMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDekQ7S0FDSjtJQUVELElBQ0ksT0FBTyxTQUFTLEtBQUssUUFBUTtRQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUM1QixDQUFDLFNBQVM7UUFDVixTQUFTLENBQUMsTUFBTSxJQUFJLENBQUM7UUFDckIsQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUMvQjtRQUNFLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO1NBQU07UUFDSCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDN0MsT0FBTyxJQUFJLENBQUM7S0FDZjtBQUNMLENBQUM7QUF4QkQsZ0NBd0JDO0FBRUQsU0FBZ0IsdUJBQXVCLENBQW1CLE1BQVM7SUFDL0QsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQWdCLENBQUM7SUFDaEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNiLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDWixhQUFhO1NBQ2hCO2FBQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxRQUFRLEVBQUU7WUFDdEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFRLENBQVEsQ0FBQztTQUNuRDthQUFNLElBQUksT0FBTyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssUUFBUSxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyx1QkFBdUIsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQVEsQ0FBQztTQUN6RDtJQUNMLENBQUMsQ0FBQyxDQUFDO0lBRUgsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQztBQWJELDBEQWFDIn0=