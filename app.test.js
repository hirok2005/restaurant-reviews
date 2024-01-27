const request = require('supertest');
const app = require('./app');
const { describe } = require('node:test');

describe('GET methods tests', () => {
    test('List restaurants, default list (return all)', () => {
        return request(app).get('/restaurants').query().expect(200)
    })

    test('List restaurants, with all  query parameters', () => {
        return request(app).get('/restaurants').query({name: 'Tapas Factor', city: 'Durham', rating: '2'}).expect(200)
    })

    test('List restaurants, for specific restaurant', () => {
        return request(app).get('/restaurants').query({name: 'Tapas Factory'}).expect(200)
    })

    test('List restaurants, for specific restaurant (with spelling mistake)', () => {
        return request(app).get('/restaurants').query({name: 'Tapas Fator'}).expect(200)
    })
    
    test('List restaurants, with name that returns no results', () => {
        return request(app).get('/restaurants').query({name: '8vn7847549875n4'}).expect(204)
    })

    test('List restaurants, using City', () => {
        return request(app).get('/restaurants').query({city: 'Durham'}).expect(200)
    })

    test('List restaurants, using non existant City', () => {
        return request(app).get('/restaurants').query({city: 'Foo Bar'}).expect(204)
    })

    test('List restaurants, using rating', () => {
        return request(app).get('/restaurants').query({rating: '2'}).expect(200)
    })

    test('List reviews, for existing restaurant', () => {
        return request(app).get('/reviews').query({restaurantID: '1'}).expect(200)
    })

    test('List reviews , for non existant restaurant', () => {
        return request(app).get('/reviews').query({restaurantID: '-1'}).expect(204)
    })

    test('List reviews , using rating that is less than max existing rating', () => {
        return request(app).get('/reviews').query({rating: '1'}).expect(200)
    })
    
    test('List reviews , using rating that is greater than max existing rating', () => {
        return request(app).get('/reviews').query({rating: '6'}).expect(204)
    })

    test('List events, for existing restaurant', () => {
        return request(app).get('/events').query({restaurantID: '1'}).expect(200)
    })

    test('List events, for non existant restaurant', () => {
        return request(app).get('/events').query({restaurantID: '-1'}).expect(204)
    })
    
    test('List events, for existing city', () => {
        return request(app).get('/events').query({city: 'Durham'}).expect(200)
    })

    test('List events, for non existant city', () => {
        return request(app).get('/events').query({city: 'foo bar'}).expect(204)
    })
    
    test('Get specific restaurant, that exists', () => {
        return request(app).get('/restaurant').query({ID: '1'}).expect(200)
    })
    
    test('Get specific restaurant, that does not exists', () => {
        return request(app).get('/restaurant').query({ID: '-1'}).expect(404)
    })

    test('Get specific review, that exists', () => {
        return request(app).get('/review').query({ID: '1'}).expect(200)
    })
    
    test('Get specific review, that does not exists', () => {
        return request(app).get('/review').query({ID: '-1'}).expect(404)
    })

    test('Get specific event, that exists', () => {
        return request(app).get('/event').query({ID: '1'}).expect(200)
    })
    
    test('Get specific event, that does not exists', () => {
        return request(app).get('/event').query({ID: '-1'}).expect(404)
    })
})

describe('POST methods tests', () => {
    test('Add an invalid restaurant', () => {
        return request(app).post('/restaurant/add').send().expect(400)
    })

    test('Add a valid restaurant', () => {
        return request(app).post('/restaurant/add').send({name: "Restaurant name", description: "Yummy food made fresh since 2024",
        street: "1 Street Avenue", city: "Durham", address: "DH1 1HD",
        phone_number: "07123456789", mondayOpen: "", mondayClose: "",
        tuesdayOpen: "",tuesdayClose: "", wednesdayOpen: "", wednesdayClose: "",
        thursdayOpen: "", thursdayClose: "", fridayOpen: "", fridayClose: "",
        saturdayOpen: "", saturdayClose: "", sundayOpen: "", sundayClose: ""}).expect(201)
    })

    test('Add an existing restaurant', () => {
        return request(app).post('/restaurant/add').send({name: "Restaurant name", description: "Yummy food made fresh since 2024",
        street: "1 Street Avenue", city: "Durham", address: "DH1 1HD",
        phone_number: "07123456789", mondayOpen: "", mondayClose: "",
        tuesdayOpen: "",tuesdayClose: "", wednesdayOpen: "", wednesdayClose: "",
        thursdayOpen: "", thursdayClose: "", fridayOpen: "", fridayClose: "",
        saturdayOpen: "", saturdayClose: "", sundayOpen: "", sundayClose: ""}).expect(409)
    })

    test('Add an invalid review', () => {
        return request(app).post('/review/add').send().expect(400)
    })

    test('Add a valid review', () => {
        return request(app).post('/review/add').send({title: 'Great food', name: 'Customer', rating: "5", description: 'Great service', restaurantID: '1'}).expect(201)
    })

    test('Add an existing review (Title already exists for a given restaurant)', () => {
        return request(app).post('/review/add').send({title: 'Great food', name: 'Customer', rating: "5", description: 'Great service', restaurantID: '1'}).expect(409)
    })

    test('Add a review for a non existing restaurant', () => {
        return request(app).post('/review/add').send({title: 'Great food', name: 'Customer', rating: "5", description: 'Great service', restaurantID: '-1'}).expect(404)
    })

    test('Add an invalid event', () => {
        return request(app).post('/event/add').send().expect(400)
    })

    test('Add a valid event', () => {
        return request(app).post('/event/add').send({name: '1% off', description: 'Huge deals!!!', start: '2025-02-13T12:30',
        end: '2028-02-14T12:30', restaurantID: '1'}).expect(201)
    })

    test('Add an existing event (Name already exists for a given restaurant)', () => {
        return request(app).post('/event/add').send({name: '1% off', description: 'Huge deals!!!', start: '2025-02-13T12:30',
        end: '2028-02-14T12:30', restaurantID: '1'}).expect(409)
    })

    test('Add an event for a non existing restaurant', () => {
        return request(app).post('/event/add').send({name: '1% off', description: 'Huge deals!!!', start: '2024-02-13T12:30',
        end: '2025-02-14T12:30', restaurantID: '-1'}).expect(404)
    })

    test('Add an event with invalid times (End date is before start date)', () => {
        return request(app).post('/event/add').send({name: '1% off', description: 'Huge deals!!!', end: '2024-02-13T12:30',
        start: '2024-02-14T12:30', restaurantID: '-1'}).expect(400)
    })

    test('Add an event with invalid times (Start date is before current date)', () => {
        return request(app).post('/event/add').send({name: '1% off', description: 'Huge deals!!!', end: '2025-02-14T12:30',
        start: '2021-02-14T12:30', restaurantID: '-1'}).expect(400)
    })

})