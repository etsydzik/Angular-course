var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorites = require('../models/favorites');
var Verify = require('./verify');

var favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .get(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.find({"postedBy": req.decoded._doc._id})
            .populate('postedBy')
            .populate('dishes')
            .exec(function (err, favorites) {
                if (err) throw err;
                res.json(favorites);
            });
    })

    .post(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({"postedBy": req.decoded._doc._id}, function (err, favorites) {
            if (!favorites) {
                Favorites.create(req.body, function (err, favorites) {
                    if (err) throw err;
                    favorites.postedBy = req.decoded._doc._id;
                    console.log('your favorite has been created!');
                    favorites.dishes.push(req.body._id);
                    favorites.save(function (err, favorites) {
                        if (err) throw err;
                        console.log('Dish added');
                        res.json(favorites);
                    });
                });

            } else {
                // Does this dish already exist in the favorites?
                var test = favorites.dishes.indexOf(req.body._id);
                console.log("The test value is  " + test);
                if (test > -1) {
                    var err = new Error('This dish is already in your favorite list');
                    err.status = 401;
                    return next(err);
                } else {
                    favorites.dishes.push(req.body._id);
                    favorites.save(function (err, favorites) {
                        if (err) throw err;
                        console.log('Dish has been added');
                        res.json(favorites);
                    })
                }
            }
        });
    })

    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.remove({"postedBy": req.decoded._doc._id}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

favoriteRouter.route('/:favoriteId')
    .delete(Verify.verifyOrdinaryUser, function (req, res, next) {
        Favorites.findOne({"postedBy": req.decoded._doc._id}, function (err, favorites) {
            if (err) throw err;
            if (favorites) {
                var index = favorites.dishes.indexOf(req.params.favoriteId);
                if (index > -1) {
                    favorites.dishes.splice(index, 1);
                }
                favorites.save(function (err, favorite) {
                    if (err) throw err;
                    res.json(favorite);
                });
            } else {
                var err = new Error('There\' no Favorites');
                err.status = 401;
                return next(err);
            }
        });
    });

module.exports = favoriteRouter;