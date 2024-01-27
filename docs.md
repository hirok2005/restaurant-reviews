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
    {}
]
status: 200
```

#### No results found

```JSON
[]
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
{ID: '1', name: ...}
status: 200
```

#### Restaurant not found

```JSON
status: 404
```

# TODO:
    ## POST /restaurant/add

    Adds new restaurant to server, all information passed into by JSON in request body

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
        {}
    ]
    status: 200
    ```

    #### No results found

    ```JSON
    []
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
    {ID: '1', title: 'Great Food!...', name: 'CustomerName', rating: '5'},
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

Gets a list of all restaurants names, ID and description that match the search criteria from the query parameters, if none specified, return all

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
    const restaurants = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Results found

```JSON
{ID: '1', title: 'Great Food!...', name: 'CustomerName', description: 'really enjoyed my time...', rating: '5', restaurantID: '1'}
status: 200
```

#### No results found

```JSON
status: 404
```

## POST /review/add

Adds new restaurant to server, all information passed into by JSON in request body

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
    data = {ID: '1', title: 'Great Food!...', name: 'CustomerName', description: 'really enjoyed my time...', rating: '5', restaurantID: '1'}
    const response = await fetch(`/review/add`, {
        method: 'POST',
        headers: {
            'ContentType-Type': 'application/json'
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
| upcoming | {'T', 'F'} | If true search for only events in the future, if not search through all |

### Example Code

``` javascript
try {
    const response = await fetch(`/events?restaurantID=${ID}&city=${city}&upcoming=T`);
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
    {ID: '1', title: 'Great Food!...', name: 'CustomerName', rating: '5'},
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

Gets a list of all restaurants names, ID and description that match the search criteria from the query parameters, if none specified, return all

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
    const restaurants = await response.json();
    ...

} catch (e) {
    ...
}
```

### Example Responses

All responses will return JSON

#### Results found

```JSON
{ID: '1', title: 'Great Food!...', name: 'CustomerName', description: 'really enjoyed my time...', rating: '5', restaurantID: '1'}
status: 200
```

#### No results found

```JSON
status: 404
```

## POST /review/add

Adds new restaurant to server, all information passed into by JSON in request body

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
    data = {ID: '1', title: 'Great Food!...', name: 'CustomerName', description: 'really enjoyed my time...', rating: '5', restaurantID: '1'}
    const response = await fetch(`/review/add`, {
        method: 'POST',
        headers: {
            'ContentType-Type': 'application/json'
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

### Review title exists for specified restaurant

```JSON
status: 409
```