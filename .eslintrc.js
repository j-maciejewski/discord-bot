module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: "standard-with-typescript",
  overrides: [],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
  },
  rules: {
    "@typescript-eslint/prefer-nullish-coalescing": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/restrict-plus-operands": "off",
    "@typescript-eslint/no-floating-promises": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "sort-imports": [
      2,
      {
        ignoreDeclarationSort: true,
      },
    ],
    "import/order": [
      "warn",
      {
        groups: ["builtin", "external", "internal", "parent", ["sibling", "index"]],
        pathGroups: [
          {
            pattern: "./styled",
            group: "index",
            position: "after",
          },
        ],
        "newlines-between": "always",
      },
    ],
  },
};
