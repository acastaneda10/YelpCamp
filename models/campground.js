const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const icons = require('../public/javascripts/icons');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function(){
    return this.url.replace('/upload', '/upload/w_200,h_200,c_fill');
});

ImageSchema.virtual('mapImage').get(function(){
    return this.url.replace('/upload', '/upload/w_150,h_150,c_fill');
});

ImageSchema.virtual('showImage').get(function(){
    return this.url.replace('/upload','/upload/w_1000,ar_1:1,c_fill,g_auto');
});

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
    date: {
        type: Date,
        default: Date.now
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    options: {
        bathrooms: {
            type: Boolean,
            default: false
        },
        electricity: {
            type: Boolean,
            default: false
        },
        shop: {
            type: Boolean,
            default: false
        },
        rvHookup: {
            type: Boolean,
            default: false
        },
        water: {
            type: Boolean,
            default: false
        },
        petFriendly: {
            type: Boolean,
            default: false
        }
    }
}, opts);

CampgroundSchema.virtual('optionsIcons').get(function(){
    const bathrooms = this.options.bathrooms ? icons.bathrooms : '';
    const electricity = this.options.electricity ? icons.electricity : '';
    const water = this.options.water ? icons.water : '';
    const shop = this.options.shop ? icons.shop : '';
    const rvHookup = this.options.rvHookup ? icons.rvHookup : '';
    const petFriendly = this.options.petFriendly ? icons.petFriendly : '';
                    
    if(bathrooms || electricity || water || shop || rvHookup || petFriendly){
        return (
        `${bathrooms}
        ${electricity}
        ${water}
        ${shop}
        ${rvHookup}
        ${petFriendly}`
        );
    } else {
        return ('No amenities listed.')
    }
});

CampgroundSchema.virtual('properties.popupText').get(function(){
    const mapImg = (
        this.images.length 
        ? `<img src="${this.images[0].thumbnail}" alt="" class="img-fluid">`
        :`<img src="https://res.cloudinary.com/dwmkahbpb/image/upload/w_150,ar_1:1,c_fill/v1671242036/YelpCamp/No-Image-Placeholder_oofa0i.png" alt="" class="img-fluid">`);
        
    return (
        `<a class="text-decoration-none" href="/campgrounds/${this._id}">
        <div>
        <h6>
        ${this.title}
        </h6>
        </div>
        <div class="mb-2">
        ${mapImg}
        </div>
        </a>
        ${this.optionsIcons}`
    );
});

CampgroundSchema.virtual('avgRating').get(function(){
    let reviewCount = 0
    let score = 0
    for(let review of this.reviews){
        reviewCount += 1
        score += review.rating
    }
    return Math.round(score / reviewCount);
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

CampgroundSchema.post('deleteMany', async function (doc) {
    if(doc){
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
});

module.exports = mongoose.model('Campground', CampgroundSchema);