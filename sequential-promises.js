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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVudGlhbC1wcm9taXNlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInNlcXVlbnRpYWwtcHJvbWlzZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSxNQUFhLHVCQUF1QjtJQUloQyxZQUFZLE1BQWEsRUFBRSxPQUFZO1FBQ25DLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7Q0FDSjtBQVJELDBEQVFDO0FBRUQsTUFBYSxrQkFBa0I7SUFDM0IsTUFBTSxDQUFPLEdBQUcsQ0FDWixRQUE4QixFQUM5QixRQUFRLEdBQUcsQ0FBQzs7WUFFWixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7WUFDWixNQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7WUFDekIsTUFBTSxPQUFPLEdBQVEsRUFBRSxDQUFDO1lBRXhCLE9BQU8sSUFBSSxPQUFPLENBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7Z0JBQ3hDLFNBQWUsSUFBSTs7d0JBQ2YsSUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7NEJBQzNCLElBQUksTUFBTSxDQUFDLE1BQU0sRUFBRTtnQ0FDZixNQUFNLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQzs2QkFDeEQ7NEJBQ0QsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO3lCQUNwQjs2QkFBTTs0QkFDSCxJQUFJO2dDQUNBLE1BQU0sTUFBTSxHQUFHLE1BQU0sUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQUUsQ0FBQztnQ0FDdkMsT0FBTyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs2QkFDeEI7NEJBQUMsT0FBTyxDQUFDLEVBQUU7Z0NBQ1IsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzs2QkFDbEI7NEJBQ0QsVUFBVSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQzt5QkFDOUI7b0JBQ0wsQ0FBQztpQkFBQTtnQkFFRCxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3hCLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQztLQUFBO0NBQ0o7QUE5QkQsZ0RBOEJDIn0=