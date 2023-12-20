const restaurantButton = document.getElementById('restaurant');
// TODO make error pages nice

function isOk (response) {
    if (response.ok) {
        return true;
    }
    document.getElementById('main-content').innerHTML = `<h1>${response.status} - ${response.statusText}</h1>`;
    return false;
}

async function loadSearchRestaurants () {
    const content = document.getElementById('main-content');
    const html = `<h1 style="text-align=center">Restaurants</h1>
        <form id="search-restaurants">
        <div class="input-group mx-auto w-50" id="search-restaurants">
        <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Filters</button>
        <ul class="dropdown-menu">
            <li>
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
            </li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
        </ul>
        <input id="name" name="name" type="text" class="form-control" aria-label="Text input with dropdown button">
        </div>
        </form>
        <div id="results"></div>
        `;
    content.innerHTML = html;

    await searchRestaurants('0');
}

async function searchRestaurants (rating = '', city = '', desc = '', name = '') {
    const content = document.getElementById('main-content');
    const query = `rating=${rating}&city=${city}&desc=${desc}&name=${name}`;
    console.log(query);
    try {
        const response = await fetch('http://127.0.0.1:8090/restaurants?' + query);
        if (!isOk(response)) {
            return;
        }
        let restaurants = await response.json();
        const results = document.getElementById('results');
        restaurants = restaurants.map(restaurant => ({ name: restaurant.name, description: restaurant.description.split(' ').slice(0, 5).join(' ').concat('...'), phone_number: restaurant.phone_number }));
        let html = '<div class="container text-center">';
        for (let i = 0; i < restaurants.length; i++) {
            if (i % 3 === 0) {
                html += '<div class="row">';
            }
            html += `<div class="col">${JSON.stringify(restaurants[i])}</div>`;
            if (i % 3 === 2) {
                html += '</div>';
            }
        }
        html += '</div>';
        results.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again</div>`;
    }
}

document.addEventListener('submit', async function (event) {
    const target = event.target.closest('#search-restaurants');
    if (target && target.id === 'search-restaurants') {
        event.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const name = document.getElementById('name').value;
        await searchRestaurants(rating, '', '', name);
    }
});

restaurantButton.addEventListener('click', async function (event) {
    event.preventDefault();
    loadSearchRestaurants();
});
