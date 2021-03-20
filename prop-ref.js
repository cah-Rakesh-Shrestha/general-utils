"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propRef = void 0;
/**
 * Creates a reference wrapper for the given object, obj, that that can be used to access properties by reference
 * @param obj
 */
function propRef(obj) {
    return {
        prop(property) {
            //@ts-ignore
            const wrapper = {};
            Object.defineProperty(wrapper, "value", {
                get() {
                    return obj[property];
                },
                set(value) {
                    obj[property] = value;
                }
            });
            wrapper.changeHandler = (newValue) => {
                wrapper.value = newValue;
            };
            return wrapper;
        }
    };
}
exports.propRef = propRef;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC1yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9wLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQTs7O0dBR0c7QUFDSCxTQUFnQixPQUFPLENBQXFCLEdBQVk7SUFDdEQsT0FBTztRQUNMLElBQUksQ0FBWSxRQUF1QjtZQUNyQyxZQUFZO1lBQ1osTUFBTSxPQUFPLEdBR1QsRUFBRSxDQUFDO1lBRVAsTUFBTSxDQUFDLGNBQWMsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO2dCQUN0QyxHQUFHO29CQUNELE9BQVEsR0FBVyxDQUFDLFFBQVEsQ0FBYyxDQUFDO2dCQUM3QyxDQUFDO2dCQUNELEdBQUcsQ0FBQyxLQUFnQjtvQkFDakIsR0FBVyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDakMsQ0FBQzthQUNGLENBQUMsQ0FBQztZQUVILE9BQU8sQ0FBQyxhQUFhLEdBQUcsQ0FBQyxRQUFtQixFQUFFLEVBQUU7Z0JBQzlDLE9BQU8sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO1lBQzNCLENBQUMsQ0FBQztZQUVGLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUM7S0FDRixDQUFDO0FBQ0osQ0FBQztBQXpCRCwwQkF5QkMifQ==