var beerRepository = (function () {
  // added all my global variables at the top to more easily see them.
  var repository = [];

  //added a new api for beer as per the below;
  var apiUrl = 'https://api.punkapi.com/v2/beers?page=2&per_page=80';
  var loadingMessage = document.querySelector('#loading-message');
  var modalContainer = document.querySelector('#modal-container');

  function add(beer) {
    if (typeof beer === 'object') {
      repository.push(beer);
    }
  }

  // allows beerList to be called as a whole
  function getAll() {
    return repository;
  }

  // this will display the name of each beer in a <li> format on the DOM
  function addListItem(beer) {
    var beerList = document.querySelector('.beer-list');
    var listItem = document.createElement('li');
    var button = document.createElement('button');
    button.innerText = beer.name + ' - abv ' + beer.abv;
    button.classList.add('beer-button');
    listItem.appendChild(button);
    beerList.appendChild(listItem);
    // here the code for the event listener to pull specific beer object
    button.addEventListener('click', function (event) {
      showDetails(beer);
    });
  }

  // functions to control the display of the loading message.
  function showLoadingMessage () {
    loadingMessage.classList.remove('is-hidden');
  }
  function hideLoadingMessage () {
    loadingMessage.classList.add('is-hidden');
  }

  // I removed the loadDetails list as there is only one api url instead of the two for pokemon.
  function loadList() {
    showLoadingMessage();
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(responseJSON){
      return responseJSON;
    }).then(function(json) {
      hideLoadingMessage();
      json.forEach(function(item) {
        var beer = {
          name: item.name,
          image: item.image_url,
          tag: item.tagline,
          abv: item.abv,
          description: item.description,
          foodPairing: item.food_pairing,
          brewersTips: item.brewers_tips,
          contribution: item.contributed_by
        };
        add(beer);
      });
    }).catch(function (e) {
      console.error(e);
    });
  }

  // this is pulling the specific details in a modal
  function showModal(item) {
    modalContainer.innerHTML = '';

    // creating the initial modal structure ready for the DOM
    var modal = document.createElement('div');
    modal.classList.add('modal');

    // this is creating the close button in modal
    var closeButtonElement = document.createElement('button');
    closeButtonElement.classList.add('modal-close');
    closeButtonElement.innerText = 'Close';
    closeButtonElement.addEventListener('click', hideModal);

    var titleElement = document.createElement('h1');
    titleElement.innerText = item.name + ' - abv ' + item.abv;
    var imageElement = document.createElement('img');
    imageElement.src = item.image;
    var tagElement = document.createElement('h3');
    tagElement.innerHTML = item.tag;
    var contentElement = document.createElement('div');
    contentElement.classList.add('beer-details');
    contentElement.innerHTML = '<p id="description">'  + item.description + '</p>' +
                               '<p id="food-pairing" class="beer-details">Best Served With:</p>' + item.foodPairing +
                               '<p id="brewers-tips" class="beer-details">Serving Suggestion:</p>' + item.brewersTips;
    var contributionElement = document.createElement('div');
    contributionElement.innerHTML = '<p id="contribution" class="beer-details">Contributed by: ' + item.contribution + '</p>';


    // adding all the modal elements to the DOM
    modal.appendChild(closeButtonElement);
    modal.appendChild(titleElement);
    modal.appendChild(imageElement);
    modal.appendChild(tagElement);
    modal.appendChild(contentElement);
    modal.appendChild(contributionElement);
    modalContainer.appendChild(modal);

    modalContainer.classList.add('is-visible');
  }

  function hideModal() {
    modalContainer.classList.remove('is-visible');
  }

  // adding ability to use escape key to close the modal
  window.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modalContainer.classList.contains('is-visible')){
      hideModal();
    }
  });

  // adding the ability to click on the modal container to close
  modalContainer.addEventListener('click', (e) => {
    var target = e.target;
    if(target === modalContainer) {
      hideModal();
    }
  });

  function showDetails(item) {
    beerRepository.loadList().then(function () {
      showModal(item);
      console.log(item);
  });
}

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showDetails: showDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();

// functions are being called to actually display the data.
beerRepository.loadList().then(function() {
  beerRepository.getAll().forEach(function(beer){
    beerRepository.addListItem(beer);
  });
});
