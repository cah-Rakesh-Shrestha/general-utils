"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageUtils = void 0;
/**
 * Utility functions for dealing with cross-package complexities
 */
class PackageUtils {
    /**
     * Simulates "extend" behaviour for pre-existing objects.
     * Useful when babel causes problems creating an instance of an extension class when its base class is located in another package compiled with different babel/JS version.
     * @param base
     * @param extension
     */
    static extend(base, extension) {
        Object.assign(extension, base);
        Object.getOwnPropertyNames(base.constructor.prototype).forEach(name => {
            if (name !== "constructor") {
                //@ts-ignore
                extension[name] = base.constructor.prototype[name];
            }
        });
        Object.getOwnPropertyNames(extension.constructor.prototype).forEach(name => {
            if (name !== "constructor") {
                //@ts-ignore
                extension[name] = extension.constructor.prototype[name];
            }
        });
        return extension;
    }
}
exports.PackageUtils = PackageUtils;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhY2thZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7O0dBRUc7QUFDSCxNQUFhLFlBQVk7SUFDdkI7Ozs7O09BS0c7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUNYLElBQWdCLEVBQ2hCLFNBQTBCO1FBRTFCLE1BQU0sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9CLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNwRSxJQUFJLElBQUksS0FBSyxhQUFhLEVBQUU7Z0JBQzFCLFlBQVk7Z0JBQ1osU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3BEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxPQUFPLENBQ2pFLElBQUksQ0FBQyxFQUFFO1lBQ0wsSUFBSSxJQUFJLEtBQUssYUFBYSxFQUFFO2dCQUMxQixZQUFZO2dCQUNaLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6RDtRQUNILENBQUMsQ0FDRixDQUFDO1FBRUYsT0FBTyxTQUF5QyxDQUFDO0lBQ25ELENBQUM7Q0FDRjtBQS9CRCxvQ0ErQkMifQ==