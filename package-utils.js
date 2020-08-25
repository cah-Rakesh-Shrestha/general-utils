"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFja2FnZS11dGlscy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInBhY2thZ2UtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7R0FFRztBQUNILE1BQWEsWUFBWTtJQUN2Qjs7Ozs7T0FLRztJQUNILE1BQU0sQ0FBQyxNQUFNLENBQ1gsSUFBZ0IsRUFDaEIsU0FBMEI7UUFFMUIsTUFBTSxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFL0IsTUFBTSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3BFLElBQUksSUFBSSxLQUFLLGFBQWEsRUFBRTtnQkFDMUIsWUFBWTtnQkFDWixTQUFTLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDcEQ7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FDakUsSUFBSSxDQUFDLEVBQUU7WUFDTCxJQUFJLElBQUksS0FBSyxhQUFhLEVBQUU7Z0JBQzFCLFlBQVk7Z0JBQ1osU0FBUyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3pEO1FBQ0gsQ0FBQyxDQUNGLENBQUM7UUFFRixPQUFPLFNBQXlDLENBQUM7SUFDbkQsQ0FBQztDQUNGO0FBL0JELG9DQStCQyJ9