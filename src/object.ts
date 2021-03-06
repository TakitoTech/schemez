import { O } from "ts-toolbelt";
import {
	Optional,
	PartialRecursive,
	Schema,
	ConvertUndefinedToOptional,
} from ".";
import { BaseSchema, BaseJsonSchema } from "./base";
import { StringSchema } from "./string";

export interface ObjectJsonSchema extends BaseJsonSchema {
	type: "object";
	properties?: Record<string, Schema["plain"]>;
	required?: string[];
	additionalProperties?: Schema["plain"] | boolean;
	propertyNames?: StringSchema["plain"];
	minProperties?: number;
	maxProperties?: number;
	dependencies?: Record<string, string[] | Schema["plain"]>;
	patternProperties?: Record<string, Schema["plain"]>;
}

export class ObjectSchema<
	T extends Record<string, any> = Record<string, unknown>,
	R extends boolean = true,
> extends BaseSchema<T, R, Readonly<ObjectJsonSchema>> {
	constructor() {
		super("object");
	}

	/**
	 * Sets a property of the object. The value of "properties" MUST be an object.
	 * Each value of this object MUST be a valid JSON Schema
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.4
	 *
	 * @param {string} name
	 * @param {ObjectSchema} schema
	 * @returns {ObjectSchema}
	 */
	set<K extends string | number, S extends BaseSchema<any, boolean>>(
		name: K,
		schema: S,
	): ObjectSchema<T & ConvertUndefinedToOptional<{ [k in K]: S["otype"] }>, R> {
		return this.copyWith({
			plain: {
				properties: { ...this.plain.properties, [name]: schema.plain },
				...(schema.isRequired && {
					required: [...(this.plain.required || []), name],
				}),
			},
		}) as any;
	}

	/**
	 * Get property from object schema
	 * @param key Key of object
	 * @returns JSON Schema of object property
	 */
	get<K extends keyof T>(key: K): BaseSchema<T[K], R> {
		const {
			plain: { properties, required },
			isFluentSchema,
			$schema,
		} = this;
		if (!properties) throw new Error("Object has no properties to 'get' from");
		return {
			plain: properties[key as any],
			isRequired: required?.includes(key as string),
			isFluentSchema,
			$schema,
		} as any;
	}

	/**
	 * This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself.
	 * Validation with "additionalProperties" applies only to the child values of instance names that do not match any names in "properties",
	 * and do not match any regular expression in "patternProperties".
	 * For all such properties, validation succeeds if the child instance validates against the "additionalProperties" schema.
	 * Omitting this keyword has the same behavior as an empty schema.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.6
	 *
	 * @param {BaseSchema|boolean} value
	 * @returns {ObjectSchema}
	 */
	additionalProperties<P extends BaseSchema | boolean>(
		schema: P,
	): P extends BaseSchema
		? // ? ObjectSchema<O.MergeUp<T, Record<string, P["otype"]>>, R>
		  ObjectSchema<O.Merge<T, Record<string, P["otype"]>>, R>
		: this {
		return this.copyWith({
			plain: {
				additionalProperties:
					typeof schema === "boolean" ? schema : (schema as BaseSchema).plain,
			},
		}) as any;
	}

	/**
	 * If the instance is an object, this keyword validates if every property name in the instance validates against the provided schema.
	 * Note the property name that the schema is testing will always be a string.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7
	 *
	 * @param {StringSchema} nameSchema
	 * @returns {ObjectSchema}
	 */
	propertyNames(nameSchema: StringSchema) {
		return this.copyWith({ plain: { propertyNames: nameSchema.plain } });
	}

	/**
	 * An object instance is valid against "minProperties" if its number of properties is greater than, or equal to, the value of this keyword.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.2
	 *
	 * @param {number} minProperties
	 * @returns {ObjectSchema}
	 */
	minProperties(minProperties: number) {
		return this.copyWith({ plain: { minProperties } });
	}

	/**
	 * An object instance is valid against "maxProperties" if its number of properties is less than, or equal to, the value of this keyword.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.1
	 *
	 * @param {number} maxProperties
	 * @returns {ObjectSchema}
	 */
	maxProperties(maxProperties: number) {
		return this.copyWith({ plain: { maxProperties } });
	}

	/**
	 * OLD - found in Draft 2019-09 (ie draft-08) and replaced with dependentRequired and dependentSchema
	 * TODO: replace this property with dependentRequired and dependentSchema
	 * This keyword specifies rules that are evaluated if the instance is an object and contains a certain property.
	 * This keyword's value MUST be an object. Each property specifies a dependency. Each dependency value MUST be an array or a valid JSON Schema.
	 * If the dependency value is a subschema, and the dependency key is a property in the instance, the entire instance must validate against the dependency value.
	 * If the dependency value is an array, each element in the array, if any, MUST be a string, and MUST be unique. If the dependency key is a property in the instance, each of the items in the dependency value must be a property that exists in the instance.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.7
	 *
	 * @param {Record<string, string[] | BaseSchema>} deps
	 * @returns {ObjectSchema}
	 */
	dependencies(deps: Record<string, string[] | BaseSchema>) {
		const dependencies: ObjectJsonSchema["dependencies"] = {};
		for (const dep in deps) {
			dependencies[dep] = Array.isArray(deps[dep])
				? (deps[dep] as string[])
				: (deps[dep] as BaseSchema).plain;
		}
		return this.copyWith({ plain: { dependencies } });
	}

	/**
	 * Each property name of this object SHOULD be a valid regular expression, according to the ECMA 262 regular expression dialect.
	 * Each property value of this object MUST be a valid JSON Schema.
	 * This keyword determines how child instances validate for objects, and does not directly validate the immediate instance itself.
	 * Validation of the primitive instance type against this keyword always succeeds.
	 * Validation succeeds if, for each instance name that matches any regular expressions that appear as a property name in this keyword's value, the child instance for that name successfully validates against each schema that corresponds to a matching regular expression.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.5
	 *
	 * @param {Record<string, BaseSchema>} props
	 * @returns {ObjectSchema}
	 */
	patternProperties(props: Record<string, BaseSchema>) {
		const patternProperties: ObjectJsonSchema["patternProperties"] = {};
		for (const prop in props) patternProperties[prop] = props[prop].plain;
		return this.copyWith({ plain: { patternProperties } });
	}
	/**
	 * Overwrite object's required properties array
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.3
	 *
	 * @returns {ObjectSchema}
	 */
	requiredProperties<S extends string[]>(
		...fields: S
	): ObjectSchema<
		Omit<T, S[number]> & { [P in S[number]]: NonNullable<T[P]> },
		R
	> {
		return this.copyWith({ plain: { required: fields } }) as any;
	}
	/**
	 * Requires object
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.5.3
	 *
	 * @returns {ObjectSchema}
	 */
	required(): ObjectSchema<T, true> {
		return this.copyWith({ isRequired: true }) as any;
	}

	/**
	 * Make schema optional in {ObjectSchema}. "Optional" is NOT the same as typescript's "partial".
	 * "Partial" sets all properties within an typescript object
	 * optional. "Optional" instead makes the object itself optional.
	 *
	 * @returns {ObjectSchema}
	 */
	optional(): ObjectSchema<T, false> {
		return this.copyWith({ isRequired: false }) as any;
	}

	/**
	 * Return new ObjectSchema with removed required fields
	 *
	 * @returns {ObjectSchema}
	 */
	partial(): ObjectSchema<Partial<T>, R> {
		const {
			plain: { required, ...plain }, // eslint-disable-line @typescript-eslint/no-unused-vars
		} = this;
		return Object.assign(Object.create(this.constructor.prototype), {
			...this,
			plain,
		});
	}
	/**
	 * Return new ObjectSchema with removed required fields recursively
	 *
	 * @returns {ObjectSchema}
	 */
	partialDeep(): ObjectSchema<PartialRecursive<T>, R> {
		const plain = (function partialDeep(schema: any) {
			for (const key in schema.properties || {}) {
				if (schema.properties[key].type === "object") {
					schema = {
						...schema,
						properties: {
							...schema.properties,
							[key]: partialDeep({ ...schema.properties[key] }),
						},
					};
				}
			}
			const { required, ...partialSchema } = schema; // eslint-disable-line @typescript-eslint/no-unused-vars
			return partialSchema;
		})(this.valueOf());
		return Object.assign(Object.create(this.constructor.prototype), {
			...this,
			plain,
		});
	}

	/**
	 * Return new ObjectSchema with omitted fields
	 *
	 * @returns {ObjectSchema}
	 */
	omit<K extends keyof T>(...keys: K[]): ObjectSchema<Omit<T, K>, R> {
		const es = new Set(keys as string[]);
		const plain = { ...this.valueOf() };
		const { properties, required } = plain;
		const nps = {} as ObjectJsonSchema;
		for (const key in properties) {
			if (!es.has(key)) nps[key] = properties[key];
		}
		plain.properties = nps;
		if (required) {
			const nrs: string[] = [];
			for (let i = 0; i < required.length; i++) {
				const r = required[i];
				if (!es.has(r)) nrs.push(r);
			}
			plain.required = nrs.length > 0 ? nrs : undefined;
		}
		return Object.assign(Object.create(this.constructor.prototype), {
			...this,
			plain,
		});
	}

	/**
	 * Return new ObjectSchema with picked fields
	 *
	 * @returns {ObjectSchema}
	 */
	pick<K extends keyof T>(...keys: K[]): ObjectSchema<Pick<T, K>, R> {
		const plain = { ...this.valueOf() };
		const { properties, required } = plain;
		const nps = {} as ObjectJsonSchema;
		if (properties) {
			for (const key of keys) {
				nps[key as keyof ObjectJsonSchema] =
					properties[key as keyof ObjectJsonSchema];
			}
			plain.properties = nps;
		}
		if (required) {
			const nrs = [];
			const ins = new Set(keys as string[]);
			for (let i = 0; i < required.length; i++) {
				const r = required[i];
				if (ins.has(r)) nrs.push(r);
			}
			if (nrs.length > 0) plain.required = nrs;
			else plain.required = undefined;
		}
		return Object.assign(Object.create(this.constructor.prototype), {
			...this,
			plain,
		});
	}

	/**
	 * Intersections ObjectSchemas
	 * Return new ObjectSchema with combined fields like typescript's "and".
	 * The new object take precedence for similar properties.
	 * ie someObject.intersection(someOtherObject.pick("a", "b"))
	 *
	 * @returns {ObjectSchema}
	 */
	and<A extends Record<string, any>>(
		props: ObjectSchema<A, boolean>,
		additional = false,
	): ObjectSchema<A & T, boolean> {
		const res = new ObjectSchema<A & T>()
			.additionalProperties(additional)
			.copyWith(this as ObjectSchema);
		const required = [...(props.plain.required || [])];
		for (const prop of res.plain.required || []) {
			if (!required.includes(prop)) required.push(prop);
		}
		return res.copyWith({
			plain: {
				properties: {
					...res.plain.properties,
					...props.plain.properties,
				},
				...(required.length > 0 && {
					required,
				}),
			},
		});
	}

	/**
	 * Intersections ObjectSchema with Object (like shape)
	 * Return new ObjectSchema with combined fields like typescript "and".
	 * The new props take precedence for similar properties.
	 * ie someObject.intersectionShape({ a: s.string(), b: s.number() })
	 *
	 * @returns {ObjectSchema}
	 */
	andShape<X extends Record<string, BaseSchema<any, boolean>>>(
		props: X,
		additional = false,
	) {
		let res = new ObjectSchema<
			Optional<{ [Y in keyof X]: X[Y]["otype"] }> & T
		>()
			.additionalProperties(additional)
			.copyWith(this as ObjectSchema);
		for (const name in props) {
			const schema = props[name];
			const { required = [] } = res.plain;
			res = res.copyWith({
				plain: {
					properties: {
						...res.plain.properties,
						[name]: schema.plain,
					},
					...(schema.isRequired &&
						!required.includes(name) && {
							required: [...required, name],
						}),
				},
			});
		}
		return res;
	}

	// #TODO: or

	// #TODO: orShape
}
