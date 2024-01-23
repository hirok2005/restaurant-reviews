let searchType = 1; // 1 for restaurants 0 for events
let currentRestaurantID; // these make sure for slow connections info from previous request is not shown while waiting for new request
let currentEventID;
const currDate = new Date().toISOString();
const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

const restaurantButton = document.getElementById('restaurant');
// TODO make error pages nice

function isOk(response) {
    if (response.ok) {
        return true;
    }
    handleError("Something went wrong please try again")
    return false;
}

function handleError(e) {
    console.error(e)
    if (document.getElementById('errorModal').classList.contains('show')) {
        return;
    }
    document.getElementById('errorBody').innerHTML = e
    new bootstrap.Modal(document.getElementById('errorModal'), {}).show()
}

function isOpen(openingTimes) {
    const date = new Date();
    const times = openingTimes[date.getDay() > 0 ? date.getDay() - 1 : 6];
    const currTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    if (!times[0]) {
        return false;
    }
    console.log((times[0] <= currTime && currTime < times[1]))
    return (times[0] <= currTime && currTime < times[1]);
}

async function loadSearchDiv() {
    document.getElementById('info').style.display = 'none';
    document.getElementById('searchArea').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
    await search('0');
}

async function loadRestaurant(ID) {
    currentRestaurantID = ID.toString();
    document.getElementById('searchArea').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    tableBody = document.getElementById('tableBody');
    const content = document.getElementById('info');
    let html = '';
    let review;
    let event;
    try {
        const response = await fetch('/restaurant/?ID=' + ID);
        // const imgResponse = await fetch('/images/?ID=' + ID);
        const reviewResponse = await fetch('/reviews/?restaurantID=' + ID);
        const eventResponse = await fetch('/events/?upcoming=T&restaurantID=' + ID);
        if (!isOk(response)) {
            return;
        }
        const info = await response.json();
        const reviews = await reviewResponse.json();
        const events = await eventResponse.json();
        console.log(info["ID"] !== currentRestaurantID)
        console.log(info["ID"], currentRestaurantID)
        if (document.getElementById('searchArea').style.display === 'block' || info["ID"] !== currentRestaurantID) {
            document.getElementById('spinner').style.display = 'none';
            return;
        }
        html = '';
        document.getElementById('nameTitle').innerHTML = info['name'];
        for (let i = 0; i < 7; i++) {
            html += `<tr>
            <th scope="row">${days[i]}</th>
            <td>${info['opening_times'][i][0] ? info['opening_times'][i][0] : 'closed'}</td>
            <td>${info['opening_times'][i][0] ? info['opening_times'][i][1] : 'closed'}</td>
            </tr>`
        }
        tableBody.innerHTML = html;
        document.getElementById('description').innerHTML = info['description'];
        console.log(info)
        if (isOpen(info['opening_times'])) {

            console.log("here")
            document.getElementById('currentlyOpen').innerHTML = 'Open, closes at ' + info['opening_times'][new Date().getDay() > 0 ? new Date().getDay() - 1 : 6][1];
            document.getElementById('currentlyOpen').style.color = 'green';
        } else {
            document.getElementById('currentlyOpen').innerHTML = 'Closed';
            document.getElementById('currentlyOpen').style.color = 'red';
        }
        document.getElementById('addressInfo').innerHTML = `${info['address'].join(', ')}`;
        document.getElementById('phoneNumberInfo').innerHTML = info['phone_number'];
        document.getElementById('ratingInfo').innerHTML = `${info['rating'].toFixed(1)} (${reviews.length} reviews)`;
        drawStars('starsInfo', info['rating']);

        html = '';
        const ratings = [];
        for (let i = 0; i < reviews.length; i++) {
            review = reviews[i];
            ratings.push(review['rating'])
            html += `<div class="border px-2 pb-2"><h4>${review['title']}</h4>
            <div id="stars${i}"></div>
            <h5>${review['name']}</h5>
            <a href="#" class="btn btn-primary btn-sm" onclick="showInfoModal(${review['ID']}, 'review')" id="${review['ID']}">Expand</a>
            </div>
            `;
        }
        document.getElementById('reviews').innerHTML = html;
        for (let i = 0; i < reviews.length; i++) {
            drawStars('stars' + i.toString(), ratings[i]);
        }

        html = '';
        for (let i = 0; i < events.length; i++) {
            event = events[i];
            html += `<div class="border px-2 pb-2"><h4>${event['name']}</h4>
            <p>${event['start'].replace('T', ' ')}</p>
            <a href="#" class="btn btn-primary btn-sm" onclick="showInfoModal(${event['ID']}, 'event')" id="${event['ID']}">Expand</a>
            </div>
            `;
        }
        document.getElementById('events').innerHTML = html;

        document.getElementById('spinner').style.display = 'none';
        document.getElementById('info').style.display = 'block';
        document.getElementById('reviews').scroll(0, 0);
    } catch (e) {
        handleError(e)
    }
}

async function loadEvent(ID) {

    currentEventID = ID.toString();
    document.getElementById('searchArea').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    tableBody = document.getElementById('tableBody');
    const content = document.getElementById('info');
    let html = '';
    let review;
    let event;
    try {
        const response = await fetch('/restaurant/?ID=' + ID);
        // const imgResponse = await fetch('/images/?ID=' + ID);
        const reviewResponse = await fetch('/reviews/?restaurantID=' + ID);
        const eventResponse = await fetch('/events/?upcoming=T&restaurantID=' + ID);
        if (!isOk(response)) {
            return;
        }
        const info = await response.json();
        const reviews = await reviewResponse.json();
        const events = await eventResponse.json();
        console.log(info["ID"] !== currentRestaurantID)
        console.log(info["ID"], currentRestaurantID)
        if (document.getElementById('searchArea').style.display === 'block' || info["ID"] !== currentRestaurantID) {
            document.getElementById('spinner').style.display = 'none';
            return;
        }
        html = '';
        document.getElementById('nameTitle').innerHTML = info['name'];
        for (let i = 0; i < 7; i++) {
            html += `<tr>
            <th scope="row">${days[i]}</th>
            <td>${info['opening_times'][i][0] ? info['opening_times'][i][0] : 'closed'}</td>
            <td>${info['opening_times'][i][0] ? info['opening_times'][i][1] : 'closed'}</td>
            </tr>`
        }
        tableBody.innerHTML = html;
        document.getElementById('description').innerHTML = info['description'];
        console.log(info)
        if (isOpen(info['opening_times'])) {

            console.log("here")
            document.getElementById('currentlyOpen').innerHTML = 'Open, closes at ' + info['opening_times'][new Date().getDay() > 0 ? new Date().getDay() - 1 : 6][1];
            document.getElementById('currentlyOpen').style.color = 'green';
        } else {
            document.getElementById('currentlyOpen').innerHTML = 'Closed';
            document.getElementById('currentlyOpen').style.color = 'red';
        }
        document.getElementById('addressInfo').innerHTML = `${info['address'].join(', ')}`;
        document.getElementById('phoneNumberInfo').innerHTML = info['phone_number'];
        document.getElementById('ratingInfo').innerHTML = `${info['rating'].toFixed(1)} (${reviews.length} reviews)`;
        drawStars('starsInfo', info['rating']);

        html = '';
        const ratings = [];
        for (let i = 0; i < reviews.length; i++) {
            review = reviews[i];
            ratings.push(review['rating'])
            html += `<div class="border px-2 pb-2"><h4>${review['title']}</h4>
            <div id="stars${i}"></div>
            <h5>${review['name']}</h5>
            <a href="#" class="btn btn-primary btn-sm" onclick="showInfoModal(${review['ID']}, 'review')" id="${review['ID']}">Expand</a>
            </div>
            `;
        }
        document.getElementById('reviews').innerHTML = html;
        for (let i = 0; i < reviews.length; i++) {
            drawStars('stars' + i.toString(), ratings[i]);
        }

        html = '';
        for (let i = 0; i < events.length; i++) {
            let a = events[i];
            html += `<div class="border px-2 pb-2"><h4>${a['name']}</h4>
            <p>${a['start']}</p>
            <a href="#" class="btn btn-primary btn-sm" onclick="showInfoModal(${a['ID']}, 'event')" id="${a['ID']}">Expand</a>
            </div>
            `;
        }
        document.getElementById('events').innerHTML = html;

        document.getElementById('spinner').style.display = 'none';
        document.getElementById('info').style.display = 'block';
        document.getElementById('reviews').scroll(0, 0);
        console.log('hmmmm');
    } catch (e) {
        handleError(e)
    }
}

async function search(rating = '', city = '', name = '') {
    searchPlaceHolder();
    let response;
    const content = document.getElementById('main-content');
    const query = searchType === 1 ? `rating=${rating}&city=${city}&name=${name}` : `city=${city}&name=${name}`;
    try {
        if (searchType === 1) {
            response = await fetch('/restaurants?' + query, { signal: AbortSignal.timeout(5000) });
        } else {
            response = await fetch('/events?' + query);
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
            let title = data[i]["name"]
            html += `<div class="col mb-3"><div class="card mb-3 h-100">
                        <img src="..." class="card-img-top" alt="...">
                        <div class="card-body">
                        <h5 class="card-title text-nowrap" href=# style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${title}</h5>
                        <p class="card-text" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis">${data[i]["description"]}</p>
                        <a href="#" class="btn btn-primary" onclick=${searchType === 1 ? `loadRestaurant(${data[i].ID})` : `loadEvent(${data[i].ID})`} id="${data[i].ID}">Info Page</a>
                        </div>
                    </div>
                    </div>`;
        }
        results.innerHTML = html;
    } catch (e) {
        handleError(e)
    }
}

async function showInfoModal(ID, type) {
    try {
        response = await fetch(`/${type}/?ID=` + ID);
        if (!isOk(response)) {
            return;
        }
        const info = await response.json();
        document.getElementById('infoTitleModal').innerHTML = type === 'review' ? info['title'] : info['name'];
        document.getElementById('infoBody').innerHTML = type === 'review' ? `<div id="reviewBodyStars"></div>
                                                            <h5>${info['name']}</h5>
                                                            <p>${info['description']}</p>` : `
                                                            <p>${info['description']}</p>
                                                            <p>${info['start']} ${info['end']}</p>`;

        if (type === 'review') {
            drawStars('reviewBodyStars', info["rating"]);
        }
        new bootstrap.Modal(document.getElementById('infoModal'), {}).show()

    } catch (e) {
        handleError(e)
    }
}

function changeType(type) {
    searchType = type;
    loadSearchDiv();
    if (type === 1) {
        document.getElementById('searchTypeName').innerHTML = 'Restaurants';
        document.getElementById('ratings').removeAttribute('hidden');
        document.getElementById('addRestaurantForm').removeAttribute('hidden');
        return;
    }
    document.getElementById('searchTypeName').innerHTML = 'Events';
    document.getElementById('ratings').setAttribute('hidden', 'hidden');
    document.getElementById('addRestaurantForm').setAttribute('hidden', 'hidden')
}

function changeColourMode() {
    if (document.documentElement.getAttribute('data-bs-theme') === 'dark') {
        document.documentElement.setAttribute('data-bs-theme', 'light');
        return;
    }
    document.documentElement.setAttribute('data-bs-theme', 'dark');
}

function searchPlaceHolder() {
    const resultDiv = document.getElementById('results');
    let html = '';
    for (let i = 0; i < 9; i++) {
        html += `<div><div class="card mb-3" aria-hidden="true">
        <img src="..." class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title placeholder-glow" style="text-align: center;">
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
}

function drawStars(id, rating) {
    try {
        let html = '';
        for (let i = 0; i < Math.floor(rating); i++) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>`;
        }
        if (rating > Math.floor(rating)) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-half" viewBox="0 0 16 16">
            <path d="M5.354 5.119 7.538.792A.52.52 0 0 1 8 .5c.183 0 .366.097.465.292l2.184 4.327 4.898.696A.54.54 0 0 1 16 6.32a.55.55 0 0 1-.17.445l-3.523 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256a.5.5 0 0 1-.146.05c-.342.06-.668-.254-.6-.642l.83-4.73L.173 6.765a.55.55 0 0 1-.172-.403.6.6 0 0 1 .085-.302.51.51 0 0 1 .37-.245zM8 12.027a.5.5 0 0 1 .232.056l3.686 1.894-.694-3.957a.56.56 0 0 1 .162-.505l2.907-2.77-4.052-.576a.53.53 0 0 1-.393-.288L8.001 2.223 8 2.226z"/>
            </svg>`
        }
        for (let i = Math.ceil(rating); i < 5; i++) {
            html += `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star" viewBox="0 0 16 16">
            <path d="M2.866 14.85c-.078.444.36.791.746.593l4.39-2.256 4.389 2.256c.386.198.824-.149.746-.592l-.83-4.73 3.522-3.356c.33-.314.16-.888-.282-.95l-4.898-.696L8.465.792a.513.513 0 0 0-.927 0L5.354 5.12l-4.898.696c-.441.062-.612.636-.283.95l3.523 3.356-.83 4.73zm4.905-2.767-3.686 1.894.694-3.957a.56.56 0 0 0-.163-.505L1.71 6.745l4.052-.576a.53.53 0 0 0 .393-.288L8 2.223l1.847 3.658a.53.53 0 0 0 .393.288l4.052.575-2.906 2.77a.56.56 0 0 0-.163.506l.694 3.957-3.686-1.894a.5.5 0 0 0-.461 0z"/>
            </svg>`
        }
        document.getElementById(id).innerHTML = html;
    } catch (e) {
        handleError(e)
    }
}

document.getElementById('eventStart').min = currDate.substring(0, currDate.length - 8);

const submitForm = document.getElementById('search-form');
submitForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const rating = document.querySelector('input[name="rating"]:checked').value;
    const name = document.getElementById('name').value;
    const city = document.getElementById('citySearch').value;
    await search(rating, city, name);
});

restaurantButton.addEventListener('click', async function (event) {
    event.preventDefault();
    loadSearchDiv();
});

document.addEventListener('DOMContentLoaded', async function (event) {
    loadSearchDiv();
});

const reviewForm = document.getElementById('review-form');

reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    let formData = new FormData(reviewForm);
    formData.append("restaurantID", currentRestaurantID);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
    console.log(jsonData);
    const response = await fetch("/review/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    });
    event.target.reset()
    scroll(0, 0);
    new bootstrap.Collapse(document.getElementById('collapseFormReview')).toggle();

    loadRestaurant(currentRestaurantID);
});

const eventForm = document.getElementById('event-form');

eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(eventForm);
    formData.append("restaurantID", currentRestaurantID);
    const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
    const response = await fetch("/event/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: jsonData
    });
    event.target.reset()
    scroll(0, 0);
    new bootstrap.Collapse(document.getElementById('collapseFormEvent')).toggle();

    loadRestaurant(currentRestaurantID);
});