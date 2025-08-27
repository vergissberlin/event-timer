import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        // Browser APIs
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        navigator: 'readonly',
        location: 'readonly',
        history: 'readonly',
        
        // DOM types
        HTMLElement: 'readonly',
        HTMLButtonElement: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLLinkElement: 'readonly',
        HTMLImageElement: 'readonly',
        
        // Web APIs
        AudioContext: 'readonly',
        Audio: 'readonly',
        SpeechSynthesis: 'readonly',
        SpeechSynthesisUtterance: 'readonly',
        Notification: 'readonly',
        Blob: 'readonly',
        URL: 'readonly',
        Image: 'readonly',
        btoa: 'readonly',
        
        // Node.js types (for TypeScript)
        NodeJS: 'readonly',
        
        // Global types
        OscillatorType: 'readonly'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'off', // Allow any types for flexibility
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off', // Allow non-null assertions for DOM elements
      'prefer-const': 'error',
      'no-var': 'error',
      'no-console': 'off', // Allow console statements for debugging
      'no-debugger': 'error'
    }
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'jest.config.js',
      'tests/**'
    ]
  }
];
