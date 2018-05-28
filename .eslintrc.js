var OFF = 0, WARN = 1, ERROR = 2;

module.exports = exports = {
    "env": {
        "es6": true,
        "browser": true,
        "jquery": true
    },

    "ecmaFeatures": {
        // env=es6 doesn't include modules, which we are using
        "modules": true
    },

    "extends": "eslint:recommended",

    "rules": {
        // Best Practices
        "block-scoped-var": WARN,
        // Strict Mode - for ES6, never use strict.
        "strict": [ ERROR, "never" ],
        // Variables
        "init-declarations": [ ERROR, "always" ],
        "no-label-var": ERROR,
        "no-shadow-restricted-names": ERROR,
        "no-shadow": WARN,
        // We require all vars to be initialized (see init-declarations)
        // If we NEED a var to be initialized to undefined, it needs to be explicit
        "no-undef-init": OFF,
        "no-undef": ERROR,
        "no-undefined": OFF,
        "no-unused-vars": WARN,
        // Disallow hoisting - let & const don't allow hoisting anyhow
        // "no-use-before-define": ERROR
    }
};
