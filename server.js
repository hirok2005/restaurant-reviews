const Fuse = require('fuse.js');
const express = require('express');
const fs = require('fs');
const app = express();

const filterName = { keys: ['name', 'style'] };

const data = JSON.parse(fs.readFileSync('./data.json'));

const restaurants = data.restaurants;
const reviews = data.reviews;
const events = data.events;

app.use(express.static('client'));

app.get('/restaurants/', function (request, response) {
    console.log(request);
    let filterRestaurants = restaurants;
    if (request.query.name !== undefined && request.query.name !== '') {
        const f = new Fuse(filterRestaurants, filterName);
        filterRestaurants = f.search(request.query.name).map(item => item.item);
    }
    if (request.query.city !== undefined && request.query.city !== '') {
        filterRestaurants = filterRestaurants.filter(restaurant => restaurant.address[1].toLowerCase() === request.query.city.toLowerCase().trim());
    }
    if (request.query.rating !== undefined) {
        filterRestaurants = filterRestaurants.filter(restaurant => restaurant.rating >= parseInt(request.query.rating));
    }
    response.json(filterRestaurants.map((restaurant) => ({ id: restaurant.id, name: restaurant.name })));
});

app.get('/restaurant/', function (request, response) {
    for (const restaurant of restaurants) {
        if (request.query.id !== undefined && request.query.id === restaurant.id) {
            response.json(restaurant);
            return;
        }
    }
    response.sendStatus(404);
});

app.get('/favicon.ico', function (request, response) {
    response.sendFile('./client/favicon.ico');
});

app.use(function (request, response) {
    if (request.accepts('html')) {
        // TODO: make a nice 404 page
        response.status(404).send('<h1>HTML 404 Page not found</h1>');
    } else {
        response.sendStatus(404);
    }
});

app.listen(8090);
console.log('server running on port 8090');
