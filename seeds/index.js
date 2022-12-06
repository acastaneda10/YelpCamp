const mongoose = require('mongoose');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers')
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelpcamp');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected');
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for(let i = 0; i < 300; i++){
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '638a11935687b20452ade63d',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Beatae eaque minima reprehenderit necessitatibus a voluptatibus at sed. Facere, atque repellendus.',
            price,
            geometry: {
                type: "Point",
                coordinates: [
                  cities[random1000].longitude,
                  cities[random1000].latitude
                ]
            },
            images: [
                {
                  url: 'https://res.cloudinary.com/dwmkahbpb/image/upload/v1670111386/YelpCamp/rx7tn34e3rxfbrfczxoe.jpg',
                  filename: 'YelpCamp/rx7tn34e3rxfbrfczxoe',
                },
                {
                  url: 'https://res.cloudinary.com/dwmkahbpb/image/upload/v1670111409/YelpCamp/lxysrno3jky1xavw71de.jpg',
                  filename: 'YelpCamp/lxysrno3jky1xavw71de',
                },
                {
                  url: 'https://res.cloudinary.com/dwmkahbpb/image/upload/v1670111404/YelpCamp/qptzpmioyyxp5jyqga42.jpg',
                  filename: 'YelpCamp/qptzpmioyyxp5jyqga42',
                }
              ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})