"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequentialPromises = exports.SequentialPromisesError = void 0;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbC1wcm9taXNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcXVlbnRpYWwtcHJvbWlzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBRUEsTUFBYSx1QkFBdUI7SUFJaEMsWUFBWSxNQUFhLEVBQUUsT0FBWTtRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUMzQixDQUFDO0NBQ0o7QUFSRCwwREFRQztBQUVELE1BQWEsa0JBQWtCO0lBQzNCLE1BQU0sQ0FBTyxHQUFHLENBQ1osUUFBOEIsRUFDOUIsUUFBUSxHQUFHLENBQUM7O1lBRVosSUFBSSxHQUFHLEdBQUcsQ0FBQyxDQUFDO1lBQ1osTUFBTSxNQUFNLEdBQVUsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sT0FBTyxHQUFRLEVBQUUsQ0FBQztZQUV4QixPQUFPLElBQUksT0FBTyxDQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO2dCQUN4QyxTQUFlLElBQUk7O3dCQUNmLElBQUksR0FBRyxHQUFHLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFOzRCQUMzQixJQUFJLE1BQU0sQ0FBQyxNQUFNLEVBQUU7Z0NBQ2YsTUFBTSxDQUFDLElBQUksdUJBQXVCLENBQUMsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7NkJBQ3hEOzRCQUNELE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQzt5QkFDcEI7NkJBQU07NEJBQ0gsSUFBSTtnQ0FDQSxNQUFNLE1BQU0sR0FBRyxNQUFNLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0NBQ3ZDLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7NkJBQ3hCOzRCQUFDLE9BQU8sQ0FBQyxFQUFFO2dDQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7NkJBQ2xCOzRCQUNELFVBQVUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7eUJBQzlCO29CQUNMLENBQUM7aUJBQUE7Z0JBRUQsVUFBVSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN4QixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7S0FBQTtDQUNKO0FBOUJELGdEQThCQyJ9