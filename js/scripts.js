var beerRepository = (function () {
  // added all my global variables at the top to more easily see them.
  var repository = [];
  var apiUrl = "https://api.punkapi.com/v2/beers?page=2&per_page=80";
  var modalContainer = $("#exampleModal");

  function add(beer) {
    if (typeof beer === "object") {
      repository.push(beer);
    }
  }

  // allows beerList to be called as a whole
  function getAll() {
    return repository;
  }

  // this will display the name of each beer in a <li> format on the DOM
  function addListItem(beer) {
    var beerList = $(".beer-list");
    var button = $(
      '<li><button type="button" class="btn btn-info col-md-8" data-toggle="modal" data-target="#exampleModal">' +
        beer.name +
        " - abv " +
        beer.abv +
        "</button></li>"
    );
    $(beerList).append(button);
    $(button).on("click", function (event) {
      showDetails(beer);
    });
  }

  // I removed the loadDetails list as there is only one api url instead of the two for pokemon.
  function loadList() {
    return $.ajax(apiUrl, { dataType: "json" })
      .then(function (responseJSON) {
        return responseJSON;
      })
      .then(function (json) {
        json.forEach(function (item) {
          var beer = {
            name: item.name,
            image: item.image_url,
            tag: item.tagline,
            abv: item.abv,
            description: item.description,
            foodPairing: item.food_pairing,
            brewersTips: item.brewers_tips,
            contribution: item.contributed_by,
          };
          add(beer);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function showDetails(item) {
    beerRepository.loadList().then(function () {
      showModal(item);
    });
  }

  // this is pulling the specific details in a modal
  function showModal(item) {
    var modalTitle = $(".modal-title");
    var modalBody = $(".modal-body");
    $(modalTitle).empty();
    $(modalBody).empty();

    var titleElement = $("<h1>" + item.name + " - abv " + item.abv + "</h1>");
    var imageElement = $(
      "<img src=" + item.image + ' alt="display image of beer"></img>'
    );
    var tagElement = $("<h3>" + item.tag + "</h3>");
    var contentElement = $(
      '<div class = "beer-details"><p class ="description">About:</p>' +
        item.description +
        '<br><br><p class ="description">Best Served With:</p>' +
        item.foodPairing +
        '<br><br><p class ="description">Brewers Tips:</p>' +
        item.brewersTips +
        "</div>"
    );
    var contributionElement = $(
      '<div><p id="contribution" class="beer-details">Contributed by: ' +
        item.contribution +
        "</p></div>"
    );

    // adding all the modal elements to the DOM
    $(modalTitle).append($(titleElement));
    $(modalTitle).append($(tagElement));
    $(modalBody).append($(imageElement));
    $(modalBody).append($(contentElement));
    $(modalBody).append($(contributionElement));
  }

  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    loadList: loadList,
    showDetails: showDetails,
    showModal: showModal,
  };
})();

// functions are being called to actually display the data.
beerRepository.loadList().then(function () {
  beerRepository.getAll().forEach(function (beer) {
    beerRepository.addListItem(beer);
  });
});
