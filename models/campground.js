const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});

ImageSchema.virtual('showsize').get(function(){
    return this.url.replace('/upload','/upload/w_1000,ar_1:1,c_fill,g_auto');
})

const opts = { toJSON: { virtuals: true}};

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum:['Point']
        },
        coordinates: {
            type: [Number]
        }
    },
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

CampgroundSchema.virtual('properties.popupText').get(function(){
    return `<a href="/campgrounds/${this._id}">${this.title}</a>`;
});

CampgroundSchema.virtual('avgRating').get(function(){
    let reviewCount = 0
    let score = 0
    for(let review of this.reviews){
        reviewCount += 1
        score += review.rating
    }
    return Math.floor(score / reviewCount);
})

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);