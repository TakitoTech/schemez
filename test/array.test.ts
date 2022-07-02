import s, { ArraySchema } from "../src";
import { Validate } from "./_TestHelper";

describe("ArraySchema", () => {
	it.todo("ArraySchema.prototype.items()");

	it.skip("ArraySchema.prototype.additionalItems", () => {
		// warning: strict mode: "items" is 2-tuple, but minItems or maxItems/additionalItems are not specified or different at path "#"
		// warnings are for all ArraySchema.prototype.additionalItems tests
		const schema = new ArraySchema().items([s.string(), s.number()]);
		expect(Validate(schema, ["some", 0, 0])[0]).toEqual(true);
		expect(Validate(schema.additionalItems(false), ["some", 0, 0])[0]).toEqual(
			false,
		);
		expect(
			Validate(schema.additionalItems(s.string()), ["some", 0, "any"])[0],
		).toEqual(true);
	});

	it("ArraySchema.prototype.contains", () => {
		const schema = new ArraySchema().contains(s.const("some"));
		expect(Validate(schema, ["some", 0, 0])[0]).toEqual(true);
		expect(Validate(schema, ["any", 0, 0])[0]).toEqual(false);
	});

	it("ArraySchema.prototype.minItems", () => {
		const schema = new ArraySchema().minItems(1);
		expect(Validate(schema, ["some", 0, 0])[0]).toEqual(true);
		expect(Validate(schema, [])[0]).toEqual(false);
	});

	it("ArraySchema.prototype.maxItems", () => {
		const schema = new ArraySchema().maxItems(1);
		expect(Validate(schema, ["some", 0, 0])[0]).toEqual(false);
		expect(Validate(schema, [])[0]).toEqual(true);
	});

	it("ArraySchema.prototype.unique", () => {
		const schema = new ArraySchema().uniqueItems();
		expect(Validate(schema, ["some", 0])[0]).toEqual(true);
		expect(Validate(schema, [1, 1])[0]).toEqual(false);
	});

	it("ArraySchema.prototype.optional", () => {
		const schema = new ArraySchema();
		expect(schema.isRequired).toEqual(true);
		expect(schema.optional().isRequired).toEqual(false);
	});
});
