"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcC1yZWYuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwcm9wLXJlZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BOzs7R0FHRztBQUNILFNBQWdCLE9BQU8sQ0FBcUIsR0FBWTtJQUN0RCxPQUFPO1FBQ0wsSUFBSSxDQUFZLFFBQXVCO1lBQ3JDLFlBQVk7WUFDWixNQUFNLE9BQU8sR0FHVCxFQUFFLENBQUM7WUFFUCxNQUFNLENBQUMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7Z0JBQ3RDLEdBQUc7b0JBQ0QsT0FBUSxHQUFXLENBQUMsUUFBUSxDQUFjLENBQUM7Z0JBQzdDLENBQUM7Z0JBQ0QsR0FBRyxDQUFDLEtBQWdCO29CQUNqQixHQUFXLENBQUMsUUFBUSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxDQUFDO2FBQ0YsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLGFBQWEsR0FBRyxDQUFDLFFBQW1CLEVBQUUsRUFBRTtnQkFDOUMsT0FBTyxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUM7WUFDM0IsQ0FBQyxDQUFDO1lBRUYsT0FBTyxPQUFPLENBQUM7UUFDakIsQ0FBQztLQUNGLENBQUM7QUFDSixDQUFDO0FBekJELDBCQXlCQyJ9