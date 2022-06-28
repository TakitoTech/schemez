import { O } from "ts-toolbelt";
import ArraySchema from "./array";
import BaseSchema from "./base";
import NumericSchema from "./numeric";
import ObjectSchema from "./object";
import StringSchema from "./string";

export type Class<T = any> = { new (): T; prototype: T };

export type Optional<T extends Record<string, unknown>> = O.Optional<
	T,
	O.SelectKeys<T, undefined>
>;
export type PartialRecursive<T> = {
	[P in keyof T]?: T[P] extends (infer U)[]
		? PartialRecursive<U>[]
		: T[P] extends object | undefined
		? PartialRecursive<T[P]>
		: T[P];
};
export type UndefinedProperties<T> = {
	[P in keyof T]-?: undefined extends T[P] ? P : never;
}[keyof T];
export type ConvertUndefinedToOptional<T> = Partial<
	Pick<T, UndefinedProperties<T>>
> &
	Pick<T, Exclude<keyof T, UndefinedProperties<T>>>;
export type Schema = BaseSchema | BaseSchema<any, false>;

export { BaseSchema, StringSchema, NumericSchema, ArraySchema, ObjectSchema };

export class SchemaFactory extends BaseSchema {
	/**
	 * Create an empty schema
	 *
	 * @exmaple { }
	 *
	 * @returns {BaseSchema<any>}
	 */
	any() {
		return new BaseSchema().copyWith(this);
	}

	/**
	 * Create StringSchema
	 *
	 * @example { "type": "string" }
	 *
	 * @returns {StringSchema}
	 */
	string() {
		return new StringSchema().copyWith(this);
	}

	/**
	 * Create NumericSchema(number)
	 *
	 * @example { "type": "number" }
	 *
	 * @returns {NumericSchema}
	 */
	number() {
		return new NumericSchema("number").copyWith(this);
	}

	/**
	 * Create NumericSchema(integer)
	 *
	 * @example { "type": "integer" }
	 *
	 * @returns {NumericSchema}
	 */
	integer() {
		return new NumericSchema("integer").copyWith(this);
	}

	/**
	 * Create BooleanSchema
	 *
	 * @example { "type": "boolean" }
	 *
	 * @returns {BaseSchema<boolean>}
	 */
	boolean() {
		return new BaseSchema<boolean>("boolean").copyWith(this);
	}

	/**
	 * Create NullSchema
	 *
	 * @example { "type": "null" }
	 *
	 * @returns {BaseSchema<null>}
	 */
	null() {
		return new BaseSchema<null>("null").copyWith(this);
	}

	/**
	 * Create ArraySchema
	 *
	 * @example { "type": "array" }
	 *
	 * @returns {ArraySchema}
	 */
	array() {
		return new ArraySchema().copyWith(this);
	}

	/**
	 * Create ArraySchema
	 *
	 * @example { "type": "array", "items": { ... } }
	 *
	 * @returns {ArraySchema}
	 */
	list<T extends BaseSchema>(items: T) {
		return new ArraySchema().items(items).copyWith(this);
	}

	/**
	 * Create ObjectSchema
	 *
	 * @example { "type": "object" }
	 *
	 * @returns {ObjectSchema}
	 */
	object() {
		return new ObjectSchema().copyWith(this);
	}

	/**
	 * Create ObjectSchema
	 *
	 * @example { "type": "object", "properties": { ... }, "additionalProperties": false }
	 *
	 * @returns {ObjectSchema}
	 */
	shape<T extends Record<string, BaseSchema<any, boolean>>>(
		props: T,
		additional = false,
	) {
		let res = new ObjectSchema<Optional<{ [K in keyof T]: T[K]["otype"] }>>()
			.additionalProperties(additional)
			.copyWith(this);
		for (const prop in props) res = res.set(prop, props[prop]);
		return res;
	}
}

const S = new SchemaFactory();

export default S;
