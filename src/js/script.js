document.addEventListener("DOMContentLoaded", ready);

function ready(){
    console.log("Hello there!")
    getCatCategories();
    getCatBreeds();
    // searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit="+limit);
}

const user = window.prompt("Enter your nickname", "");
let limit = 8, page;
if(window.screen.width >= 992){
    limit = 9;
}
if(window.screen.width >= 1200){
    limit = 12;
}

const apiKey = "live_jFCZR4OFaVdwt4fuRNyt5VG4uH3HUAebrvZUPwIDwlpuSH2i3E9Kcd007mdx8DsH";

const root = document.getElementById('root');
const main = document.querySelector('.main');

const menu = document.querySelector('.menu');
const mobileMenu = document.querySelector('.menu-mobile');

const categoriesHeader = document.querySelectorAll('.sort-menu__header')[0];
const categoriesButton = document.querySelectorAll('.sort-menu__button')[0];
const categoriesList = document.querySelectorAll('.sort-menu__list')[0];
const unsetCategory = document.querySelector('.categories-list__unset');

const breedsHeader = document.querySelectorAll('.sort-menu__header')[1];
const breedsButton = document.querySelectorAll('.sort-menu__button')[1];
const breedsList = document.querySelectorAll('.sort-menu__list')[1];
const unsetBreed = document.querySelector('.breeds-list__unset');

const votesButton = document.querySelector('.votes');
const resetVotes = document.querySelector('.resetVotes');
const favoritesButton = document.querySelector('.favorites');
const resetFavourites = document.querySelector('.resetFavourites');
// const imagesButton = document.querySelector('.images');
// const uploadImage = document.querySelector(".uploadImage");
const searchAll = document.querySelector('.searchAll');
const search = document.querySelector('.search__button');
// const nextPage = document.querySelector('.page__next');
// const previousPage = document.querySelector('.page__previous');

// Default search
searchAll.addEventListener("click", ()=>{
    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
    nextCall = function(){
        searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
    }
})

//Start screen search
search.addEventListener("click", ()=>{
    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
})

//Open mobile menu event
menu.addEventListener("click", () => {
    menu.classList.toggle('menu_open');
    mobileMenu.classList.toggle('menu-mobile_open');
});

//Open category list event
categoriesButton.addEventListener("click", categoriesMenuToggle)

function categoriesMenuToggle(){

    categoriesHeader.classList.toggle("sort-menu__header_open");
    categoriesList.classList.toggle("sort-menu__list_open");
    categoriesButton.classList.toggle("sort-menu__button_open");
    
}

//Open breeds list event
breedsButton.addEventListener("click", breedsMenuToggle);

function breedsMenuToggle(){

    breedsHeader.classList.toggle("sort-menu__header_open");
    breedsList.classList.toggle("sort-menu__list_open");
    breedsButton.classList.toggle("sort-menu__button_open");

}

//Unset category sort
unsetCategory.addEventListener("click", function(){
    categoriesHeader.textContent = "Category";
    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit="+limit);
    nextCall = function(){
        searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
    }
})

//Unset breed sort
unsetBreed.addEventListener("click", function(){
    breedsHeader.textContent = "Breed"
    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit="+limit);
    nextCall = function(){
        searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
    }
})

//Get your votes
votesButton.addEventListener("click", function(){
    searchRequest("GET", "https://api.thecatapi.com/v1/votes?sub_id=" + user + "&limit=" + limit);
    nextCall = function(){
        searchRequest("GET", "https://api.thecatapi.com/v1/votes?sub_id=" + user + "&limit=" + limit);
    }
});

//Reset all votes
resetVotes.addEventListener("click", function(){

    let request = new XMLHttpRequest();

    request.open("GET", "https://api.thecatapi.com/v1/votes?sub_id="+user);

    request.setRequestHeader("x-api-key", apiKey);

    request.onload = function(){
        let data = JSON.parse(this.response);
        
        if(request.status >= 200 && request.status <400){

            data.forEach((vote) => {
                console.log(vote.id)
                let deleteRequest = new XMLHttpRequest();
                deleteRequest.onload = () => {console.log(deleteRequest.responseText)}
                deleteRequest.open("DELETE", "https://api.thecatapi.com/v1/votes/"+vote.id);
                deleteRequest.setRequestHeader("x-api-key", apiKey);
                deleteRequest.send();
            })

        }
    }
    request.send();
})

//Get your favorites
favoritesButton.addEventListener("click", function(){
    searchRequest("GET", "https://api.thecatapi.com/v1/favourites?sub_id="+user);
    nextCall = function(){
        searchRequest("GET", "https://api.thecatapi.com/v1/favourites?sub_id="+user);
    }
});

//Reset all favourites
resetFavourites.addEventListener("click", function(){

    let request = new XMLHttpRequest();

    request.open("GET", "https://api.thecatapi.com/v1/favourites?sub_id="+user);

    request.setRequestHeader("x-api-key", apiKey);

    request.onload = function(){
        let data = JSON.parse(this.response);
        
        if(request.status >= 200 && request.status <400){

            data.forEach((favourite) => {
                console.log(favourite.id)
                let deleteRequest = new XMLHttpRequest();
                deleteRequest.onload = () => {console.log(deleteRequest.responseText)}
                deleteRequest.open("DELETE", "https://api.thecatapi.com/v1/favourites/"+favourite.id);
                deleteRequest.setRequestHeader("x-api-key", apiKey);
                deleteRequest.send();
            })

        }
    }
    request.send();
})

//Get your uploaded images
/*
Nothing here...
*/

//Create search request to API
function searchRequest(method, url){

    console.log("Start request")

    let request = new XMLHttpRequest();
    
    request.open(method, url, true);

    request.setRequestHeader("x-api-key", apiKey);

    request.onload = function(){
        let data = JSON.parse(this.response);

        if(request.status >= 200 && request.status <400){
            displayCats(data)
        }
        
    }

    request.send();
}

//Buld images DOM
function displayCats(array){
    let elementsArray = [];
    console.log(array);
    array.forEach((element) => {
        if(element.hasOwnProperty('image')){
            element.url = element.image.url;
        }
        if(!element.hasOwnProperty('image_id')){
            element.image_id = element.id;
        }
        const card = document.createElement('div');
        card.classList.add('card');

        const image = document.createElement('img');
        image.src = element.url;
        
        const cardInfo = document.createElement("div");
        cardInfo.classList.add("card-info");

        if(element.breeds && element.breeds.length > 0){
            const breed = document.createElement('div');
            breed.classList.add("card__info");
            breed.setAttribute("title", "Breed");
            breed.textContent = element.breeds[0].name;
            cardInfo.appendChild(breed);
        }

        if(element.categories){
            const category = document.createElement('div');
            category.classList.add("card__info");
            category.setAttribute("title", "Category")
            category.textContent = element.categories[0].name.charAt(0).toUpperCase() + element.categories[0].name.slice(1);
            cardInfo.appendChild(category);
        }
        
        const heart = document.createElement('div');
        heart.innerHTML = '<svg class="card__heart" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 502 502" style="enable-background:new 0 0 502 502;" xml:space="preserve" width="512" height="512"><g><g><path d="M370.994,49.998c-61.509,0-112.296,45.894-119.994,105.306    c-7.698-59.412-58.485-105.306-119.994-105.306C64.176,49.998,10,104.174,10,171.004s80.283,135.528,116.45,166.574    C160.239,366.582,251,452.002,251,452.002s90.761-85.42,124.55-114.424C411.717,306.532,492,237.834,492,171.004    S437.824,49.998,370.994,49.998z"/><path style="fill: black;" d="M251,462.002c-2.464,0-4.928-0.906-6.854-2.718c-0.906-0.853-90.981-85.595-124.21-114.119l-0.348-0.299    C80.771,311.548,0,242.216,0,171.004C0,98.767,58.769,39.998,131.006,39.998c52.959,0,99.547,31.914,119.994,78.382    c20.446-46.468,67.035-78.382,119.994-78.382C443.231,39.998,502,98.767,502,171.004c0,71.211-80.771,140.543-119.588,173.862    l-0.348,0.299c-33.231,28.525-123.304,113.266-124.21,114.119C255.928,461.096,253.464,462.002,251,462.002z M131.006,59.998    C69.797,59.998,20,109.795,20,171.004c0,62.021,78.917,129.761,112.615,158.687l0.348,0.299    c28.14,24.155,96.205,87.815,118.037,108.294c21.832-20.479,89.897-84.139,118.037-108.294l0.348-0.299    C403.083,300.765,482,233.025,482,171.004c0-61.209-49.797-111.006-111.006-111.006c-55.619,0-102.941,41.525-110.077,96.591    c-0.646,4.984-4.891,8.715-9.917,8.715s-9.271-3.73-9.917-8.715C233.948,101.523,186.625,59.998,131.006,59.998z"/></g></g></svg>'
        heart.setAttribute("imageId", element.image_id)
        heart.addEventListener("click", handleFavorite)

        const upVote = document.createElement('div');
        upVote.innerHTML = '<svg class="card__vote card__vote-up" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 485.027 485.027" xml:space="preserve"><g><g><path id="XMLID_1929_" style="fill:#3C92CA;" d="M109.4,459.991H13c-2.1,0-3.9-1.8-3.9-3.9v-248.4c0-2.1,1.8-3.9,3.9-3.9h96.4                                c2.1,0,3.9,1.8,3.9,3.9v248.4C113.3,458.191,111.6,459.991,109.4,459.991z"/>                            <path d="M284.6,20.391c-28.2-20.7-67.2-8.8-68.8-8.3c-3.8,1.2-6.3,4.7-6.3,8.6v85.8c0,29.1-13.8,53.7-41.1,73.2                                c-21.1,15.1-42.7,21.3-42.9,21.4c-0.2,0-0.3,0.1-0.5,0.2l-5.1,1.7c-3-4.9-8.3-8.2-14.5-8.2H16.9c-9.3,0-16.9,7.6-16.9,16.9v240.5                                c0,9.3,7.6,16.9,16.9,16.9h88.6c8,0,14.7-5.6,16.4-13c11.9,12.7,28.8,20.7,47.6,20.7h209.8c44.6,0,73.1-23.3,78.1-64l26.8-170.2                                c3.9-24.7-6.2-49.7-25.8-63.7c-11.1-8-24.2-12.2-37.9-12.2H311.4v-79.6C311.4,55.891,302.4,33.491,284.6,20.391z M104.2,450.891                                H18.1v-238h86.1V450.891z M420.5,184.791c9.9,0,19.3,3,27.3,8.8c14,10.1,21.3,28.2,18.4,46.2l-26.7,170.3c0,0.1,0,0.2,0,0.3                                c-4.9,39.8-35.4,48.2-60.2,48.2H169.5c-26,0-47.1-21.1-47.1-47.1v-190.2l8.3-2.8c2.9-0.8,25.2-7.6,47.8-23.7 c32.1-22.8,49.1-53.3,49.1-88.2v-78.6c10.4-2,31.3-4,46.4,7.1c12.8,9.4,19.3,26.9,19.3,52v88.7c0,5,4.1,9.1,9.1,9.1h118.1V184.791 z"/></g></g></svg>'
        upVote.classList.add('upVote');
        upVote.setAttribute('imageId', element.image_id);
        upVote.setAttribute('value', 1);
        upVote.addEventListener("click", handleVote);

        const downVote = document.createElement('div');
        downVote.innerHTML = '<svg class="card__vote card__vote-down" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 485.027 485.027" xml:space="preserve"><g><g><path id="XMLID_1929_" style="fill: red;" d="M109.4,459.991H13c-2.1,0-3.9-1.8-3.9-3.9v-248.4c0-2.1,1.8-3.9,3.9-3.9h96.4                                c2.1,0,3.9,1.8,3.9,3.9v248.4C113.3,458.191,111.6,459.991,109.4,459.991z"/>                            <path d="M284.6,20.391c-28.2-20.7-67.2-8.8-68.8-8.3c-3.8,1.2-6.3,4.7-6.3,8.6v85.8c0,29.1-13.8,53.7-41.1,73.2                                c-21.1,15.1-42.7,21.3-42.9,21.4c-0.2,0-0.3,0.1-0.5,0.2l-5.1,1.7c-3-4.9-8.3-8.2-14.5-8.2H16.9c-9.3,0-16.9,7.6-16.9,16.9v240.5                                c0,9.3,7.6,16.9,16.9,16.9h88.6c8,0,14.7-5.6,16.4-13c11.9,12.7,28.8,20.7,47.6,20.7h209.8c44.6,0,73.1-23.3,78.1-64l26.8-170.2                                c3.9-24.7-6.2-49.7-25.8-63.7c-11.1-8-24.2-12.2-37.9-12.2H311.4v-79.6C311.4,55.891,302.4,33.491,284.6,20.391z M104.2,450.891                                H18.1v-238h86.1V450.891z M420.5,184.791c9.9,0,19.3,3,27.3,8.8c14,10.1,21.3,28.2,18.4,46.2l-26.7,170.3c0,0.1,0,0.2,0,0.3                                c-4.9,39.8-35.4,48.2-60.2,48.2H169.5c-26,0-47.1-21.1-47.1-47.1v-190.2l8.3-2.8c2.9-0.8,25.2-7.6,47.8-23.7 c32.1-22.8,49.1-53.3,49.1-88.2v-78.6c10.4-2,31.3-4,46.4,7.1c12.8,9.4,19.3,26.9,19.3,52v88.7c0,5,4.1,9.1,9.1,9.1h118.1V184.791 z"/></g></g></svg>'
        downVote.classList.add('downVote');
        downVote.setAttribute('imageId', element.image_id);
        downVote.setAttribute('value', 0);
        downVote.addEventListener("click", handleVote);

        const cardBottom = document.createElement('div');
        cardBottom.classList.add("card__bottom");
        cardBottom.appendChild(heart);
        cardBottom.appendChild(upVote);
        cardBottom.appendChild(downVote);

        card.appendChild(image);
        card.appendChild(cardInfo);
        card.appendChild(cardBottom);

        elementsArray.push(card);
    })
    const search = document.createElement("div");
    search.classList.add("search");
    
    const searchButton = document.createElement("button");
    searchButton.classList.add("search__button");
    searchButton.textContent = "Next cats";
    searchButton.addEventListener("click", nextCall)
    search.appendChild(searchButton);

    elementsArray.push(search);

    main.replaceChildren(...elementsArray);
}

//Get categories list
function getCatCategories(){

    const categories = document.querySelector(".categories-list");

    let request = new XMLHttpRequest();

    request.open('GET', 'https://api.thecatapi.com/v1/categories', true);

    request.setRequestHeader("x-api-key", apiKey);

    request.onload = function(){
        let data = JSON.parse(this.response);

        data.forEach(category =>{
            const li = document.createElement('li');
            li.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
            li.setAttribute('categoryId', category.id);
            li.addEventListener('click', function(){
                let categoryId = this.getAttribute("categoryId");
                categoriesHeader.textContent = category.name.charAt(0).toUpperCase() + category.name.slice(1);
                breedsHeader.textContent = "Breed";
                searchRequest("GET", "https://api.thecatapi.com/v1/images/search?category_ids=" + categoryId + "&limit=" + limit);
                nextCall = function(){
                    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?category_ids=" + categoryId + "&limit=" + limit);
                }
            })

            categories.appendChild(li);
        })
    }

    request.send();

}

//Get breeds list
function getCatBreeds(){

    const breeds = document.querySelector(".breeds-list");

    let request = new XMLHttpRequest();

    request.open('GET', 'https://api.thecatapi.com/v1/breeds', true);

    request.setRequestHeader("x-api-key", apiKey);

    request.onload = function(){
        let data = JSON.parse(this.response);

        data.forEach(breed =>{

            const li = document.createElement('li');
            li.textContent = breed.name;
            li.setAttribute('breedId', breed.id);
            li.addEventListener('click', function () {
                let breedId = this.getAttribute("breedId");
                breedsHeader.textContent = breed.name;
                categoriesHeader.textContent = "Category";
                searchRequest("GET", "https://api.thecatapi.com/v1/images/search?breed_ids=" + breedId + "&limit=" + limit);
                nextCall = function(){
                    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?breed_ids=" + breedId + "&limit=" + limit);
                }
            })

            breeds.appendChild(li);
        })
    }

    request.send();

}

//Handle vote
function handleVote(){
    let imageId = this.getAttribute("imageId");
    let value = this.getAttribute("value");

    let vote = {
        "image_id": imageId,
        "sub_id": user,
        "value": value
    }

    console.log(vote);

    let request = new XMLHttpRequest();

    request.onload = () => {
        const response = JSON.parse(request.responseText);
        console.log(response);
        if (response) {
            
        }
    }

    request.open('POST', 'https://api.thecatapi.com/v1/votes');

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader("x-api-key", apiKey);

    request.send(JSON.stringify(vote));
}

//Handle favorite
function handleFavorite(){

    let imageId = this.getAttribute("imageId");

    let favorite = {
        "image_id": imageId,
        "sub_id": user
    }

    console.log(favorite);

    let request = new XMLHttpRequest();

    request.onload = () => {
        const response = JSON.parse(request.responseText);
        console.log(response);
    }

    request.open('POST', 'https://api.thecatapi.com/v1/favourites');

    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader("x-api-key", apiKey);

    request.send(JSON.stringify(favorite));
}

//Next cats call
function nextCall(){
    searchRequest("GET", "https://api.thecatapi.com/v1/images/search?limit=" + limit);
}

