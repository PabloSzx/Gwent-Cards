module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
      "no-console": ["error", { allow: ["warn", "error", "log"] }],
      "no-underscore-dangle": "off",
      "consistent-return": "off",
    }
};
