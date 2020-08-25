import { OpError } from "errors-framework";

export class SequentialPromisesError<T> {
    errors: any[];
    results: T[];

    constructor(errors: any[], results: T[]) {
        this.errors = errors;
        this.results = results;
    }
}

export class SequentialPromises {
    static async all<T>(
        promises: (() => Promise<T>)[],
        interval = 0
    ): Promise<T[]> {
        let idx = 0;
        const errors: any[] = [];
        const results: T[] = [];

        return new Promise<T[]>((resolve, reject) => {
            async function next() {
                if (idx > promises.length - 1) {
                    if (errors.length) {
                        reject(new SequentialPromisesError(errors, results));
                    }
                    resolve(results);
                } else {
                    try {
                        const result = await promises[idx++]();
                        results.push(result);
                    } catch (e) {
                        errors.push(e);
                    }
                    setTimeout(next, interval);
                }
            }

            setTimeout(next, 0);
        });
    }
}
