module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'sort-export-all'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/await-thenable': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/naming-convention': [
      'warn',
      {
        selector: 'default',
        format: ['camelCase'],
      },
      {
        selector: ['enumMember', 'typeLike'],
        format: ['PascalCase'],
      },
      {
        selector: 'classProperty',
        modifiers: ['readonly'],
        format: ['camelCase', /* constants */ 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase', /* decorators */ 'PascalCase'],
      },
      {
        selector: ['objectLiteralProperty', 'typeProperty'],
        format: ['camelCase', /* dependencies */ 'PascalCase', 'snake_case', 'UPPER_CASE'],
      },
      {
        selector: 'objectLiteralProperty',
        modifiers: ['requiresQuotes'],
        format: null,
      },
      {
        selector: 'variable',
        modifiers: ['const'],
        format: ['camelCase', /* constants */ 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        types: ['function'],
        format: ['camelCase', /* decorators */ 'PascalCase'],
      },
    ],
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-promises': 'warn',
    '@typescript-eslint/promise-function-async': 'warn',
    '@typescript-eslint/require-await': 'warn',
    '@typescript-eslint/return-await': ['warn', 'always'],
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    'no-return-await': 'off',
    'require-await': 'off',
    'sort-export-all/sort-export-all': ['error', 'asc', { caseSensitive: false }],
    'sort-imports': [
      'error',
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
  },
};
