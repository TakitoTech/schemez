// import AJV, { ErrorObject } from "ajv";
import { U } from "ts-toolbelt";
import { Schema, UndefinedProperties } from ".";

export type Any = any;
// | boolean
// | null
// | string
// | number
// | Record<string, any>
// | Array<any>
// | undefined;

export interface BaseJsonSchema {
	[key: string]: any;
	type?:
		| "boolean"
		| "null"
		| "array"
		| "object"
		| "string"
		| "number"
		| "integer";
	$id?: string;
	$ref?: string;
	$schema?: string;
	title?: string;
	description?: string;
	examples?: any[];
	default?: any;
	definitions?: Record<string, Schema["plain"]>;
	enum?: Any;
	const?: Any;
	oneOf?: Schema["plain"][];
	anyOf?: Schema["plain"][];
	allOf?: Schema["plain"][];
	not?: Schema["plain"];
	if?: Schema["plain"];
	then?: Schema["plain"];
	else?: Schema["plain"];
	custom?: string[];
}

export class BaseSchema<
	T = Any,
	R extends boolean = true,
	S extends BaseJsonSchema = Readonly<BaseJsonSchema>,
> {
	readonly type!: T;
	readonly otype!: R extends true ? T : T | undefined;
	readonly plain: S = {} as S;
	readonly isRequired: boolean = true;
	readonly isFluentSchema = true;
	readonly $schema: string = "http://json-schema.org/draft-07/schema#";
	readonly definitions!: Record<string, Schema["plain"]>;

	constructor(type?: S["type"]) {
		if (type) (this.plain as S).type = type;
	}

	/**
	 * It defines a URI for the schema, and the base URI that other URI references within the schema are resolved against.
	 *
	 * @example { $id: "string" }
	 *
	 * @reference https://json-schema.org/latest/json-schema-core.html#id-keyword
	 *
	 * @param {string} $id - an #id
	 * @returns {this}
	 */
	id($id: string) {
		return this.copyWith({ plain: { $id } });
	}

	/**
	 * The value must be a valid id e.g. #properties/foo
	 *
	 * @example { $ref: "string" }
	 *
	 * @param {string} ref
	 * @returns {this}
	 */
	ref($ref: string) {
		return this.copyWith({ plain: { $ref } });
	}

	/**
	 * Set $schema property
	 *
	 * @example { $schema: "string" }
	 *
	 * @param {string} $schema
	 */
	schema($schema: string) {
		return this.copyWith({ $schema });
	}

	/**
	 * It can be used to decorate a user interface with information about the data produced by this user interface. A title will preferably be short.
	 *
	 * @example { title: "string" }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.1
	 *
	 * @param {string} title
	 * @returns {this}
	 */
	title(title: string) {
		return this.copyWith({ plain: { title } });
	}

	/**
	 * A description provides explanation about the purpose of the instance
	 * described by the schema. Custom description that can either take a
	 * string or object. Object is stringified into string. Overwrite parameter is
	 * always true for string types.
	 *
	 * @example { description: "string" or object { title: "string", description: "new description" } }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.1
	 *
	 * @param {string} appendDesc
	 * @returns {this}
	 */
	description(appendDesc: string | Record<string, any>, overwrite = false) {
		if (typeof appendDesc === "string") {
			return this.copyWith({ plain: { description: appendDesc } });
		}
		const { description } = this.plain;
		if (description && !overwrite) {
			appendDesc = { ...JSON.parse(description), ...appendDesc };
		}
		return this.copyWith({
			plain: { description: JSON.stringify(appendDesc) },
		});
	}

	/**
	 * The value of this keyword MUST be an array.
	 * There are no restrictions placed on the values within the array.
	 *
	 * @example { examples: [ ... ] }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.4
	 *
	 * @param {any[]} examples
	 * @returns {this}
	 */
	examples(...examples: T[]) {
		return this.copyWith({ plain: { examples } });
	}

	/**
	 * There are no restrictions placed on the value of this keyword.
	 *
	 * @example { default: ... }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.10.2
	 *
	 * @param {T} def
	 * @returns {this}
	 */
	default(def: T) {
		return this.copyWith({ plain: { default: def } });
	}

	/**
	 * The "definitions" keywords provides a standardized location for schema authors to inline re-usable JSON Schemas into a more general schema.
	 * There are no restrictions placed on the values within the array.
	 *
	 * @example { definitions: { [name]: definition } }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.9
	 *
	 * @param {string} name
	 * @param {BaseSchema} props
	 * @returns {this}
	 */
	definition(name: string, definition: BaseSchema) {
		return this.copyWith({
			definitions: { ...this.definitions, [name]: definition.plain },
		});
	}

	/**
	 * Because the differences between JSON Schemas and Open API (Swagger)
	 * it can be handy to arbitrary modify the schema injecting a fragment
	 *
	 * * Examples:
	 * - S.number().raw({ nullable:true })
	 * - S.string().format('date').raw({ formatMaximum: '2020-01-01' })
	 *
	 * @example { somethingCustom: 'value' }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.3.3
	 *
	 * @param {string} fragment an arbitrary JSON Schema to inject
	 * @returns {this}
	 */
	raw(fragment: Record<string, any>) {
		return this.copyWith({ plain: fragment });
	}

	/**
	 * The value of this keyword MUST be an array. This array SHOULD have at least one element. Elements in the array SHOULD be unique.
	 *
	 * @example { enum: [ 'string' ] }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.2
	 *
	 * @param values
	 * @returns {this}
	 */
	enum<P extends T[]>(...values: P): BaseSchema<P[number], R> {
		return this.copyWith({ plain: { enum: values } }) as any;
	}

	/**
	 * The value of this keyword MAY be of any type, including null.
	 *
	 * @example { const: 'some' }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.1.3
	 *
	 * @param value
	 * @returns {this}
	 */
	const<P extends string | number>(
		value: P,
	): BaseSchema<UndefinedProperties<{ [p in P]: undefined }>, R> {
		return this.copyWith({ plain: { const: value } }) as any;
	}

	/**
	 * It  MUST be a non-empty array. Each item of the array MUST be a valid JSON Schema.
	 *
	 * @example { anyOf: [ {} ] }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7.3
	 *
	 * @param {array} schemas
	 * @returns {this}
	 */
	anyOf<P extends BaseSchema<T>[]>(
		...schemas: P
	): BaseSchema<P[number]["type"], R> {
		return this.copyWith({
			plain: { anyOf: schemas.map((schema) => schema.plain) },
		}) as any;
	}

	/**
	 * It MUST be a non-empty array. Each item of the array MUST be a valid JSON Schema.
	 *
	 * @example { allOf: [ {} ] }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7.1
	 *
	 * @param {array} schemas
	 * @returns {this}
	 */
	allOf<P extends BaseSchema<T>[]>(
		...schemas: P
	): BaseSchema<U.IntersectOf<P[number]["type"]>, R> {
		return this.copyWith({
			plain: { allOf: schemas.map((schema) => schema.plain) },
		}) as any;
	}

	/**
	 * It MUST be a non-empty array. Each item of the array MUST be a valid JSON Schema.
	 *
	 * @example { oneOf: [ {} ] }
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.7.2
	 *
	 * @param {array} schemas
	 * @returns {this}
	 */
	oneOf<P extends BaseSchema<T>[]>(
		...schemas: P
	): BaseSchema<P[number]["type"], R> {
		return this.copyWith({
			plain: { oneOf: schemas.map((schema) => schema.plain) },
		}) as any;
	}

	/**
	 * It MUST be a valid JSON Schema.
	 *
	 * @example { not: {} }
	 *
	 * @param {BaseSchema} not
	 * @returns {this}
	 */
	not<P extends BaseSchema>(not: P) {
		return this.copyWith({ plain: { not: not.plain } });
	}

	/**
	 * Should be used only with ObjectSchema. By default all properties in Object Schema are required. This will make them optional
	 */
	optional(): BaseSchema<T, false> {
		return this.copyWith({ isRequired: false }) as any;
	}

	/**
	 * This validation outcome of this keyword's subschema has no direct effect on the overall validation result.
	 * Rather, it controls which of the "then" or "else" keywords are evaluated.
	 * When "if" is present, and the instance successfully validates against its subschema, then
	 * validation succeeds against this keyword if the instance also successfully validates against this keyword's subschema.
	 *
	 * @param {BaseSchema} ifClause
	 * @param {BaseSchema} thenClause
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.6.1
	 * @returns {this}
	 */
	ifThen(ifClause: BaseSchema, thenClause: BaseSchema) {
		return this.copyWith({
			plain: { if: ifClause.plain, then: thenClause.plain },
		});
	}

	/**
	 * When "if" is present, and the instance fails to validate against its subschema,
	 * then validation succeeds against this keyword if the instance successfully validates against this keyword's subschema.
	 *
	 * @param {BaseSchema} ifClause
	 * @param {BaseSchema} thenClause
	 * @param {BaseSchema} elseClause
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.6.1
	 * @returns {this}
	 */
	ifThenElse(
		ifClause: BaseSchema,
		thenClause: BaseSchema,
		elseClause: BaseSchema,
	) {
		return this.copyWith({
			plain: {
				if: ifClause.plain,
				then: thenClause.plain,
				else: elseClause.plain,
			},
		});
	}

	/**
	 * Make copy of current schema with modified values
	 *
	 * @param modifyObject
	 */
	copyWith(
		modifyObject: Partial<BaseSchema & { plain: Partial<Schema["plain"]> }>,
	): this {
		return Object.assign(Object.create(this.constructor.prototype), {
			...this,
			...modifyObject,
			plain: { ...this.plain, ...modifyObject.plain },
		});
	}

	/**
	 * It returns all the schema values
	 *
	 * @returns {S}
	 */
	valueOf(): S {
		return {
			...this.plain,
			...(this.$schema && { $schema: this.$schema }),
			...(this.definitions && { definitions: this.definitions }),
		};
	}
}
