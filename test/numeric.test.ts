import { NumericSchema } from "../src";
import { Validate } from "./_TestHelper";

describe("NumericSchema", () => {
	it("NumericSchema.constructor(integer)", () => {
		const schema = new NumericSchema("integer");
		expect(Validate(schema, 0.1)[0]).toEqual(false);
		expect(Validate(schema, 0)[0]).toEqual(true);
	});

	it("NumericSchema.constructor(number)", () => {
		const schema = new NumericSchema("number");
		expect(Validate(schema, 0)[0]).toEqual(true);
		expect(Validate(schema, 0.1)[0]).toEqual(true);
	});

	it("NumericSchema.prototype.optional", () => {
		const schema = new NumericSchema("number");
		expect(schema.isRequired).toEqual(true);
		expect(schema.optional().isRequired).toEqual(false);
	});

	it("NumericSchema.prototype.minimum", () => {
		const schema = new NumericSchema("number").minimum(1);
		expect(Validate(schema, 2)[0]).toEqual(true);
		expect(Validate(schema, 1)[0]).toEqual(true);
		expect(Validate(schema, 0)[0]).toEqual(false);
	});

	it("NumericSchema.prototype.maximum", () => {
		const schema = new NumericSchema("number").maximum(1);
		expect(Validate(schema, 0)[0]).toEqual(true);
		expect(Validate(schema, 1)[0]).toEqual(true);
		expect(Validate(schema, 2)[0]).toEqual(false);
	});

	it("NumericSchema.prototype.exclusiveMinimum", () => {
		const schema = new NumericSchema("number").minimum(1, true);
		expect(Validate(schema, 2)[0]).toEqual(true);
		expect(Validate(schema, 1)[0]).toEqual(false);
		expect(Validate(schema, 0)[0]).toEqual(false);
	});

	it("NumericSchema.prototype.exclusiveMaximum", () => {
		const schema = new NumericSchema("number").maximum(1, true);
		expect(Validate(schema, 0)[0]).toEqual(true);
		expect(Validate(schema, 1)[0]).toEqual(false);
		expect(Validate(schema, 2)[0]).toEqual(false);
	});

	it("NumericSchema.prototype.multipleOf", () => {
		const schema = new NumericSchema("number").multipleOf(2);
		expect(Validate(schema, 4)[0]).toEqual(true);
		expect(Validate(schema, 3)[0]).toEqual(false);
	});
});
