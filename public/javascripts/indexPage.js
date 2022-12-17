const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
        entry.target.classList.add('fadeIn')
        }
    })
})

function createCard (campground){
    const newCard = document.createElement('div');
    newCard.classList.add('card','mb-3');
    try{
    const cardImage = campground.images.length 
        ? campground.images[0].url 
        : "https://res.cloudinary.com/dwmkahbpb/image/upload/w_1000,ar_1:1,c_fill/v1671242036/YelpCamp/No-Image-Placeholder_oofa0i.png"
    newCard.innerHTML = `
        <div class="row">
            <div class="col-md-4">
            <a href="/campgrounds/${campground._id}">
                <img src=${cardImage} alt="" class="" style="width: 100%; height: 100%; object-fit: cover;">
            </a>
            </div>
            <div class="col-md-8">
                <div class="card-body">
                    <h5 class="card-title">${campground.title}</h5>
                    <p class="starability-result" data-rating="${campground.avgRating}">
                        Rated: ${campground.avgRating} stars
                    </p>
                    <p class="card-text vh-10">${campground.description}</p>
                    <div class="optionTags mb-3">
                        <img class="bathroomIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670890509/YelpCamp/Icons/bathroom_ogz5tg.png">

                        <img class="electricityIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670890509/YelpCamp/Icons/electricity_mrhro5.png">

                        <img class="waterIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670890509/YelpCamp/Icons/water_llfaqn.png">

                        <img class="shopIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670890509/YelpCamp/Icons/shop_lfrvlo.png">

                        <img class="rvIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670893696/YelpCamp/Icons/camper_epoma8.png">

                        <img class="petIcon mx-1" src="https://res.cloudinary.com/dwmkahbpb/image/upload/c_thumb,w_30,g_face/v1670890509/YelpCamp/Icons/pets_qboiij.png">
                    </div>
                    <p class="card-text">
                        <small class="text-muted">${ campground.location }</small>
                    </p>
                    <a href="/campgrounds/${campground._id}" class="btn btn-primary">View ${ campground.title } </a>
                </div>
            </div>
        </div>`
    if(!campground.options.bathrooms){
        const icon = newCard.querySelector('.bathroomIcon');
        icon.remove();
    }
    if(!campground.options.electricity){
        const icon = newCard.querySelector('.electricityIcon');
        icon.remove();
    }
    if(!campground.options.water){
        const icon = newCard.querySelector('.waterIcon');
        icon.remove();
    }
    if(!campground.options.shop){
        const icon = newCard.querySelector('.shopIcon');
        icon.remove();
    }
    if(!campground.options.rvHookup){
        const icon = newCard.querySelector('.rvIcon');
        icon.remove();
    }
    if(!campground.options.petFriendly){
        const icon = newCard.querySelector('.petIcon');
        icon.remove();
    }
    } catch(err) {
        newCard.innerHTML = 'No More Data'
        console.log(err);
    }
    observer.observe(newCard);
    document.querySelector('#campgroundList').appendChild(newCard);
}

const loadMore = document.querySelector('#loadMore');

const createCards = (qty, page) => {
    const start = (page - 1) * qty
    let end = start + qty
    if (end > campgrounds.features.length){
        end = campgrounds.features.length;
        loadMore.remove();
    }
    const pagedCampgrounds = campgrounds.features.slice(start,end);
    pagedCampgrounds.forEach(createCard);
}

createCards(10, 1);

const setEventListeners = () => {
    let currPage = 1;

    loadMore.addEventListener('click', function(){
        currPage += 1;
        createCards(10, currPage);
    })

    const resetFilters = document.querySelector('#resetFilters');

    resetFilters.addEventListener('click', function() {
        filters = document.querySelectorAll('.filter');
        filters.forEach( filter => {
            filter.checked = false;
        })
    })
}

setEventListeners();