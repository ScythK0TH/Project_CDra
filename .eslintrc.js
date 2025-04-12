module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier + eslint-config-prettier
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error', // Show Prettier issues as ESLint errors
    'no-unused-vars': ['warn'],
    'no-console': 'off',
  },
};
