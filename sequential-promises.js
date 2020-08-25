"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class SequentialPromisesError {
    constructor(errors, results) {
        this.errors = errors;
        this.results = results;
    }
}
exports.SequentialPromisesError = SequentialPromisesError;
class SequentialPromises {
    static all(promises, interval = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            let idx = 0;
            const errors = [];
            const results = [];
            return new Promise((resolve, reject) => {
                function next() {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (idx > promises.length - 1) {
                            if (errors.length) {
                                reject(new SequentialPromisesError(errors, results));
                            }
                            resolve(results);
                        }
                        else {
                            try {
                                const result = yield promises[idx++]();
                                results.push(result);
                            }
                            catch (e) {
                                errors.push(e);
                            }
                            setTimeout(next, interval);
                        }
                    });
                }
                setTimeout(next, 0);
            });
        });
    }
}
exports.SequentialPromises = SequentialPromises;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbC1wcm9taXNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcXVlbnRpYWwtcHJvbWlzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUVBLE1BQWEsdUJBQXVCO0lBSWhDLFlBQVksTUFBYSxFQUFFLE9BQVk7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7SUFDM0IsQ0FBQztDQUNKO0FBUkQsMERBUUM7QUFFRCxNQUFhLGtCQUFrQjtJQUMzQixNQUFNLENBQU8sR0FBRyxDQUNaLFFBQThCLEVBQzlCLFFBQVEsR0FBRyxDQUFDOztZQUVaLElBQUksR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNaLE1BQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztZQUN6QixNQUFNLE9BQU8sR0FBUSxFQUFFLENBQUM7WUFFeEIsT0FBTyxJQUFJLE9BQU8sQ0FBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDeEMsU0FBZSxJQUFJOzt3QkFDZixJQUFJLEdBQUcsR0FBRyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTs0QkFDM0IsSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO2dDQUNmLE1BQU0sQ0FBQyxJQUFJLHVCQUF1QixDQUFDLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDOzZCQUN4RDs0QkFDRCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7eUJBQ3BCOzZCQUFNOzRCQUNILElBQUk7Z0NBQ0EsTUFBTSxNQUFNLEdBQUcsTUFBTSxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBRSxDQUFDO2dDQUN2QyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOzZCQUN4Qjs0QkFBQyxPQUFPLENBQUMsRUFBRTtnQ0FDUixNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDOzZCQUNsQjs0QkFDRCxVQUFVLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO3lCQUM5QjtvQkFDTCxDQUFDO2lCQUFBO2dCQUVELFVBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO0tBQUE7Q0FDSjtBQTlCRCxnREE4QkMifQ==