module.exports = {
    env: {
        commonjs: true,
        es2022: true,
        node: true,
        jest: true
    },

    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 12,
        sourceType: "module"
    },
    extends: [
        "eslint:recommended",
        'plugin:@typescript-eslint/recommended' // This make various checks such as any usage
    ],
    plugins: ['@typescript-eslint'],
    overrides: [],
    rules: {}
}
