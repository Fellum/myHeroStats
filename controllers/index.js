const { body, validationResult, matchedData } = require('express-validator');
const hero = require("../models/hero");


const name_validator = body('name')
    .not()
    .isEmpty()
    .withMessage('name required');

const stats_validator = (field_name) => body(field_name)
        .not()
        .isEmpty()
        .withMessage(`${field_name} field required`)
        .bail()
        .isInt({min: 1})
        .withMessage(`${field_name} must be an integer more than 0`);

const invincible_validator = body('invincible')
    .not()
    .isEmpty()
    .withMessage(`invincible field required`)
    .bail()
    .isBoolean()
    .withMessage(`invincible must be an integer more than 0`);

const hero_stats_validator = [
    name_validator,
    stats_validator('strength'),
    stats_validator('dexterity'),
    stats_validator('intellect'),
    invincible_validator,
    body()
        .not()
        .custom((val) => Object.keys(val).length > 6)
        .withMessage('no extra field allowed')
];

exports.set_hero_stats = [
    ...hero_stats_validator,
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json(errors.array());
            return;
        }
        try {
            let id = hero.create(matchedData(req));
            res.send({
                id
            })
        } catch (e) {
            res.send({
                msg: e.message
            })
        }
    }
]

exports.get_hero_stats = [(req, res) => {
    res.send('NOT IMPLEMENTED');
}]

exports.upload_hero_image = (req, res) => {
    res.send('NOT IMPLEMENTED');
}

exports.get_hero_image = (req, res) => {
    res.send('NOT IMPLEMENTED');
}