let searchType = 1; // 1 for restaurants 0 for events
const searchHtml = `<h1 style="text-align:center" id="searchTypeName">Restaurants</h1>
<form id="search-form">
  <div class="input-group mx-auto w-75">
    <button class="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown"
      aria-expanded="false">Filters</button>
    <ul class="dropdown-menu">
      <li>
        <div class="p-2" id="ratings">
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
      <li>
        <div class="p-2"><input class="form-control w-auto btn-sm btn-md-none" id="city" name="city" type="text"
            placeholder="City" /></div>
      </li>
    </ul>
    <input id="name" name="name" type="text" class="form-control" aria-label="Text input with dropdown button" />
    <button class="btn btn-primary btn-sm btn-md-none" type="submit">Search</button>
  </div>
</form>
<div class="container container-sm container-md-none">
  <div id="results" class="row row-cols-sm-2 row-cols-md-3 p-5 mb-2"></div>
</div>
</div>`;
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

async function loadSearchDiv () {
    const content = document.getElementById('main-content');
    content.innerHTML = searchHtml;
    const resultDiv = document.getElementById('results');
    let html = '';
    for (let i = 0; i < 9; i++) {
        html += `<div><div class="card mb-3" aria-hidden="true">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title placeholder-glow">
            <span class="placeholder col-6"></span>
          </h5>
          <p class="card-text placeholder-glow">
            <span class="placeholder col-7"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-4"></span>
            <span class="placeholder col-6"></span>
            <span class="placeholder col-8"></span>
          </p>
          <a class="btn btn-primary disabled placeholder col-6" aria-disabled="true"></a>
        </div>
      </div></div>`;
    }
    resultDiv.innerHTML = html;
    await search('0');
    const submitForm = document.getElementById('search-form');
    submitForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const name = document.getElementById('name').value;
        const city = document.getElementById('city').value;
        await search(rating, city, name);
    });
}

async function loadRestaurant (event) {
    event.preventDefault();
    const content = document.getElementById('main-content');
    try {
        console.log(event.target.id);
        const response = await fetch('http://127.0.0.1:8090/restaurant/?ID=' + event.target.id, { signal: AbortSignal.timeout(5000) });
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
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again ${e}</div>`;
    }
}

async function search (rating = '', city = '', name = '') {
    let response;
    const content = document.getElementById('main-content');
    const query = searchType === 1 ? `rating=${rating}&city=${city}&name=${name}` : `city=${city}&name=${name}`;
    try {
        console.log(searchType);
        if (searchType === 1) {
            response = await fetch('http://127.0.0.1:8090/restaurants?' + query);
        } else {
            response = await fetch('http://127.0.0.1:8090/events?' + query);
        }
        if (!isOk(response)) {
            return;
        }
        const data = await response.json();
        const results = document.getElementById('results');
        if (data.length === 0) {
            results.innerHTML = '<h1 class="alert alert-danger p-3 mb-2" style="margin-top: 100px;">No results found!<h1>';
            return;
        }
        let html = '';
        for (let i = 0; i < data.length; i++) {
            let title = data[i].name.substring(0, 17);
            if (data[i].name.length > 17) {
                title += '...';
            }
            html += `<div><div class="card col mb-3">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title text-reset text-decoration-none text-nowrap" href=#>${title}</h5>
                        <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                        <a href="#" class="btn btn-primary" onclick=${searchType === 1 ? 'loadRestaurant(event)' : 'loadEvent(event)'} id="${data[i].ID}">Info Page</a>
                        </div>
                    </div>
                    </div>`;
        }
        results.innerHTML = html;
    } catch (e) {
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again ${e}</div>`;
    }
}

function changeType (type) {
    searchType = type;
    loadSearchDiv();
    if (type === 1) {
        document.getElementById('searchTypeName').innerHTML = 'Restaurants';
        document.getElementById('ratings').removeAttribute('hidden');
        return;
    }
    document.getElementById('searchTypeName').innerHTML = 'Events';
    document.getElementById('ratings').setAttribute('hidden', 'hidden');
}

restaurantButton.addEventListener('click', async function (event) {
    event.preventDefault();
    loadSearchDiv();
});

document.addEventListener('DOMContentLoaded', async function (event) {
    loadSearchDiv();
});
