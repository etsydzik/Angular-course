var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(function (req, res, next) {
        Favorites.find({})
            .populate('favorites.postedBy')
            .exec(function (err, favorite) {
                if (err) throw err;
                res.json(favorite);
            });
    })

    .post(function (req, res, next) {
        Favorites.create(req.body, function (err, favorite) {
            if (err) throw err;
            console.log('Favorite created!');
            var id = favorite._id;

            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the favorite with id: ' + id);
        });
    })

    .delete(function (req, res, next) {
        Favorites.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favoriteRouter.route('/:favoriteId')
    .delete(function (req, res, next) {
        Favorites.findByIdAndRemove(req.params.favoriteId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = favoriteRouter;