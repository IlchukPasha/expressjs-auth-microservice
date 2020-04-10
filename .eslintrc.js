module.exports = {
  extends: 'airbnb-base',
  rules: {
    'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
    'comma-dangle': ['error', 'never'],
    'max-len': ['error', { code: 120 }],
    'no-underscore-dangle': [0],
    'arrow-parens': ['error', 'as-needed'],
    'newline-per-chained-call': 'off',
    'consistent-return': 'off'
  }
};