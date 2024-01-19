const path = require('node:path');
const Fuse = require('fuse.js');
const express = require('express');
const fs = require('fs');
const app = express();

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));

const restaurants = data.restaurants;
const reviews = data.reviews;
const events = data.events;
const restaurantSearch = new Fuse(restaurants, { keys: ['name', 'style'] });

app.use(express.static('client'));

app.get('/restaurants/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    let filterRestaurants = restaurants;
    if (request.query.name !== undefined && request.query.name !== '') {
        filterRestaurants = restaurantSearch.search(request.query.name).map(item => item.item);
    }
    if (request.query.city !== undefined && request.query.city !== '') {
        filterRestaurants = filterRestaurants.filter(restaurant => restaurant.address[1].toLowerCase() === request.query.city.toLowerCase().trim());
    }
    if (request.query.rating !== undefined) {
        filterRestaurants = filterRestaurants.filter(restaurant => restaurant.rating >= parseInt(request.query.rating));
    }
    response.json(filterRestaurants.map((restaurant) => ({ ID: restaurant.ID, name: restaurant.name })));
});

app.get('/restaurant/', function (request, response) {
    // return all data of restaurant if no other query other than ID
    response.setHeader('Content-Type', 'application/json');
    if (request.query.ID === undefined) {
        response.sendStatus(404);
        return;
    }
    for (const restaurant of restaurants) {
        if (request.query.ID === restaurant.ID) {
            // if request.query
            response.json(restaurant);
            return;
        }
    }
    response.sendStatus(404);
});

app.get('/reviews/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    let filterReviews = reviews;
    console.log(filterReviews);
    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterReviews = reviews.filter(review => review.restaurantID === request.query.restaurantID);
    }
    if (request.query.rating !== undefined) {
        filterReviews = filterReviews.filter(review => review.rating >= parseInt(request.query.rating));
    }
    console.log(filterReviews);
    response.json(filterReviews.map((review) => ({ ID: review.ID, title: review.title, name: review.name, rating: review.rating })));
});

app.get('/review/', function (request, response) {
    // return all data of restaurant if no other query other than ID
    response.setHeader('Content-Type', 'application/json');
    if (request.query.ID === undefined) {
        response.sendStatus(404);
        return;
    }
    for (const review of reviews) {
        if (request.query.ID === review.ID) {
            // if request.query
            response.json(review);
            return;
        }
    }
    response.sendStatus(404);
});

app.get('/events/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    let filterEvents = events;
    // console.log(filterReviews);
    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterEvents = reviews.filter(event => event.restaurantID === request.query.restaurantID);
    }
    if (request.query.style !== undefined && request.query.style !== '') {
        // todo style!!!
        filterEvents = reviews.filter(event => event.restaurantID === request.query.restaurantID);
    }
    if (request.query.city !== undefined && request.query.city !== '') {
        filterEvents = filterEvents.filter(event => event.address[1].toLowerCase() === request.query.city.toLowerCase().trim());
    }
    // console.log(filterReviews);
    response.json(filterEvents.map((event) => ({ ID: event.ID, name: event.name })));
});

app.get('/event/', function (request, response) {
    // return all data of restaurant if no other query other than ID
    response.setHeader('Content-Type', 'application/json');
    if (request.query.ID === undefined) {
        response.sendStatus(404);
        return;
    }
    for (const event of events) {
        if (request.query.ID === event.ID) {
            // if request.query
            response.json(event);
            return;
        }
    }
    response.sendStatus(404);
});

app.post('/restaurants/add/', function (request, response) {
    console.log(request);
    //
});

app.post('review/add/', function (request, response) {
        //
});

app.get('/images/', function (request, response) {
    try {
        response.sendFile(path.join(__dirname, 'images', request.query.ID, 'jpeg'));
    } catch (e) {
        response.setHeader('content-Type', 'image/jpeg');
        response.sendStatus(404);
    }
});

app.use(function (request, response) {
    if (request.accepts('html')) {
        // TODO: make a nice 404 page
        response.status(500).send('<h1>505 Internal</h1>');
    } else {
        response.sendStatus(500);
    }
});

app.listen(8080);
console.log('server running on port 8080');
