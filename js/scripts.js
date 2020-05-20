var beerRepository = (function () {
  // added all my global variables at the top to more easily see them.
  var repository = [];

  //added a new api for beer as per the below;
  var apiUrl = 'https://api.punkapi.com/v2/beers?page=2&per_page=80';
  var loadingMessage = $('#loading-message');
  var modalContainer = $('#modal-container');

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
    var beerList = $('.beer-list');
    var listItem = $('li');
    var button = $('<button class = "beer-button">' + beer.name + ' - abv ' + beer.abv + '</button>');
    $(beerList).append(listItem).append(button)
    // here the code for the event listener to pull specific beer object
    $(button).on('click', function (event) {
      showDetails(beer);
    });
  }

  // functions to control the display of the loading message.
  function showLoadingMessage () {
    $(loadingMessage).removeClass('is-hidden');
  }
  function hideLoadingMessage () {
    $(loadingMessage).addClass('is-hidden');
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
    $('#modal-container').html = '';
    // creating the initial modal structure ready for the DOM
    var modal = $('<div class="modal"></div>');

    // this is creating the close button in modal
    var closeButtonElement = $('<button class="modal-close">Close</button>');
    $(closeButtonElement).on('click', hideModal);

    var titleElement = $('<h1>' + item.name + ' - abv ' + item.abv + '</h1>');
    var imageElement = $('<img src=' + item.image + ' alt="display image of beer"></img>');
    var tagElement = $('<h3>' + item.tag + '</h3>');
    var contentElement = $('<div class = "beer-details"><p id="description">About:</p>'  + item.description + '<p id="food-pairing">Best Served With:</p>' + item.foodPairing + '<p id="brewers-tips">Brewers Tips:</p>' + item.brewersTips + '</div>');
    var contributionElement = $('<div><p id="contribution" class="beer-details">Contributed by: ' + item.contribution + '</p></div>');

    // adding all the modal elements to the DOM
    $(modal).append($(closeButtonElement));
    $(modal).append($(titleElement));
    $(modal).append($(imageElement));
    $(modal).append($(tagElement));
    $(modal).append($(contentElement));
    $(modal).append($(contributionElement));
    $(modalContainer).append($(modal));

    $(modalContainer).addClass('is-visible');
  }

  function hideModal() {
    $(modalContainer).removeClass('is-visible');
  }

  // adding ability to use escape key to close the modal
  $(document).on('keydown', (e) => {
    if(e.key === 'Escape' && $(modalContainer).hasClass('is-visible')){
      hideModal();
    }
  });

  // adding the ability to click on the modal container to close
  $(modalContainer).on('click', (e) => {
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
