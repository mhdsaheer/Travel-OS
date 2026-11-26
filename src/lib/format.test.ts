import { describe, expect, it } from "vitest";
import { formatMoney } from "./format";

describe("formatMoney", () => {
  it("shows currency code with western grouping for SAR", () => {
    expect(formatMoney(12400, "SAR")).toBe("SAR 12,400");
  });
  it("uses Indian grouping for INR", () => {
    expect(formatMoney(125000, "INR")).toBe("INR 1,25,000");
  });
});
