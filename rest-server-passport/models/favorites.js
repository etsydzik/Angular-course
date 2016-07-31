// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var dishesSchema = new Schema({
    dishes: {
        type: String,
        required: true
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true
});

// create a schema
var favoritesSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    dishes: [dishesSchema]
}, {
    timestamps: true
});


// the schema is useless so far
// we need to create a model using it
var Favorites = mongoose.model('Favorites', favoritesSchema);

// make this available to our Node applications
module.exports = Favorites;