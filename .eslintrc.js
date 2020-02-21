"use strict";

module.exports = {
    parserOptions: {
        ecmaVersion: "2020",
    },
    extends: ["prettier"],
    plugins: ["prettier"],
    rules: {
        "prettier/prettier": ["error", require("./.prettierrc.js")],
    },
};
