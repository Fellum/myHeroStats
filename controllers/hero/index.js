const { body, validationResult } = require('express-validator');
const hero = require("../../models/hero");
const multer  = require('multer')
const path = require('path');
const { set_hero_stats_schema } = require('./schemas');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 }, fileFilter: (req, file, cb) => {
    let type = file.mimetype.split('/')[0];
    cb(null, type === 'image');    
} });


exports.set_hero_stats = [
    set_hero_stats_schema,
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.json({ errors: errors.array() });
            return;
        }
        try {
            let id = hero.create(req.body);
            res.json({
                msg: "success"
            });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
    }
]

exports.get_hero_stats = [
    (req, res) => {
        try {
            let data = hero.get();
            if (data === null) {
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
        try {
            let data = hero.get();
            if (data === null) {
                res.json({ errors: [ { msg: "no hero" } ] });
                return;
            }
            if (!req.file) {
                res.json({
                    msg: 'no correct file provided'
                });
                return;
            }
            data.image = req.file;
            hero.update(data);
            res.json({ msg: "success" });
        } catch (e) {
            res.json({
                msg: e.message
            });
        }
    }
]

exports.get_hero_image = [
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
            res.sendFile(path.resolve(data.image.path), data.image.originalname);
            res.setHeader("content-disposition","inline")

        } catch (e) {
            res.json({
                msg: e.message
            });
        }
}]