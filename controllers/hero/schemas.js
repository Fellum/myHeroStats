const { checkSchema } = require('express-validator');

exports.set_hero_stats_schema = checkSchema({
    name: {
        in: ['body'],
        errorMessage: "name required",
        isString: {
            errorMessage: "name must be string"
        }
    },
    strength: {
        in: ['body'],
        isInt: {
            errorMessage: "strength must be integer more than 0",
            options: { min: 1 }
        }
    },
    dexterity: {
        in: ['body'],
        isInt: {
            errorMessage: "dexterity must be integer more than 0",
            options: { min: 1 }
        }
    },
    intellect: {
        in: ['body'],
        isInt: {
            errorMessage: "intellect must be integer more than 0",
            options: { min: 1 }
        }
    },
    invincible: {
        in: ['body'],
        isBoolean: {
            errorMessage: "invincible must be boolean"
        }
    }
})