let searchType = 1; // 1 for restaurants 0 for events
let currentRestaurantID;
const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

const restaurantButton = document.getElementById('restaurant');
// TODO make error pages nice

function isOk(response) {
    if (response.ok) {
        return true;
    }
    document.getElementById('main-content').innerHTML = `<h1>${response.status} - ${response.statusText}</h1>`;
    return false;
}

function isOpen(openingTimes) {
    const date = new Date();
    const times = openingTimes[date.getDay() > 0 ? date.getDay() - 1 : 6];
    const currTime = date.getHours().toString().padStart(2, '0') + ':' + date.getMinutes().toString().padStart(2, '0');
    if (!times[0]) {
        return false;
    }
    return (times[0] <= currTime && currTime < times[1]);
}

async function loadSearchDiv() {
    document.getElementById('info').style.display = 'none';
    document.getElementById('searchArea').style.display = 'block';
    document.getElementById('spinner').style.display = 'none';
    await search('0');
    const submitForm = document.getElementById('search-form');
    submitForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        const rating = document.querySelector('input[name="rating"]:checked').value;
        const name = document.getElementById('name').value;
        const city = document.getElementById('citySearch').value;
        await search(rating, city, name);
    });
}

async function loadRestaurant(event) {
    event.preventDefault();
    document.getElementById('searchArea').style.display = 'none';
    document.getElementById('spinner').style.display = 'block';
    tableBody = document.getElementById('tableBody');
    const content = document.getElementById('info');
    let html = '';
    let review;
    try {
        const response = await fetch('http://127.0.0.1:8080/restaurant/?ID=' + event.target.id);
        const imgResponse = await fetch('http://127.0.0.1:8080/images/?ID=' + event.target.id);
        const reviewResponse = await fetch('http://127.0.0.1:8080/reviews/?restaurantID=' + event.target.id);
        const eventResponse =  await fetch('http://127.0.0.1:8080/events/?restaurantID=' + event.target.id);
        if (!isOk(response)) {
            return;
        }
        const info = await response.json();
        const reviews = await reviewResponse.json();
        const events = await eventResponse.json();
        if (document.getElementById('searchArea').style.display === 'block') {
            return;
        }
        currentRestaurantID = info['ID'];
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
        if (isOpen(info['opening_times'])) {
            document.getElementById('currentlyOpen').innerHTML = 'Open, closes at ' + info['opening_times'][new Date().getDay() - 1][1];
            document.getElementById('currentlyOpen').style.color = 'green';
        } else {
            document.getElementById('currentlyOpen').innerHTML = 'Closed';
            document.getElementById('currentlyOpen').style.color = 'red';
        }
        document.getElementById('addressInfo').innerHTML = `${info['address'].join(', ')}`;
        document.getElementById('phoneNumberInfo').innerHTML = info['phone_number'];
        document.getElementById('ratingInfo').innerHTML = `${info['rating']} (${reviews.length} reviews)`;
        drawStars('starsInfo', info['rating']);

        html = '';
        const ratings = [];
        for (let i = 0; i < reviews.length; i++) {
            review = reviews[i];
            ratings.push(review['rating'])
            html += `<div class="border px-2 pb-2"><h4>${review['title']}</h4>
            <div id="stars${i}"></div>
            <h5>${review['name']}</h5>
            <a href="#" class="btn btn-primary btn-sm" onclick="showReview(event)" id="${review['ID']}">Expand</a>
            </div>
            `;
        }
        document.getElementById('reviews').innerHTML = html;
        for (let i = 0; i < reviews.length; i++) {
            drawStars('stars'+i.toString(), ratings[i]);
        }

        for (let i = 0; i < events.length; i++) {

        }
    
        document.getElementById('spinner').style.display = 'none';
        document.getElementById('info').style.display = 'block';
    } catch (e) {
        content.innerHTML = `<div class="alert alert-danger" role="alert">
        Something wrong happened please try again ${e}</div>`;
    }
}

async function search(rating = '', city = '', name = '') {
    searchPlaceHolder();
    let response;
    const content = document.getElementById('main-content');
    const query = searchType === 1 ? `rating=${rating}&city=${city}&name=${name}` : `city=${city}&name=${name}`;
    try {
        if (searchType === 1) {
            response = await fetch('http://127.0.0.1:8080/restaurants?' + query);
        } else {
            response = await fetch('http://127.0.0.1:8080/events?' + query);
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
                        <h5 class="card-title text-nowrap" href=# style="text-align: center;">${title}</h5>
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

async function showReview(event) {
    event.preventDefault();
    try{
        console.log(event)
        response = await fetch('http://127.0.0.1:8080/review/?ID=' + event.target.id);
        if (!isOk(response)) {
            return;
        }
        const review = await response.json();
        document.getElementById('reviewBody').innerHTML = `<h4>${review['title']}</h4>
                                                            <div id="reviewBodyStars"></div>
                                                            <h5>${review['name']}</h5>
                                                            <p>${review['description']}</p>
                                                            `;
        drawStars('reviewBodyStars', review["rating"]);
        var myModal = new bootstrap.Modal(document.getElementById('review'), {})
        myModal.show()

    } catch (e) {
        // to do
    }    
}

function changeType(type) {
    searchType = type;
    loadSearchDiv();
    if (type === 1) {
        document.getElementById('searchTypeName').innerHTML = 'Restaurants';
        document.getElementById('ratings').removeAttribute('hidden');
        document.getElementById('collapseLabel').innerHTML = 'Add a restaurant';
        document.getElementById('nameLabel').innerHTML = 'Restaurant Name';
        document.getElementById('collapseLabel')
        return;
    }
    document.getElementById('searchTypeName').innerHTML = 'Events';
    document.getElementById('ratings').setAttribute('hidden', 'hidden');
    document.getElementById('collapseLabel').innerHTML = 'Add an event';
    document.getElementById('nameLabel').innerHTML = 'Add an event';
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
    try
    {    let html = '';
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
        } catch (e){
            console.log(e)
        }
}

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
    const formData = new FormData(reviewForm);
    const jsonData = JSON.stringify({
        title: document.getElementById('reviewTitle').value,
        name: document.getElementById('nameReview').value,
        description: document.getElementById('descReview').value,
        rating: parseInt(formData.get('rating')),
        restaurantID: currentRestaurantID
    });
    const response = await fetch("http://127.0.0.1:8080/review/add", {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: jsonData
    });
});