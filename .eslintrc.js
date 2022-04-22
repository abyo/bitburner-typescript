module.exports = {
  "env": {
    "commonjs": true,
    "es2021": true,
    "node": true
  },
  "extends": [
    "airbnb-base",
    "airbnb-typescript/base",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/recommended"
  ],
  "parserOptions": {
    "ecmaVersion": 12,
    "tsconfigRootDir": __dirname,
    "project": "./tsconfig.json"
  },
  "root": true,
  "parser": "@typescript-eslint/parser",
  "plugins": [
    "import",
    "@typescript-eslint"
  ],
  "rules": {
    "no-constant-condition": "off",
    "no-restricted-syntax": "off",
    "no-await-in-loop": "off",
    "linebreak-style": [
      "error",
      "windows"
    ]
  },
  "settings": {
    "import/parsers": {
      "@typescript-eslint/parser": [
        ".ts"
      ]
    },
    "import/resolver": {
      "node": true,
      "eslint-import-resolver-typescript": true
    }
  }
}