// get all requirements
const path = require('node:path');
const Fuse = require('fuse.js');
const compression = require('compression');
const express = require('express');
const fs = require('fs');
const app = express();

// set up compresion and repsonses
app.use(compression());
app.use(express.json({ limit: '50mb', extended: true }));
app.use(express.urlencoded({ limit: '50mb' }));
app.use(express.json());

// load file data in variables
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

// filter through restaurants and return the ones that meet the queries
// search for name, city and rating of restaurants
// returns the ID, name and description
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

// return restaurant specified by its ID
app.get('/restaurant/', function (request, response) {
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

// filter through reviews and return the ones that meet the queries
// search by reaturant ID and rating
// returns the ID, title, name of creator and rating
app.get('/reviews/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    let filterReviews = reviews;
    if (request.query.restaurantID !== undefined && request.query.restaurantID !== '') {
        filterReviews = reviews.filter(review => review.restaurantID === request.query.restaurantID);
    }
    if (request.query.rating !== undefined) {
        // filters all that are greater or equal to query
        filterReviews = filterReviews.filter(review => review.rating >= parseInt(request.query.rating));
    }
    filterReviews = filterReviews.map((review) => ({ ID: review.ID, title: review.title, name: review.name, rating: review.rating }));
    if (filterReviews.length === 0) {
        response.sendStatus(204);
    }
    response.json(filterReviews);
});

// return review specified by its ID
app.get('/review/', function (request, response) {
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

// filter through events and return the ones that meet the queries
// search by restaurant ID, name, city and whether its upcoming
// returns the ID, name and start dates
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
        // compares start date to current data in ISO format
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

// return event specified by its ID
app.get('/event/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    if (request.query.ID === undefined) {
        response.sendStatus(404);
        return;
    }
    for (const event of events) {
        if (request.query.ID === event.ID) {
            response.json(event);
            return;
        }
    }
    response.sendStatus(404);
});

// gets all images specified by a restaurant ID
// all must be in base64 and be JPG/JPEG
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

    if (request.query.all === 'T') {
        response.json(arr[1]);
    } else {
        response.json([arr[1][arr[1].length - 1]]);
    }
});

// adds base64 image to a specific restaurant
app.post('/imgs/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    if (paramsImg.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
        return;
    }

    if (!(request.body.img.startsWith('data:image/jpeg;base64,') || request.body.img.startsWith('data:image/jpeg;base64,'))) {
        response.sendStatus(400);
        return;
    }

    for (let i = 0; i < imgs.length; i++) {
        if (imgs[i][0] === request.body.ID) {
            if (imgs[i][1].includes(request.body.img)) {
                response.sendStatus(409);
                return;
            }
            imgs[i][1].push(request.body.img);
            response.sendStatus(201);
            return;
        }
    }

    response.sendStatus(404);
});

// add restaurant with all data, check all parameters are present
app.post('/restaurant/add/', function (request, response) {
    response.setHeader('Content-Type', 'application/json');
    if (paramsRestaurant.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
        return;
    }

    // ensure restaurant doesnt already exist
    for (const restaurant of restaurants) {
        if (restaurant.name.toLowerCase() === request.body.name.toLowerCase()) {
            response.sendStatus(409);
            return;
        }
    }

    // santise times, if empty means closed
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

    // create instance in images too
    imgs.push([id, []]);

    restaurants.push(restaurant);
    response.sendStatus(201);
});

// add review with all data, check all parameters are present
app.post('/review/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    if (paramsReview.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
    }

    // ensure review doesnt already exist
    for (const review of reviews) {
        if (review.restaurantID === request.body.restaurantID && review.title === request.body.title) {
            response.sendStatus(409);
            return;
        }
    }

    // ensure restaurant exists
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

    // change restaurants average rating
    for (const restaurant of restaurants) {
        if (restaurant.ID === request.body.restaurantID) {
            const numOfReviews = reviews.filter(review => review.restaurantID === request.body.restaurantID).length;
            restaurant.rating = (restaurant.rating * numOfReviews + parseInt(request.body.rating)) / (numOfReviews + 1);
        }
    }
    reviews.push(review);
    response.sendStatus(201);
});

// add event with all data, check all parameters are present
app.post('/event/add', function (request, response) {
    response.setHeader('Content-Type', 'application/json');

    if (paramsEvent.filter(key => !(key in request.body)).length > 0) {
        response.sendStatus(400);
    }

    const date = new Date().toISOString();

    // ensure end date is after start date
    if (request.body.start > request.body.end || request.body.start < date) {
        response.sendStatus(400);
        return;
    }

    // ensure restaurant exists
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
