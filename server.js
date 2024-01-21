const path = require('node:path');
const Fuse = require('fuse.js');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());

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
    response.json(filterRestaurants.map((restaurant) => ({ ID: restaurant.ID, name: restaurant.name, description: restaurant.description })));
});

// todo: return related review ids too
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
    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterReviews = reviews.filter(review => review.restaurantID === request.query.restaurantID);
    }
    if (request.query.rating !== undefined) {
        filterReviews = filterReviews.filter(review => review.rating >= parseInt(request.query.rating));
    }
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
    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterEvents = events.filter(event => event.restaurantID === request.query.restaurantID);
    }
    // if (request.query.style !== undefined && request.query.style !== '') {
    //     // todo style!!!
    //     filterEvents = reviews.filter(event => event.restaurantID === request.query.restaurantID);
    // }
    if (request.query.city !== undefined && request.query.city !== '') {
        filterEvents = filterEvents.filter(event => event.address[1].toLowerCase() === request.query.city.toLowerCase().trim());
    }
    if (request.query.upcoming !== undefined && request.query.upcoming === 'T') {
        let currDate = new Date().toISOString();
        currDate = currDate.substring(0, currDate.length - 8);
        filterEvents = filterEvents.filter(event => event.start >= currDate);
    }
    console.log(filterEvents.map((event) => ({ ID: event.ID, name: event.name, start: event.start, description: event.description })));
    response.json(filterEvents.map((event) => ({ ID: event.ID, name: event.name, start: event.start, description: event.description })));
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

app.post('/restaurant/add/', function (request, response) {
    //
});

app.post('/review/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    console.log(request.body);
    const lastReview = reviews[reviews.length - 1];
    const id = lastReview ? (parseInt(lastReview.ID) + 1).toString() : '1';
    const review = { title: request.body.title, name: request.body.name, rating: parseInt(request.body.rating), description: request.body.description, restaurantID: request.body.restaurantID, ID: id };
    reviews.push(review);
    response.json(review);
    for (let i = 0; i < restaurants.length; i++) {
        if (restaurants[i].ID === request.body.restaurantID) {
            const numOfReviews = reviews.filter(review => review.restaurantID === request.body.restaurantID).length;
            restaurants[i].rating = (restaurants[i].rating * numOfReviews + parseInt(request.body.rating)) / (numOfReviews + 1);
        }
    }
});

app.post('/event/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    console.log(request.body);
    const lastEvent = reviews[events.length - 1];
    const id = lastEvent ? (parseInt(lastEvent.ID) + 1).toString() : '1';
    const event = { name: request.body.name, description: request.body.description, start: request.body.start, end: request.body.end, restaurantID: request.body.restaurantID, ID: id };
    events.push(event);
    response.json(event);
});

app.get('/images/', function (request, response) {
    response.setHeader('content-Type', 'image/jpeg');
    try {
        response.sendFile(path.join(__dirname, 'images', request.query.ID + '.jpeg'));
    } catch (e) {
        response.sendStatus(404);
    }
});

app.use(function (request, response) {
    response.sendStatus(500);
});

app.listen(8090);
console.log('server running on port 8080');
