import s, { BaseSchema } from "../src";
import { Expect, IsTrue, Validate } from "./_TestHelper";

describe("root instance", () => {
	it("Schema.string()", () => {
		const schema = s.string();

		IsTrue<Expect<typeof schema.type, string>>();
		expect(Validate(schema, "valid")[0]).toEqual(true);
	});

	it("Schema.number()", () => {
		const schema = s.number();

		IsTrue<Expect<typeof schema.type, number>>();
		expect(Validate(schema, 0)[0]).toEqual(true);
		expect(Validate(schema, 0.1)[0]).toEqual(true);
	});

	it("Schema.integer()", () => {
		const schema = s.integer();

		IsTrue<Expect<typeof schema.type, number>>();
		expect(Validate(schema, 999)[0]).toEqual(true);
		expect(Validate(schema, 999.1)[0]).toEqual(false);
	});

	it("Schema.boolean()", () => {
		const schema = s.boolean();

		console.warn("Fix type in Schema.boolean()");
		// IsTrue<Expect<typeof schema.type, boolean>>();
		expect(Validate(schema, true)[0]).toEqual(true);
		expect(Validate(schema, false)[0]).toEqual(true);
	});

	it("Schema.null()", () => {
		const schema = s.null();

		IsTrue<Expect<typeof schema.type, null>>();
		expect(Validate(schema, null)[0]).toEqual(true);
	});

	it("Schema.array()", () => {
		const schema = s.array();

		IsTrue<Expect<typeof schema.type, any[]>>();
		expect(Validate(schema, [])[0]).toEqual(true);
	});

	it("Schema.list()", () => {
		const schema = s.list(s.string());

		IsTrue<Expect<typeof schema.type, string[]>>();
		expect(Validate(schema, ["some"])[0]).toEqual(true);
	});

	it("Schema.object()", () => {
		const schema = s.object();

		IsTrue<Expect<typeof schema.type, Record<string, unknown>>>();
		expect(Validate(schema, { some: "any" })[0]).toEqual(true);
	});

	it("Schema.shape()", () => {
		type Type = { str: string; num?: number };
		const schema = s.shape({
			str: s.string(),
			num: s.number().optional(),
		});

		IsTrue<Expect<typeof schema.type, Type>>();
		expect(Validate(schema, { str: "any", num: 0 })[0]).toEqual(true);
		expect(Validate(schema, { str: "any", num: undefined })[0]).toEqual(true);
	});

	it("Schema.enum()", () => {
		enum Type {
			Some = "some",
			Any = "any",
		}
		const schema = s.enum(Type.Some, Type.Any);
		console.warn("Fix type in Schema.enum()");
		// IsTrue<Expect<typeof schema.type, Type>>();
		expect(Validate(schema, Type.Some)[0]).toEqual(true);
	});

	it("Schema.const()", () => {
		const schema = s.const("some");
		IsTrue<Expect<typeof schema.type, "some">>();
		expect(Validate(schema, "some")[0]).toEqual(true);
	});

	it("Schema.anyOf()", () => {
		const schema = s.anyOf(s.string(), s.number());
		IsTrue<Expect<typeof schema.type, string | number>>();
		expect(Validate(schema, "some")[0]).toEqual(true);
		expect(Validate(schema, 999)[0]).toEqual(true);
	});

	it("Schema.oneOf()", () => {
		const schema = s.oneOf(s.string(), s.number());
		IsTrue<Expect<typeof schema.type, string | number>>();
		expect(Validate(schema, "some")[0]).toEqual(true);
		expect(Validate(schema, 999)[0]).toEqual(true);
	});

	it("Schema.allOf()", () => {
		const schema = s.allOf(
			s.shape({ some: s.string() }),
			s.shape({ any: s.number() }),
		);

		IsTrue<
			Expect<typeof schema, BaseSchema<{ some: string } & { any: number }>>
		>();
		IsTrue<Expect<typeof schema.type, { some: string } & { any: number }>>();
		expect(Validate(schema, { some: "string", any: 0 })[0]).toEqual(false);
		expect(Validate(schema, { some: "string" } as any)[0]).toEqual(false);
	});

	it("Schema.not()", () => {
		const schema = s.not(s.string());

		IsTrue<Expect<typeof schema.type, any>>();
		expect(Validate(schema, "some")[0]).toEqual(false);
		expect(Validate(schema, 999)[0]).toEqual(true);
	});

	it("Schema.any()", () => {
		const schema = s.any();

		IsTrue<Expect<typeof schema.type, any>>();
		expect(Validate(schema, "some")[0]).toEqual(true);
		expect(Validate(schema, 999)[0]).toEqual(true);
		expect(Validate(schema, true)[0]).toEqual(true);
		expect(Validate(schema, null)[0]).toEqual(true);
		expect(Validate(schema, undefined)[0]).toEqual(true);
		expect(Validate(schema, {})[0]).toEqual(true);
	});

	it("Schema.raw()", () => {
		const schema = s.raw({ some: "any" });

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().some).toEqual("any");
	});

	it("Schema.id()", () => {
		const schema = s.id("some");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().$id).toEqual("some");
	});

	it("Schema.schema()", () => {
		const schema = s.schema("some.com");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().$schema).toEqual("some.com");
	});

	it("Schema.ref()", () => {
		const schema = s.ref("some");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().$ref).toEqual("some");
	});

	it("Schema.title()", () => {
		const schema = s.title("some");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().title).toEqual("some");
	});

	it("Schema.description(string)", () => {
		const schema = s.description("some");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().description).toEqual("some");
	});
	it("Schema.description(object)", () => {
		const schema = s.description({ hello: "some" });

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().description).toEqual('{"hello":"some"}');
	});

	it("Schema.examples()", () => {
		const schema = s.examples("some", "any");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().examples).toEqual(["some", "any"]);
	});

	it("Schema.default()", () => {
		const schema = s.default("some");

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().default).toEqual("some");
	});

	it("Schema.definition()", () => {
		const schema = s.definition("some", s.string());

		IsTrue<Expect<typeof schema.type, any>>();
		expect(schema.valueOf().definitions).toEqual({ some: s.string().plain });
	});

	// it("Schema.instanceOf()", () => {
	// 	const schema = S.shape({
	// 		date: S.instanceOf(Date),
	// 		number: S.instanceOf(Number),
	// 	});

	// 	IsTrue<Expect>()<
	// 		typeof schema,
	// 		// eslint-disable-next-line @typescript-eslint/ban-types
	// 		BaseSchema<{ date: Date; number: Number }>
	// 	>;
	// 	IsTrue<Expect<typeof schema.type.date, Date>>();
	// 	// eslint-disable-next-line @typescript-eslint/ban-types
	// 	type _CheckType2 = Expect<typeof schema.type.number, Number>;
	//   const [valid, error] = Validate(schema, { date: new Date(), number: new Number(10) }) // eslint-disable-line
	// 	console.log(error);
	// 	expect(valid).toEqual(true);
	// });

	it("Schema.ifThen()", () => {
		const schema = s.ifThen(s.string(), s.const("string"));

		IsTrue<Expect<typeof schema.type, any>>();
		expect(Validate(schema, "string")[0]).toEqual(true);
	});

	it("Schema.ifThenElse()", () => {
		const schema = s.ifThenElse(s.string(), s.const("string"), s.const(0));

		IsTrue<Expect<typeof schema.type, any>>();
		expect(Validate(schema, "string")[0]).toEqual(true);
		expect(Validate(schema, 0)[0]).toEqual(true);
		expect(Validate(schema, 999)[0]).toEqual(false);
	});
});
