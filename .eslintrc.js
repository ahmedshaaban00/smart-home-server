module.exports = {
	ignorePatterns: ['node_modules/'],
	env: {
		es6: true,
		node: true,
	},
	extends: ['airbnb-base', 'prettier'],
	plugins: ['prettier'],
	globals: {
		Atomics: 'readonly',
		SharedArrayBuffer: 'readonly',
	},
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	rules: {
		'prettier/prettier': ['error'],
	},
	settings: {
		'import/resolver': {
			node: {
				paths: ['node_modules'],
			},
		},
	},
};
