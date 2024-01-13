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
const reviewSearch = new Fuse(reviews, { keys: ['restaurantID'] });
const eventSearch = new Fuse(events, { keys: ['eventID'] });

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
        filterReviews = reviewSearch.search(request.query.restaurantID).map(item => item.item);
    }
    if (request.query.rating !== undefined) {
        filterReviews = filterReviews.filter(review => review.rating >= parseInt(request.query.rating));
    }
    console.log(filterReviews);
    response.json(filterReviews.map((review) => ({ ID: review.ID, name: review.name })));
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
    if (request.query.eventID !== undefined && request.query.eventID !== '') {
        filterEvents = eventSearch.search(request.query.eventID).map(item => item.item);
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

// app.get('/img/', function (request, response) {
//     response.setHeaderx
// })

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
