const { body, validationResult, matchedData, query } = require('express-validator');
const hero = require("../models/hero");
const multer  = require('multer')
const upload = multer({ dest: 'uploads/', limits: { fileSize: 1024 * 1024 } });
const { readFile } = require('fs');


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
        .custom((val) => Object.keys(val).length > 5)
        .withMessage('no extra field allowed')
];

exports.set_hero_stats = [
    ...hero_stats_validator,
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }
        try {
            let id = hero.create(req.body);
            res.json({
                id
            });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
    }
]

const id_validator = query('id')
    .not()
    .isEmpty()
    .withMessage('id required')
    .bail()
    .isInt({ min: 1 })
    .withMessage('id must be integer greater than 0');

exports.get_hero_stats = [
    id_validator,
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }
        try {
            let data = hero.get(matchedData(req).id);
            if (data === undefined) {
                res.json({
                    msg: "hero not found"
                });
                return;
            }
            res.json({
                name: data.name,
                dexterity: data.dexterity,
                strength: data.strength,
                intellect: data.intellect,
                invincible: data.invincible,
            });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
    }
]

exports.upload_hero_image = [
    upload.single('hero_image'),
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }
        try {
            let data = hero.get(req.body.id);
            if (data === undefined) {
                res.json({ errors: [ { msg: "no hero with such id" } ] });
                return;
            }
            data.image = req.file;
            hero.update(req.body.id, req.file);
            res.json({ msg: "success" });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
    }
]

exports.get_hero_image = [
    id_validator,
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }
        try {
            let data = hero.get(req.query.id);
            if (data === undefined) {
                res.json({ errors: [ { msg: "no hero with such id" } ] });
                return;
            }
            if (data.image === undefined) {
                res.json({ errors: [ { msg: "hero has no image" } ] });
                return;
            }
            res.download(data.image.path, data.image.originalname, (err) => {
                if (err) {
                res.status(500).send({
                    message: "Could not download the file. " + err,
                });
                }
            });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
}]