module.exports = {
  env: {
   
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'plugin:node/recommended'],
  // plugins: ['imports'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 13,
  },
  rules: {
    'operator-linebreak': 'off',
    // 'import/no-unresolved': 2,
    'import/no-commonjs': 2,
    'import/extensions': [1, 'ignorePackages'],
    'linebreak-style': 0,
    'no-restricted-syntax': 0,
    'max-len': ['error', { code: 120 }],
    'no-useless-concat': 1,
    'consistent-return': 'off',
    indent: ['error', 2, { offsetTernaryExpressions: true, SwitchCase: 1 }],
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: {
          multiline: true,
          minProperties: 5,
          consistent: true,
        },
        ObjectPattern: { multiline: true, minProperties: 5 },
        ImportDeclaration: { multiline: true, minProperties: 7 },
        ExportDeclaration: { multiline: true, minProperties: 3 },
      },
    ],
    'object-property-newline': ['error', { allowAllPropertiesOnSameLine: true }],
  },
};
