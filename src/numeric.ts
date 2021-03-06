import { BaseSchema, BaseJsonSchema } from "./base";

export interface NumericJsonSchema extends BaseJsonSchema {
	type: "number" | "integer";
	minimum?: number;
	maximum?: number;
	exclusiveMinimum?: number;
	exclusiveMaximum?: number;
	multipleOf?: number;
}

export class NumericSchema<
	T extends number = number,
	R extends boolean = true,
> extends BaseSchema<T, R, Readonly<NumericJsonSchema>> {
	constructor(type: NumericJsonSchema["type"]) {
		super(type);
	}

	/**
	 * It represents  an (inclusive | exclusive) lower limit for a numeric instance.
	 *
	 * @param {number} minimum
	 * @param {boolean} exclusive
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.4
	 * @returns {NumericSchema}
	 */
	minimum(minimum: number, exclusive = false) {
		return this.copyWith({
			plain: exclusive ? { exclusiveMinimum: minimum } : { minimum },
		});
	}

	/**
	 * It represents  an (inclusive | exclusive) upper limit for a numeric instance.
	 *
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.2
	 * @returns {NumericSchema}
	 */
	maximum(maximum: number, exclusive = false) {
		return this.copyWith({
			plain: exclusive ? { exclusiveMaximum: maximum } : { maximum },
		});
	}

	/**
	 * It must be multiple of.
	 *
	 * @param {number} multipleOf
	 * @reference https://json-schema.org/latest/json-schema-validation.html#rfc.section.6.2.1
	 * @returns {NumericSchema}
	 */
	multipleOf(multipleOf: number) {
		return this.copyWith({ plain: { multipleOf } });
	}

	/**
	 * Make schema optional in {ObjectSchema}
	 * @returns {NumericSchema}
	 */
	optional(): NumericSchema<T, false> {
		return this.copyWith({ isRequired: false }) as any;
	}
}
