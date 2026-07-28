import js from '@eslint/js';
import globals from 'globals';

export default [
    js.configs.recommended,

    {
        files: [
            'src/**/*.js',
            'tests/**/*.js',
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: globals.node,
        },
        rules: {
            eqeqeq: ['error', 'always'],
            curly: ['error', 'all'],
            'no-var': 'error',
            'prefer-const': 'error',
            'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: "^_", }],
            'no-console': 'warn',
            'no-shadow': 'error',
            'no-param-reassign': ['error', { props: false }],
            'no-return-await': 'error',
            'require-await': 'error',
            'prefer-promise-reject-errors': 'error',
            'no-throw-literal': 'error',
            'consistent-return': 'error',
            'no-else-return': 'error',

            // Modern JS
            'prefer-arrow-callback': 'error',
            'prefer-template': 'error',
            'object-shorthand': 'error',
            'prefer-destructuring': ['error', { object: true, array: false }],
            'prefer-object-spread': 'error',

            // Style
            semi: ['error', 'always'],
            quotes: ['error', 'single', { avoidEscape: true }],
            'comma-dangle': ['error', 'always-multiline'],
            'object-curly-spacing': ['error', 'always'],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'no-trailing-spaces': 'error',
            "eol-last": ["error", "always"]
        },
    },

    {
        files: ['**/*.test.js'],
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest,
            },
        },
    },

    {
        files: ['src/utils/logger.util.js'],
        rules: {
            'no-console': 'off',
        },
    },

    {
        ignores: ['node_modules/', 'coverage/'],
    },
];
