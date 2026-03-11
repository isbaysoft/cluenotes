import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import vue from 'eslint-plugin-vue'
import vueParser from 'vue-eslint-parser'

export default [
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'components.d.ts',
      'src/components/shared/PickCard copy.vue',
      '*.config.js',
      '*.config.ts',
    ],
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,

  ...vue.configs['flat/recommended'],

  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/max-attributes-per-line': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/html-self-closing': 'off',
      'vue/attributes-order': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/first-attribute-linebreak': 'off',
      'vue/html-indent': 'off',
      'vue/v-slot-style': 'off',
      'vue/no-mutating-props': 'off',
      'vue/require-toggle-inside-transition': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/no-template-shadow': 'off',
      'vue/no-unused-vars': 'warn',
      'vue/require-v-for-key': 'warn',
      'vue/no-dupe-keys': 'warn',
      'vue/return-in-computed-property': 'warn',
    },
  },

  {
    files: ['**/*.{js,mjs,cjs}'],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
]
