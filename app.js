const path = require('node:path');
const Fuse = require('fuse.js');
const compression = require('compression');
const express = require('express');
const fs = require('fs');
const app = express();
app.use(compression());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.json());

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json')));
const imgs = JSON.parse(fs.readFileSync(path.join(__dirname, 'imgs.json'))).imgs;

const restaurants = data.restaurants;
const reviews = data.reviews;
const events = data.events;
const restaurantSearch = new Fuse(restaurants, { keys: ['name'] });
const eventSearch = new Fuse(events, { keys: ['name'] });

const paramDays = [
    ['mondayOpen', 'mondayClose'],
    ['tuesdayOpen', 'tuesdayClose'],
    ['wednesdayOpen', 'wednesdayClose'],
    ['thursdayOpen', 'thursdayClose'],
    ['fridayOpen', 'fridayClose'],
    ['saturdayOpen', 'saturdayClose'],
    ['sundayOpen', 'sundayClose']
    ];
const paramsRestaurant = ['name', 'description', 'phone_number', 'street', 'city', 'address'];
const paramsReview = ['title', 'name', 'rating', 'description', 'restaurantID'];
const paramsEvent = ['name', 'description', 'start', 'end', 'restaurantID'];
const paramsImg = ['ID', 'img'];

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
    filterRestaurants = filterRestaurants.map((restaurant) => ({ ID: restaurant.ID, name: restaurant.name, description: restaurant.description, img: restaurant.img }));
    if (filterRestaurants.length === 0) {
        response.sendStatus(204);
    }
    response.json(filterRestaurants);
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
    filterReviews = filterReviews.map((review) => ({ ID: review.ID, title: review.title, name: review.name, rating: review.rating }));
    if (filterReviews.length === 0) {
        response.sendStatus(204);
    }
    response.json(filterReviews);
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
    if (request.query.name !== undefined && request.query.name !== '') {
        filterEvents = eventSearch.search(request.query.name).map(item => item.item);
    }

    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterEvents = events.filter(event => event.restaurantID === request.query.restaurantID);
    }
    if (request.query.city !== undefined && request.query.city !== '') {
        filterEvents = filterEvents.filter(event => event.city.toLowerCase() === request.query.city.toLowerCase().trim());
    }
    if (request.query.upcoming !== undefined && request.query.upcoming === 'T') {
        let currDate = new Date().toISOString();
        currDate = currDate.substring(0, currDate.length - 8);
        filterEvents = filterEvents.filter(event => event.start >= currDate);
    }
    filterEvents = filterEvents.map((event) => ({ ID: event.ID, name: event.name, start: event.start, description: event.description }));
    if (filterEvents.length === 0) {
        response.status(204).json();
        return;
    }
    response.json(filterEvents);
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

app.get('/imgs/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    let arr;
    for (const restaurant of imgs) {
        if (restaurant[0] === request.query.ID) {
            arr = restaurant;
            break;
        }
    }
    if (arr === null) {
        response.sendStatus(404);
        return;
    }

    if (arr[1].length === 0) {
        response.sendStatus(204);
        return;
    }

    console.log(arr.length, request.query.all);
    if (request.query.all === 'T') {
        response.json(arr[1]);
    } else {
        response.json([arr[1][arr[1].length - 1]]);
    }
});

app.post('/imgs/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    if (paramsImg.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
        return;
    }

    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i][0] === request.body.ID) {
            console.log(imgs[i]);
            imgs[i][1].push(request.body.img);
            response.sendStatus(201);
            return;
        }
    }

    response.sendStatus(404);
});

app.post('/restaurant/add/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    if (paramsRestaurant.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
        return;
    }

    for (const restaurant of restaurants) {
        if (restaurant.name.toLowerCase() === request.body.name.toLowerCase()) {
            response.sendStatus(409);
            return;
        }
    }

    const openingTimes = [];
    for (const days of paramDays) {
        if (request.body[days[0]] === '') {
            openingTimes.push(['', '']);
        } else {
            if (request.body[days[0]] > request.body[days[1]]) {
                response.sendStatus(400);
                return;
            }
            openingTimes.push([request.body[days[0]], request.body[days[0]]]);
        }
    }

    const addressArr = [request.body.street, request.body.city, request.body.address];
    const lastRestaurant = restaurants[restaurants.length - 1];
    const id = lastRestaurant ? (parseInt(lastRestaurant.ID) + 1).toString() : '1';

    const restaurant = { name: request.body.name, rating: 0, description: request.body.description, phone_number: request.body.phone_number, address: addressArr, opening_times: openingTimes, ID: id };

    imgs.push({ ID: id, imgs: [] });

    restaurants.push(restaurant);
    response.sendStatus(201);
});

app.post('/review/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    if (paramsReview.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
    }

    for (const review of reviews) {
        if (review.restaurantID === request.body.restaurantID && review.title === request.body.title) {
            response.sendStatus(409);
            return;
        }
    }

    let restaurantFound = false;
    for (const restaurant of restaurants) {
        if (restaurant.ID === request.body.restaurantID) {
            restaurantFound = true;
            break;
        }
    }

    if (!restaurantFound) {
        response.sendStatus(404);
    }

    const lastReview = reviews[reviews.length - 1];
    const id = lastReview ? (parseInt(lastReview.ID) + 1).toString() : '1';
    const review = { title: request.body.title, name: request.body.name, rating: parseInt(request.body.rating), description: request.body.description, restaurantID: request.body.restaurantID, ID: id };

    for (const restaurant of restaurants) {
        if (restaurant.ID === request.body.restaurantID) {
            const numOfReviews = reviews.filter(review => review.restaurantID === request.body.restaurantID).length;
            restaurant.rating = (restaurant.rating * numOfReviews + parseInt(request.body.rating)) / (numOfReviews + 1);
        }
    }
    reviews.push(review);
    response.sendStatus(201);
});

app.post('/event/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    if (paramsEvent.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
    }

    const date = new Date().toISOString();

    if (request.body.start > request.body.end || request.body.start < date) {
        response.sendStatus(400);
        return;
    }

    for (const event of events) {
        if (event.restaurantID === request.body.restaurantID && event.name === request.body.name) {
            response.sendStatus(409);
            return;
        }
    }

    let cityRest;
    let restaurantFound = false;
    for (const restaurant of restaurants) {
        if (restaurant.ID === request.body.restaurantID) {
            restaurantFound = true;
            cityRest = restaurant.address[1];
            break;
        }
    }

    if (!restaurantFound) {
        response.sendStatus(404);
    }

    const lastEvent = reviews[events.length - 1];
    const id = lastEvent ? (parseInt(lastEvent.ID) + 1).toString() : '1';
    const event = { name: request.body.name, description: request.body.description, start: request.body.start, end: request.body.end, city: cityRest, restaurantID: request.body.restaurantID, ID: id };
    events.push(event);
    response.sendStatus(201);
});

module.exports = app;
