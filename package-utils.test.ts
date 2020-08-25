import "jest";
import { PackageUtils } from "./package-utils";

class Base {
  vBase = "vBase";
  fBase() {
    return "fBase";
  }
  fCommon() {
    return "base:common";
  }
}

class Extension {
  vExtension = "vExtension";
  fExtension() {
    return "fExtension";
  }
  fCommon() {
    return "extension:common";
  }
}

describe("PackageUtils", () => {
  const subject1 = PackageUtils.extend(new Base(), new Extension());
  const subject2 = PackageUtils.extend(new Base(), new Extension());

  it("Makes base properties available", () => {
    expect(subject1.vBase).toEqual("vBase");
  });

  it("Makes extension properties available", () => {
    expect(subject1.vBase).toEqual("vBase");
  });

  it("Makes base methods available", () => {
    expect(subject1.fBase()).toEqual("fBase");
  });

  it("Makes extension methods available", () => {
    expect(subject1.fExtension()).toEqual("fExtension");
  });

  it("Overrides base properties when necessary", () => {
    expect(subject1.fCommon()).toEqual("extension:common");
  });
});
