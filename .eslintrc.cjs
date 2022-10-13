module.exports = {
	root: true,
	extends: [
		'eslint:recommended',
	],
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
	},
	rules: {
		'comma-dangle': ['error', 'always-multiline'],
		indent: ['error', 'tab', { SwitchCase: 1 }],
		'no-console': 'warn',
		'no-warning-comments': ['warn', { terms: ['TODO', 'FIXME', 'XXX'], location: 'start' }],
		quotes: ['error', 'single'],
		'quote-props': ['error', 'as-needed'],
		semi: ['error', 'always'],
	},
	overrides: [
		{
			files: ['**/.eslintrc.js', '**/.eslintrc.cjs'],
			env: {
				node: true,
			},
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
			},
		},
		{
			files: ['**/*.ts'],
			plugins: ['@typescript-eslint'],
			parser: '@typescript-eslint/parser',
			extends: ['plugin:@typescript-eslint/recommended'],
			rules: {
				'@typescript-eslint/member-delimiter-style': 'error',
				'@typescript-eslint/no-empty-interface': 'warn',
				'@typescript-eslint/no-explicit-any': 'error',
				'no-shadow': 'off',
				'@typescript-eslint/no-shadow': 'error',
				semi: 'off',
				'@typescript-eslint/semi': 'error',
			},
		},
		{
			files: ['**/*.ts'],
			plugins: ['@typescript-eslint'],
			parser: '@typescript-eslint/parser',
			extends: ['plugin:@typescript-eslint/recommended-requiring-type-checking'],
			rules: {
				'@typescript-eslint/switch-exhaustiveness-check': 'error',
			},
			parserOptions: {
				tsconfigRootDir: __dirname,
				project: ['./tsconfig.json'],
			},
		},
	],
};
