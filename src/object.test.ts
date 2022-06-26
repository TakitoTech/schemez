import s from "./";
import { Expect, IsTrue, Validate } from "./_TestHelper";

describe("ObjectSchema", () => {
	it("ObjectSchema.prototype.set", () => {
		const schema = s
			.object()
			.set("prop1", s.string())
			.set("prop2", s.string().optional());

		IsTrue<Expect<typeof schema.type, { prop1: string; prop2?: string }>>();
		expect(Validate(schema, { prop1: "hello" })[0]).toEqual(true);
		expect(Validate(schema, { prop1: "hello", prop2: "world" })[0]).toEqual(
			true,
		);
		expect(Validate(schema, {} as any)[0]).toEqual(false);
		expect(Validate(schema, { prop2: "world" } as any)[0]).toEqual(false);
	});

	it("ObjectSchema.prototype.get", () => {
		const prop1 = s.string();
		const prop2 = s.shape({ prop21: s.string() }).optional();
		const prop3 = s.list(s.string());
		const schema1 = s.shape({
			prop1,
			prop2,
			prop3,
		});
		// console.log({
		// 	prop1J: JSON.stringify(prop1, null, 2),
		// 	prop1GJ: JSON.stringify(schema1.get("prop1"), null, 2),
		// 	prop2J: JSON.stringify(prop2, null, 2),
		// 	prop2GJ: JSON.stringify(schema1.get("prop2"), null, 2),
		// });
		const schema = s.shape({
			prop1: schema1.get("prop1"),
			prop2: schema1.get("prop2"),
			prop3: schema1.get("prop3"),
		});
		IsTrue<
			Expect<
				typeof schema.type,
				{ prop1: string; prop2?: { prop21: string }; prop3: string[] }
			>
		>();
		expect(
			Validate(schema, { prop1: "hello", prop3: ["hello", "world"] })[0],
		).toEqual(true);
		expect(
			Validate(schema, {
				prop1: "hello",
				prop2: {
					prop21: "hello",
				},
				prop3: ["hello", "world"],
			})[0],
		).toEqual(true);
		expect(Validate(schema, { prop2: "world" } as any)[0]).toEqual(false);
		expect(Validate(schema, { prop3: [] } as any)[0]).toEqual(false);
	});

	it("ObjectSchema.prototype.additionalProperties", () => {
		const schema = s.object().additionalProperties(s.string());

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, { strSome: "some", numAny: 0 } as any)[0]).toEqual(
			false,
		);
		expect(Validate(schema, { numAny: "string" })[0]).toEqual(true);
		expect(Validate(schema, { strSome: 0 } as any)[0]).toEqual(false);
	});

	it("ObjectSchema.prototype.propertyNames", () => {
		const schema = s.object().propertyNames(s.string().pattern(/^some$/));

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, {})[0]).toEqual(true);
		expect(Validate(schema, { some: "string" })[0]).toEqual(true);
	});

	it("ObjectSchema.prototype.minProperties", () => {
		const schema = s.object().minProperties(1);

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, {})[0]).toEqual(false);
		expect(Validate(schema, { some: "string" })[0]).toEqual(true);
	});

	it("ObjectSchema.prototype.maxProperties", () => {
		const schema = s.object().maxProperties(0);

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, {})[0]).toEqual(true);
		expect(Validate(schema, { some: "string" })[0]).toEqual(false);
	});

	it("ObjectSchema.prototype.dependencies", () => {
		const schema = s
			.shape({
				some: s.string().optional(),
				any: s.string().optional(),
			})
			.dependencies({ some: ["any"] });

		IsTrue<Expect<typeof schema.type, { some?: string; any?: string }>>();
		expect(Validate(schema, { some: "some", any: "any" })[0]).toEqual(true);
		expect(Validate(schema, { some: "string" })[0]).toEqual(false);
		expect(Validate(schema, { any: "string" })[0]).toEqual(true);
	});

	it("ObjectSchema.prototype.dependencies with ObjectSchema", () => {
		const schema = s
			.shape({
				some: s.string().optional(),
				any: s.string().optional(),
			})
			.dependencies({
				some: s.shape({ any: s.string() }, true),
			});

		IsTrue<Expect<typeof schema.type, { some?: string; any?: string }>>();
		expect(Validate(schema, { some: "some", any: "any" })[0]).toEqual(true);
		expect(Validate(schema, { some: "string" })[0]).toEqual(false);
		expect(Validate(schema, { any: "string" })[0]).toEqual(true);
	});

	it("ObjectSchema.prototype.patternProperties", () => {
		const schema = s.object().patternProperties({
			"^str": s.string(),
			"^num": s.number(),
		});

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, { strSome: "some", numAny: 0 })[0]).toEqual(true);
		expect(Validate(schema, { numAny: "string" })[0]).toEqual(false);
		expect(Validate(schema, { strSome: 0 })[0]).toEqual(false);
	});

	it("ObjectSchema.prototype.requiredProperties", () => {
		const schema = s
			.object()
			.set("prop1", s.string().optional())
			.set("prop2", s.string().optional())
			.requiredProperties("prop1");
		IsTrue<Expect<typeof schema.type, { prop1: string; prop2?: string }>>();
		expect(Validate(schema, { prop1: "hello" })[0]).toEqual(true);
		expect(Validate(schema, { prop1: "hello", prop2: "world" })[0]).toEqual(
			true,
		);
		expect(Validate(schema, {} as any)[0]).toEqual(false);
		expect(Validate(schema, { prop2: "world" } as any)[0]).toEqual(false);
	});
	it("ObjectSchema.prototype.required", () => {
		const schema1 = s
			.shape({
				prop1: s.string(),
			})
			.optional();
		const schema = s.shape({
			schemaR: schema1.required(),
			schemaO: schema1,
		});
		IsTrue<Expect<typeof schema.type, { schemaR: { prop1: string } }>>();
		expect(Validate(schema, { schemaR: { prop1: "hello" } })[0]).toEqual(true);
		expect(Validate(schema, {} as any)[0]).toEqual(false);
		expect(Validate(schema, { schemaO: { prop1: "world" } } as any)[0]).toEqual(
			false,
		);
	});
	it("ObjectSchema.prototype.optional", () => {
		const schema = s
			.shape({
				prop1: s.shape({ str: s.string() }),
				prop2: s.shape({ str: s.string() }).optional(),
			})
			.optional();
		IsTrue<
			Expect<
				typeof schema.type,
				{ prop1: { str: string }; prop2?: { str: string } }
			>
		>();
		expect(Validate(schema, undefined as any)[0]).toEqual(false);
		expect(Validate(schema, { prop1: { str: "hello" } })[0]).toEqual(true);
	});
	it("ObjectSchema.prototype.partial", () => {
		const schema = s
			.shape({
				prop1: s.shape({ str: s.string() }),
				prop2: s.shape({ str: s.string() }).optional(),
			})
			.partial();
		IsTrue<
			Expect<
				typeof schema.type,
				{ prop1?: { str: string }; prop2?: { str: string } }
			>
		>();
		expect(Validate(schema, {})[0]).toEqual(true);
		expect(Validate(schema, { prop1: { str: "hello" } })[0]).toEqual(true);
		expect(Validate(schema, { prop2: {} } as any)[0]).toEqual(false);
	});
	it("ObjectSchema.prototype.partialRecursive", () => {
		const schema = s
			.shape({
				prop1: s.shape({ str: s.string() }),
				prop2: s.shape({ str: s.string() }).optional(),
			})
			.partialRecurvise();
		IsTrue<
			Expect<
				typeof schema.type,
				{ prop1?: { str?: string }; prop2?: { str?: string } }
			>
		>();
		expect(Validate(schema, {})[0]).toEqual(true);
		expect(Validate(schema, { prop1: { str: "hello" } })[0]).toEqual(true);
		expect(Validate(schema, { prop2: {} })[0]).toEqual(true);
	});
	it("ObjectSchema.prototype.omit", () => {
		const schema = s
			.shape({
				prop1: s.string(),
				prop2: s.string().optional(),
			})
			.omit("prop1");
		expect(Validate(schema, {})[0]).toEqual(true);
		expect(Validate(schema, { prop1: {} } as any)[0]).toEqual(false);
	});
	it("ObjectSchema.prototype.pick", () => {
		const schema = s
			.shape({
				prop1: s.string(),
				prop2: s.string().optional(),
			})
			.pick("prop1");
		expect(Validate(schema, { prop1: "hello" })[0]).toEqual(true);
		expect(Validate(schema, { prop2: {} } as any)[0]).toEqual(false);
	});
	it("ObjectSchema.prototype.and", () => {
		const schema1 = s.shape({
			prop1: s.string(),
			prop2: s.string().optional(),
		});
		const schema2 = s.shape({
			prop3: s.string(),
		});
		const schema = schema1.and(schema2);
		expect(Validate(schema, { prop1: "hello", prop3: "world" })[0]).toEqual(
			true,
		);
		expect(
			Validate(schema, { prop1: "hello", prop4: "world" } as any)[0],
		).toEqual(false);
	});
	it("ObjectSchema.prototype.andShape", () => {
		const schema = s
			.shape({
				prop1: s.string(),
				prop2: s.string().optional(),
			})
			.andShape({
				prop3: s.string(),
			});
		expect(Validate(schema, { prop1: "hello", prop3: "world" })[0]).toEqual(
			true,
		);
		expect(
			Validate(schema, { prop1: "hello", prop4: "world" } as any)[0],
		).toEqual(false);
	});
	it.todo("ObjectSchema.prototype.or");
	it.todo("ObjectSchema.prototype.orShape");
});
