export default [
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**"],
  },
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        Buffer: "readonly",
        URL: "readonly",
        console: "readonly",
        fetch: "readonly",
        process: "readonly",
      },
    },
    rules: {
      "no-constant-condition": "error",
      "no-undef": "error",
      "no-unreachable": "error",
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
];
