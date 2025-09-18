// eslint.config.cjs
const js = require('@eslint/js')
const globals = require('globals')

module.exports = [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // sallitaan alaviivalla alkavat käyttämättömät parametrit (esim. _req, _res, _next)
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // backendissä konsolilokit ok
      'no-console': 'off',
    },
  },
]
