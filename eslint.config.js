import js from "@eslint/js";

export default [
  { ignores: ["node_modules/**", ".rbs/**"] },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        URL: "readonly",
      },
    },
  },
];
