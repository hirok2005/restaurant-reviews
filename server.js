const Fuse = require('fuse.js');
const express = require('express');
const app = express();

const options = { keys: ['name'] };

const restaurants = require('./data.json').restaurants;
const reviews = require('./data.json').reviews;
const events = require('./data.json').events;

const f = new Fuse(restaurants, options);

app.use(express.static('client'));

app.get('/restaurants/', function (request, response) {
    let filterRestaurants = restaurants;
    console.log(Object.keys(request.query));
    if (Object.keys(request.query).length !== 0 && Object.values(request.query).slice(1).some(values => values !== '')) {
        filterRestaurants = f.search(`${request.query.name} ${request.query.desc}`).map(item => item.item);
    }
    filterRestaurants = filterRestaurants.filter(restaurant => restaurant.rating >= parseInt(request.query.rating));

    console.log(filterRestaurants);
    response.send(filterRestaurants);
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
