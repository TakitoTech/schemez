import BaseSchema from "../src/base";

describe("BaseSchema", () => {
	it("BaseSchema.prototype.description", () => {
		const schema = new BaseSchema().description("test");
		expect(schema.plain.description).toEqual("test");
	});

	it("BaseSchema.prototype.optional", () => {
		const schema = new BaseSchema();
		expect(schema.isRequired).toEqual(true);
		expect(schema.optional().isRequired).toEqual(false);
	});
});
