/**
 * Utility functions for dealing with cross-package complexities
 */
export class PackageUtils {
  /**
   * Simulates "extend" behaviour for pre-existing objects.
   * Useful when babel causes problems creating an instance of an extension class when its base class is located in another package compiled with different babel/JS version.
   * @param base
   * @param extension
   */
  static extend<TBaseClass extends Object, TExtensionClass extends Object>(
    base: TBaseClass,
    extension: TExtensionClass
  ): TBaseClass & TExtensionClass {
    Object.assign(extension, base);

    Object.getOwnPropertyNames(base.constructor.prototype).forEach(name => {
      if (name !== "constructor") {
        //@ts-ignore
        extension[name] = base.constructor.prototype[name];
      }
    });

    Object.getOwnPropertyNames(extension.constructor.prototype).forEach(
      name => {
        if (name !== "constructor") {
          //@ts-ignore
          extension[name] = extension.constructor.prototype[name];
        }
      }
    );

    return extension as TBaseClass & TExtensionClass;
  }
}
