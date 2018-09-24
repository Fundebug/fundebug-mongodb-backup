module.exports = {
    env: {
        node: true,
        browser: true,
        es6: true
    },
    extends: "eslint:recommended",
    parser: "babel-eslint",
    rules: {
        "no-console": "off",
        "no-useless-escape": "off",
        quotes: ["error", "double"],
        semi: ["error", "always"]
    }
};
