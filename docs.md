# API Documentation

## GET /restaurants

Gets a list of all restaurants names, ID and description that match the search criteria from the query parameters, if none specified, return all

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` *Optional* | String | Name of restaurant that is to be fuzzy searched against all current restaurant names, selects ones similair to value |
| `city` *Optional* | String | City of restaurants of interests
| `rating` *Optional* | Integer | Value from 0 - 5, selects restaurants with  ratings greater than or equal to query value |

### Example Code

``` javascript
try {
    const response = await fetch(`/restaurants?name=${name}&city=${city}&rating=${rating}`);
    if (!response.ok) {
        throw new Error();
    }
    const restaurants = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON containing list of restaurants, can be empty if nothing  meets criteria

#### Results found

```JSON
TODO:
might change if i figure out image
[
    {"ID": "1", "name": "A restaurant", "description": "Nice restaurant..."},
    ...
]
status: 200
```

#### No results found

```JSON
status: 204
```

## GET /restaurant

Returns all information of a restaurant specified using its ID, from query parameter

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `ID` *Required* | String | ID of restaurant requested |

### Example Code

``` javascript
try {
    const response = await fetch(`/restaurant?ID=1`);
    if (!response.ok) {
        throw new Error();
    }
    const restaurant = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Restaurant found

```JSON
{"ID": "1", "name": "...", "rating": 5, "description": "nice food...", "phone_number": "07123456789", "address": ["street", "city", "address"], "opening_times": [["11:00", "23:00"], ...], "ID": 1}
status: 200
```

#### Restaurant not found

```JSON
status: 404
```

## POST /restaurant/add

Adds new restaurant to server, all information passed into by JSON in request body

### Body Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` *Required* | String | Name of restaurant |
| `street` *Required* | String | Street of restaurant |
| `city` *Required* | String | City of restaurant |
| `address` *Required* | String | Address of restaurant |
| `description` *Required* | String | Description of restaurant |
| `phone_number` *Required* | String | Phone number of restaurant |
| `mondayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `tuesdayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `wednesdayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `thursdayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `fridayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `saturdayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `sundayOpen` *Optional* | String | Time when restaurant open/closes on said day |
| `mondayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `tuesdayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `wednesdayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `thursdayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `fridayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `saturdayClose` *Optional* | String | Time when restaurant open/closes on said day |
| `sundayClose` *Optional* | String | Time when restaurant open/closes on said day |

Any day where the opening time is not included is assumed to be closed

### Example Code

``` javascript
    try {
        const data = {"name":"Hungry4Food","description":"Yummy food fresh now","street":"Street","city":"City",
        "address":"Durham",
        "phone_number":"07123456789","mondayOpen":"",
        "mondayClose":"","tuesdayOpen":"","tuesdayClose":"",
        "wednesdayOpen":"","wednesdayClose":"","thursdayOpen":"",
        "thursdayClose":"","fridayOpen":"","fridayClose":"",
        "saturdayOpen":"","saturdayClose":"","sundayOpen":"","sundayClose":""}
        const response = await fetch('/review/add', {
                        method: "POST",
                        headers: {
                            "ContentType-Type": "application/json"
                        },
                        body: data
                    });
        ...
    } catch (e) {
        ...
    }
```

### Example Responses

#### Restaurant added

``` JSON
status: 201
```

#### Restaurant already exists (duplicate name)

```JSON
status: 409
```

#### Invalid body parameters

```JSON
status: 204
```

## GET /reviews

Gets a list of all reviews titles, names, IDs and ratings that match the search criteria from the query parameters, if none specified, return all

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `restaurantID` *Optional* | String | ID of the restaurant of interest |
| `rating` *Optional* | Integer | Value from 0 - 5, selects restaurants with  ratings greater than or equal to query value |

### Example Code

``` javascript
try {
    const response = await fetch(`/reviews?restaurantID=${ID}&rating=${rating}`);
    if (!response.ok) {
        throw new Error();
    }
    const reviews = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON containing list of reviews, can be empty if nothing  meets criteria

#### Results found

```JSON
[
    {"ID": "1", "title": "Great Food!...", "name": "CustomerName", "rating": "5"},
    ...
]
status: 200
```

#### No results found

```JSON
[]
status: 204
```

## GET /review

Returns all information of a review specified using its ID, from query parameter

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `id` *Required* | String | ID of review requested |

### Example Code

``` javascript
try {
    const response = await fetch(`/review?ID=${ID}`);
    if (!response.ok) {
        throw new Error();
    }
    const review = await response.json();

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Results found

```JSON
{"ID": "1", "title": "Great Food!...", "name": "CustomerName", "description": "really enjoyed my time...", "rating": "5", "restaurantID": "1"}
status: 200
```

#### No results found

```JSON
status: 404
```

## POST /review/add

Adds new review to server, all information passed into by JSON in request body

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `title` *Required* | String | Title of the review, must be unique for each restaurant |
| `name` *Required* | String | Name of creator of review
| `rating` *Required* | Integer | Rating from 0 - 5 |
| `restaurantID` *Required* | String | ID of restaurant the review is about |

### Example Code

``` javascript
try {
    data = {"ID": "1", "title": "Great Food!...", "name": "CustomerName", "description": "really enjoyed my time...", "rating": "5", "restaurantID": "1"}
    const response = await fetch('/review/add', {
        method: "POST",
        headers: {
            "ContentType-Type": "application/json"
        },
        body: data
    });

} catch (e) {
    ...
}
```

### Example Responses

All responses will a status code

#### Successfully added

```JSON
status: 201
```

#### Parameters incorrect

```JSON
status: 400
```

### Restaurant does not exist

```JSON
status: 404
```

### Review title exists for specified restaurant

```JSON
status: 409
```

## GET /events

Gets a list of all events names, start dates, descriptions and IDs that match the search criteria from the query parameters, if none specified, return all

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `restaurantID` *Optional* | String | ID of the restaurant of interest |
| `city` *Optional* | String | City of events of interests |
| `upcoming` *Optional* | {"T", "F"} | If true search for only events in the future, if not search through all |

### Example Code

``` javascript
try {
    const response = await fetch(`/events?restaurantID=${ID}&city=${city}&upcoming=T`);
    if (!response.ok) {
        throw new Error();
    }
    
    if (!response.ok) {
        throw new Error();
    }
    const events = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON containing list of reviews, can be empty if nothing  meets criteria

#### Results found

```JSON
[
    {"ID": "1", "title": "Great Food!...", "name": "CustomerName", "rating": "5"},
    ...
]
status: 200
```

#### No results found

```JSON
[]
status: 204
```

## GET /event

Returns all information of a event specified using its ID, from query parameter

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `id` *Required* | String | ID of event requested |

### Example Code

``` javascript
try {
    const response = await fetch(`/event?ID=${ID}`);  
    if (!response.ok) {
        throw new Error();
    }
    const event = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Results found

```JSON
{"ID": "1", "name": "50% of on Friday", "description": "Big sales cheap prices soon!", "start": "2025-02-14T12:30", "end": "2024-02-14T12:30", "city": "Durham", "restaurantID": "1", "ID": "1"}
status: 200
```

#### No results found

```JSON
status: 404
```

## POST /event/add

Adds new event to server, all information passed into by JSON in request body

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `name` *Required* | String | Name of event |
| `description` *Required* | String | Description of the event |
| `start` *Required* | String | ISO format of start time of event |
| `end` *Required* | String | ISO format of end time of event |
| `restaurantID` *Required* | String | ID of restaurant the event is linked to |

### Example Code

``` javascript
try {
    data = {"name":"50% OFF SOON","description":"Cheap deals this Friday","start":"2024-02-02T00:59","end":"2024-02-03T01:00","restaurantID":"1"}
    const response = await fetch(`/event/add`, {
        method: "POST",
        headers: {
            "ContentType-Type": "application/json"
        },
        body: data
    });
    if (!response.ok) {
        throw new Error();
    }
    const restaurants = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will a status code

#### Successfully added

```JSON
status: 201
```

#### Parameters incorrect

```JSON
status: 400
```

### Restaurant does not exist

```JSON
status: 404
```

### Event name exists for specified restaurant

```JSON
status: 409
```

## GET /imgs

Returns images of a restaurant given its ID, from query parameter

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `id` *Required* | String | ID of restaurant |
| `all` *Optional* | {"T", "F"} | If T then return all images, if not return most recent image |

### Example Code

All images are in base64 format JPGs

``` javascript
try {
    const response = await fetch(`/imgs?ID=${ID}`);  
    if (!response.ok) {
        throw new Error();
    }
    const imgs = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Results found

```JSON
["img:base64....", ...]
status: 200
```

#### No restaurant ID found

```JSON
status: 404
```
#### No images stored found

```JSON
status: 204
```

## POST /imgs/add

Adds new image to server, all information passed into by JSON in request body

### Query Parameters

| Name | Type | Description |
| --- | --- | --- |
| `ID` *Required* | String | ID of restaurant |
| `img` *Required* | base64 String | Base64 string of image, required to be JPG format |

### Example Code

``` javascript
try {
    data = {"ID: "1", "img", "img: base64...."}
    const response = await fetch(`/imgs/add`, {
        method: "POST",
        headers: {
            "ContentType-Type": "application/json"
        },
        body: data
    });
    if (!response.ok) {
        throw new Error();
    }
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will a status code

#### Successfully added

```JSON
status: 201
```

#### Parameters incorrect

```JSON
status: 400
```

### Restaurant does not exist

```JSON
status: 404
```

### Image exists for specified restaurant

```JSON
status: 409
```