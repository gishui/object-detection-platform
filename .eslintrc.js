module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  },
  parserOptions: {
      sourceType: 'module'
    },
    parser: "vue-eslint-parser",
    env: {
      browser: true,
      node: true,
      es6: true,
    },
    rules: {
      'no-console': 'off',
     'no-unused-vars':'off',//意思就是不让eslint校验我定义有没有用了。
     'space-before-function-paren':0 
    }

}
