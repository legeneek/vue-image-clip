module.exports = {
  root: true,
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'indent': 'off',
    'semi': 'off',
    'comma-dangle': 'off',
    'func-names': 'off',
    'no-undef': 'off',
    'no-console': 'off',
    'prefer-arrow-callback': 'off',
    'import/no-unresolved': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
