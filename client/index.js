const restaurantButton = document.getElementById('restaurant');
// TODO make error pages nice

function isOk (response) {
    if (response.ok) {
        return true;
    }
    document.getElementById('main-content').innerHTML = `<h1>${response.status} - ${response.statusText}</h1>`;
    return false;
}

function isOpen (opening) {
    const date = new Date();
    const currTime = date.getHours() + (date.getMinutes() / 60);
    const times = opening[date.getDay()];
    if (times[0] === null) {
        return false;
    }
    if (times[0] < times[1]) {
        return (times[0] <= currTime && currTime < times[1]);
    }
    return !(times[1] <= currTime && currTime < times[0]);
}

async function loadSearchRestaurants () {
    const content = document.getElementById('main-content');
    const html = `<h1 style="text-align:center">Restaurants</h1>
        <form id="search-restaurants">
        <div class="input-group mx-auto w-75">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Filters</button>
        <ul class="dropdown-menu">
            <li>
                <div class="p-2">
                        <h5>Rating</h5>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="0">    
                                <input class="form-check-input" type="radio" name="rating" id="0" value="0" checked="checked">
                                0 and up
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="1">
                                <input class="form-check-input" type="radio" name="rating" id="1" value="1">
                                1 and up
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="2">    
                                <input class="form-check-input" type="radio" name="rating" id="2" value="2">
                                2 and up
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="3">
                                <input class="form-check-input" type="radio" name="rating" id="3" value="3">
                                3 and up
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="4">
                                <input class="form-check-input" type="radio" name="rating" id="4" value="4">
                                4 and up
                            </label>
                        </div>
                        <div class="form-check form-check-inline">
                            <label class="form-check-label" for="5">        
                                <input class="form-check-input" type="radio" name="rating" id="5" value="5">
                                5 and up
                            </label>
                        </div>
                </div>
            </li>
            <li><div class="p-2"><input class="form-control w-auto btn-sm btn-md-none" id="city" name="city" type="text" placeholder="City"/></div></li>
        </ul>
        <input id="name" name="name" type="text" class="form-control" aria-label="Text input with dropdown button"/>
        <button class="btn btn-primary btn-sm btn-md-none" type="submit">Search</button>
        </div>
        </form>
        <div id="results" class="d-flex align-items-center justify-content-center"></div>
        `;
    content.innerHTML = html;
    await searchRestaurants('0');
    const submitButton = document.getElementById('search-restaurants');
    submitButton.addEventListener('submit', async function (event) {
        event.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        await searchRestaurants(rating, city, name);
    });
}

async function loadRestaurant (event) {
    event.preventDefault();
    const content = document.getElementById('main-content');
    try {
        const response = await fetch('http://192.168.0.12:8090/restaurant/?id=' + event.target.id, { signal: AbortSignal.timeout(5000) });
        console.log(response.type);
        if (!isOk(response)) {
            return;
        }
        const info = await response.json();
        content.innerHTML = `<h1 style="text-align:center">${info.name}</h1>
        <div class="p-5"></div>
        <p class="p-5 mb-2">${info.description}</p>
        `;
    } catch (e) {
        console.log(e, e.name);
        if (e.name === '') {
            const mod = new bootstrap.Modal(document.getElementById('exampleModal'));
            mod.show();
            return;
        }
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again ${e}</div>`;
    }
}

async function searchRestaurants (rating = '', city = '', name = '') {
    const content = document.getElementById('main-content');
    const query = `rating=${rating}&city=${city}&name=${name}`;
    try {
        const response = await fetch('http://192.168.0.12:8090/restaurants?' + query);
        if (!isOk(response)) {
            return;
        }
        const restaurants = await response.json();
        const results = document.getElementById('results');
        let html = '<div class="container container-sm container-md-none">';
        html += '<div class="row row-cols-sm-2 row-cols-md-3 p-5 mb-2">';
        for (let i = 0; i < restaurants.length; i++) {
            html += `<div class="col mb-5 p-4">
                        <a class="text-reset text-decoration-none" href=# onclick="loadRestaurant(event)"><h5 id="${restaurants[i].id}">${restaurants[i].name}</h5><a>
                    </div>`;
        }
        html += '</div>';
        html += '</div>';
        results.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again ${e}</div>`;
    }
}

restaurantButton.addEventListener('click', async function (event) {
    event.preventDefault();
    loadSearchRestaurants();
});

document.addEventListener('DOMContentLoaded', async function (event) {
    loadSearchRestaurants();
});

document.addEventListener('online', function () {
    if (navigator.onLine) {

    }
});
