const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now
    }
})

reviewSchema.virtual('showdate').get(function(){
    return this.date.toLocaleDateString('en-US');
})

module.exports = mongoose.model('Review', reviewSchema);