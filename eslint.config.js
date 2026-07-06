import js from '@eslint/js';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import globals from 'globals';

export default [
  { ignores: ['dist', 'node_modules', '.worktrees'] },

  // Base JS recommended
  js.configs.recommended,

  // TypeScript recommended (flat config format — already an array)
  ...tsPlugin.configs['flat/recommended'],

  // React Hooks recommended (flat config — single object)
  reactHooks.configs.flat['recommended-latest'],

  // Project-wide settings
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    plugins: {
      'react-refresh': reactRefresh,
    },
    rules: {
      'react-refresh/only-export-components': 'warn',

      // Downgraded to 'warn': pre-existing patterns fixed in sibling cards
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
    },
  },
];
