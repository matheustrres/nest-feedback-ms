module.exports = {
	parser: "@typescript-eslint/parser",
	env: {
		"node": true
	},
	root: true,
	plugins: [
		"@typescript-eslint/eslint-plugin",
		"eslint-plugin-import-helpers"
	],
	extends: ["plugin:@typescript-eslint/recommended"],
	ignorePatterns: [".eslintrc.js"],
	rules: {
		"no-dupe-class-members": "error",
		"no-duplicate-imports": "error",
		"no-extra-semi": "warn",
		"no-mixed-spaces-and-tabs": "off",
		"no-tabs": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"import-helpers/order-imports": [
			"warn",
			{
				"newlinesBetween": "always",
				"groups": [
					"/^node/",
					"module",
					"absolute",
					"index",
					"sibling",
					"parent",
					"/^@/@libs/",
					"/^@/feedbacks/",
					"/^@/health/",
					"/^@/shared/",
					"/^#/"
				],
				"alphabetize": {
					"order": "asc",
					"ignoreCase": false
				}
			}
		],
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{
				"disallowTypeAnnotations": true,
				"fixStyle": "inline-type-imports",
				"prefer": "type-imports"
			}
		],
		"@typescript-eslint/no-explicit-any": "off"
	}
}
