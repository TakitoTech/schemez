module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	parserOptions: {
		ecmaVersion: 2018,
		// sourceType: "module",
	},
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		// typescript
		"plugin:@typescript-eslint/recommended",
		// import sort
		"plugin:import/errors",
		"plugin:import/warnings",
		"plugin:import/typescript",
		// Prettier plugin and recommended rules
		"plugin:prettier/recommended",
	],
	rules: {
		"import/no-named-as-default": 0,
		// sort-imports doesn't auto sort by lines
		"import/order": [
			"error",
			{
				groups: ["builtin", "external", "internal"],
				pathGroups: [
					{
						pattern: "react",
						group: "external",
						position: "before",
					},
				],
				pathGroupsExcludedImportTypes: ["react"],
				"newlines-between": "never",
				alphabetize: {
					order: "asc",
					caseInsensitive: true,
				},
			},
		],
		"import/prefer-default-export": 0,
		// "@typescript-eslint/explicit-function-return-type": 0,
		"@typescript-eslint/ban-ts-comment": [
			2,
			{
				// use instead of @ts-ignore and provide explanation
				"ts-expect-error": "allow-with-description",
				minimumDescriptionLength: 2,
			},
		],
		// ignore _vars or _args since its intended
		"@typescript-eslint/no-unused-vars": [
			"error",
			{ varsIgnorePattern: "^_", argsIgnorePattern: "^_" },
		],
		// "@typescript-eslint/explicit-module-boundary-types": 0, // export modules must have explicit return types
		// illogical since typescript already warns and you add bangs ! only if you are sure
		"@typescript-eslint/no-non-null-assertion": 0,
		// ------ Revert when possible -----------
		"@typescript-eslint/no-explicit-any": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
	},
};
