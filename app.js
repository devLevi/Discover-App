const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar';
const WALMART_SEARCH_URL = 'http://api.walmartlabs.com/v1/search';
const apiKeyTasteDive = '309203-mediasea-3T1SAXA6';
const apiKeyWalmart = 'k4ja8d6q36qp2bpg54b5s7pg';

function displaySearchInput() {
  $('.enter-page').on('click', '.discover', function() {
  $('.enter-page').hide();
  $('#info-div').show();
  $('.search-input-container').show();
  $('.results-container').hide();
  $('.js-walmart-search-results').hide();
  $('.start-over-btn-container').hide();
})}

displaySearchInput();

function displayLandingPage() {
  $(document).ready(function() {
  $('.enter-page').show();
  $('#info-div').hide();
  $('.search-input-container').hide();
  $('.results-container').hide();
  $('.js-walmart-search-results').hide();
  $('.start-over-btn-container').hide();
})}

displayLandingPage();

function getDataFromTasteDiveApi(searchTerm, categoryTerm, callback) {
    const settings = {
        url: TASTEDIVE_SEARCH_URL,
        data: {
            k: apiKeyTasteDive,
            q: searchTerm,
            type: categoryTerm
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

function generateTasteDiveResult(result) {
    return `
    <div class="injected-results-container">
      <div>
        <div class="js-result-name">${result.Name}</div>
        <div>${result.Type}</div>
        <button type="submit" class="buy-links">Purchase this ${result.Type}</button>
      </div>
      <br></br>
    </div>
  `;
}



function displayTasteDiveSearchData(data) {
    const results = data.Similar.Results.map((item) => generateTasteDiveResult(item));
    $('.js-tastedive-search-results').html(results);
}

function getDataFromWalmartApi(searchTerm, callback) {
    const settings = {
        url: WALMART_SEARCH_URL,
        data: {
            apiKey: apiKeyWalmart,
            query: searchTerm
        },
        dataType: 'jsonp',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

function generateWalmartResult(result) {
    return `
    <div class="injected-results-container">
      <div>
        <a class="js-result-name" href="${result.addToCartUrl}" target="_blank"><img src="${result.mediumImage}"</a>
        <div>${result.name}</div>
        <br>
        <div>Customer Rating: "${result.customerRating}" </div>
        <img src="${result.customerRatingImage}">
      </div>
    </div>
  `;
}

function displayWalmartSearchData(data) {
    // this function should display the buy links for the selected taste dive result.
    debugger;
    const results = data.items.map((item) => generateWalmartResult(item));
    $('.js-walmart-search-results').html(results);
}

function handlePurchaseLinksBtn() {
    $('.js-tastedive-search-results').on('click', '.buy-links', function () {
        event.preventDefault();
        // debugger;
        const $queryTarget = $(event.target)
          .closest('.injected-results-container')
          .find('.js-result-name'); // use .closest before
        const query = $queryTarget.text(); // use .text()
        getDataFromWalmartApi(query, displayWalmartSearchData);
    });
    /* $('.buy-links').click(function(event) { // change to .click()
        alert('Event handler working!')
        event.preventDefault();
        const $queryTarget = $(event.currentTarget)
          .closest('.injected-results-container')
          .find('.js-result-name'); // use .closest before
        const query = $queryTarget.text(); // use .text()
        alert(query);
        getDataFromWalmartApi(query, displayWalmartSearchData);
    }); */
}

function handleSearchSubmitInput() {
    $('.js-search-form').submit(function(event) {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        $('main').prop('hidden', false);
        // get value from category Dropdown
        // const category = $('...').text();
        getDataFromTasteDiveApi(query, displayTasteDiveSearchData);

    });
}

function handleSelectedResult () {
  $(handleSearchSubmitInput);
  // handleSearchSubmitInput();
  $(handlePurchaseLinksBtn);
}

$(handleSelectedResult);
