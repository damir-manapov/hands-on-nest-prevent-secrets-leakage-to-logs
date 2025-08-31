// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // 1) ignore build artifacts
  { ignores: ['dist/**', 'node_modules/**', 'eslint.config.mjs'] },

  // 2) JS base rules
  js.configs.recommended,

  // 3) TS recommended (no type-checking = fast)
  ...tseslint.configs.recommendedTypeChecked,

  // 4) Project rules (formatting + a few guardrails)
  {
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      'semi': ['error', 'always'],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'indent': ['error', 2, { SwitchCase: 1 }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'space-before-function-paren': ['error', 'never'],
      'no-console': 'error',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  }
);
