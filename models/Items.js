const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MyUser',
        required: true
    },
    reviewText: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        enum: ['Terrible', 'Bad', 'Ok', 'Good', 'Excellent'],
        required: true
    },
    numericalRating: {
        type: Number,
        required: true
    }
}, { timestamps: true });

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    cost: {
        type: Number,
        required: true
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    subcategory: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    stock:{
        type: Number,
        required: true
    },
    itemsSold: {
        type: Number,
        default: 0
    },
    reviews: [reviewSchema]
});

const Item = mongoose.model('Sparepart', itemSchema);

module.exports = Item;
