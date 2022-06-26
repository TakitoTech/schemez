import AJV from "ajv";
import AddAJVFormats from "ajv-formats";
import { Schema } from ".";

const ajv = new AJV({
	// coerceTypes: true, // converts int to string and vice versa
	useDefaults: true,
	// removeAdditional: true,
	// Explicitly set allErrors to `false`.
	// When set to `true`, a DoS attack is possible.
	allErrors: false,
});
AddAJVFormats(ajv);
/**
 * Validates schemez's JSONSchema against sample data
 * @param schema schemez schema that is being validated
 * @param data sample data to validate different perspectives of the schema
 * @returns array with [isValid, errors]
 */
export function Validate<T extends Schema>(
	schema: T,
	data: T["type"],
	displayError = false,
) {
	if (displayError)
		console.log({
			schema: JSON.stringify(schema.valueOf(), null, 2),
			data: JSON.stringify(data, null, 2),
		});
	const result = [ajv.validate(schema.valueOf(), data), ajv.errors];
	if (displayError)
		console.log({
			valid: result[0],
			error: JSON.stringify(result[1], null, 2),
		});
	return result;
}
// export type Expect<T extends E, E> = T extends E ? true : false;
export type Expect<T extends E, E> = T extends E
	? E extends T
		? true
		: false
	: false;

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const IsTrue = <_A extends true>() => {};
