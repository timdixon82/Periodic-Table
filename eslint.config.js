// ESLint flat config (ESLint 9+).
// js/periodic-table.js, js/elements-data.js, and js/pt-logic.js run in the
// browser as ES modules (index.html loads periodic-table.js with
// <script type="module">, which imports the other two).
// Browser globals come from the `globals` package (a development dependency),
// so the no-undef rule catches real undefined references without a hand-kept list.

import globals from 'globals';

export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      'no-unused-vars': ['error'],
      'no-undef': 'error',
      'eqeqeq': 'error',
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: globals.node,
    },
    rules: {
      'no-unused-vars': ['error'],
      'no-undef': 'error',
      'eqeqeq': 'error',
    },
  },
];
