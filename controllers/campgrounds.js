const Campground = require('../models/campground');
const {cloudinary} = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken});
const icons = require('../public/javascripts/icons');

module.exports.index = async (req, res) => {
    const { 
        page = 1, 
        limit = 10,
        name,
        bathrooms, 
        electricity, 
        shop, 
        rvHookup, 
        water,
        petFriendly
        } = req.query;
    const queryOptions = {};
    if (bathrooms) queryOptions['options.bathrooms'] = bathrooms;
    if (electricity) queryOptions['options.electricity'] = electricity;
    if (shop) queryOptions['options.shop'] = shop;
    if (rvHookup) queryOptions['options.rvHookup'] = rvHookup;
    if (water) queryOptions['options.water'] = water;
    if (petFriendly) queryOptions['options.petFriendly'] = petFriendly;
    if (name) queryOptions['title'] = {$regex: `${name}`, $options: 'i'};
    const campgrounds = await Campground.find(queryOptions).populate('reviews').sort({'date': -1});
    const pages = Math.ceil(campgrounds.length / limit)
    res.render('campgrounds/index', {campgrounds, icons, page, pages, query:req.query})
}

module.exports.renderNewForm = (req, res) =>{
    res.render('campgrounds/new', {icons});
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground);
    campground.geometry = geoData.body.features[0].geometry;
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename})); // THIS WAS ADDED FOR MULTER/CLOUDINARY IMAGES
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            options: {
                sort: {
                    'date': -1
                }
            },
            populate: {
                path: 'author'}})
        .populate('author');
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', {campground});
}

module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id);
    if(!campground){
        req.flash('error', 'Cannot find that campground!');
        return res.redirect('/campgrounds');
    }
    const options = {
        bathrooms : campground.options.bathrooms ? 'Checked' : '',
        electricity : campground.options.electricity ? 'Checked' : '',
        water : campground.options.water ? 'Checked' : '',
        shop : campground.options.shop ? 'Checked' : '',
        rvHookup : campground.options.rvHookup ? 'Checked' : '',
        petFriendly : campground.options.petFriendly ? 'Checked' : '',
    }
    res.render('campgrounds/edit', {campground, icons, options});
}

module.exports.updateCampground = async(req, res) => {
    const {id} = req.params;
    if(!req.body.campground.options){
        req.body.campground.options = {}
    }
    const campground = await Campground.findByIdAndUpdate(id, {...req.body.campground});
    images = req.files.map(f => ({url: f.path, filename: f.filename})); // THIS WAS ADDED FOR MULTER/CLOUDINARY IMAGES
    campground.images.push(...images);
    if (req.body.deleteImages) {
        for(let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    await campground.save();
    req.flash('success', 'Successfully updated campground!');
    res.redirect(`/campgrounds/${campground._id}`);
}

module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted campground!');
    res.redirect('/campgrounds');
}