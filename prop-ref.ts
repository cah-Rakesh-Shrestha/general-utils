/**
 * Interface for properties wrapped using propRef Method
 */
export type PropRef<TProp> = {
  value: TProp;
};

/**
 * Creates a reference wrapper for the given object, obj, that that can be used to access properties by reference
 * @param obj
 */
export function propRef<TProperty, TObject>(obj: TObject) {
  return {
    prop<TProperty>(property: keyof TObject): PropRef<TProperty> {
      //@ts-ignore
      const wrapper: {
        value: TProperty;
        changeHandler: (newValue: TProperty) => void;
      } = {};

      Object.defineProperty(wrapper, "value", {
        get() {
          return (obj as any)[property] as TProperty;
        },
        set(value: TProperty) {
          (obj as any)[property] = value;
        }
      });

      wrapper.changeHandler = (newValue: TProperty) => {
        wrapper.value = newValue;
      };

      return wrapper;
    }
  };
}
