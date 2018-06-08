const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar';
const WALMART_SEARCH_URL = 'http://api.walmartlabs.com/v1/search';
const apiKeyTasteDive = '309203-mediasea-3T1SAXA6';
const apiKeyWalmart = 'k4ja8d6q36qp2bpg54b5s7pg';

$(setupEventListeners);

function setupEventListeners() {
    showLandingPageView();
    $('.enter-page').on('click', '.discover', showSearchInput);
    $('.js-tastedive-search-results').on('click', '.buy-links', handlePurchaseLinksBtn);
    $('.js-search-form').submit(handleSearchSubmitInput);
}

function showLandingPageView() {
  $('.enter-page').show();
  $('#info-div').hide();
  $('.search-input-container').hide();
  $('.results-container').hide();
  $('.purchase-links-container').hide();
  $('.start-over-btn-container').hide();
}

function showSearchInput() {
    $('.enter-page').hide();
    $('#info-div').show();
    $('.search-input-container').show();
    $('.results-container').hide();
    $('.purchase-links-container').hide();
    $('.start-over-btn-container').hide();
}

function showSimilarResultsView() {
    $('.enter-page').hide();
    $('#info-div').hide();
    $('.search-input-container').hide();
    $('.results-container').show();
    $('.purchase-links-container').hide();
    $('.start-over-btn-container').hide();
}

function showPurchaseLinks() {
    $('.enter-page').hide();
    $('#info-div').hide();
    $('.search-input-container').hide();
    $('.results-container').hide();
    $('.purchase-links-container').show();
    $('.start-over-btn-container').show();
}

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
          <button type="button" class="buy-links">Purchase this ${result.Type}</button>
      </div>
      <br></br>
    </div>
  `;
}

function displayTasteDiveSearchData(data) {
    // if (data.Similar.results.length === 0) {
    //     $('.js-tastedive-search-results').html(generateEmptyTastediveResults());
    // } else {
    //
    // }
  const results = data.Similar.Results.map((item) => generateTasteDiveResult(item));
  $('.js-tastedive-search-results').html(results);
}

function getDataFromWalmartApi(searchTerm, categoryCode, callback) {
  const settings = {
    url: WALMART_SEARCH_URL,
    data: {
      apiKey: apiKeyWalmart,
      query: searchTerm,
      categoryId: categoryCode
    },
    dataType: 'jsonp',
    type: 'GET',
    success: callback
  };
  $.ajax(settings);
}

function generateWalmartResult(result) {
    let customerRatingTemplate = ``;
    if (result.customerRating) {
        customerRatingTemplate = `
        <img src="${result.customerRatingImage}">
        `;
    } else {
    customerRatingTemplate = `
    <div>no customer ratings</div>
    `;
    }
    debugger;
  return `
    <div class="injected-results-container">
      <div>
        <a class="js-result-name" href="${result.addToCartUrl}" target="_blank"><img src="${result.mediumImage}"</a>
        <div>${result.name}</div>
        `+ customerRatingTemplate +`
      </div>
    </div>
    <br>
  `;
}



function displayWalmartSearchData(data) {
  const results = data.items.map((item) => generateWalmartResult(item));
  $('.js-walmart-search-results').html(results);
  // showPurchaseLinksView();
}

function handlePurchaseLinksBtn() {
    event.preventDefault();
    // debugger;
    showPurchaseLinks();
    const $queryTarget = $(event.target)
      .closest('.injected-results-container')
      .find('.js-result-name');
    const query = $queryTarget.text();
    let category = $('#menu-values').val();
    debugger;
    const CATEGORY_CODE = {
        movies: 4096,
        music: 4104,
        books: 3920
    }
    getDataFromWalmartApi(query, CATEGORY_CODE[category], displayWalmartSearchData);
}

function handleSearchSubmitInput(event) {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    // clear out the input
    queryTarget.val("");
    $('main').prop('hidden', false);
    const category = $('.dropdown-menu').find(':selected').text();
    showSimilarResultsView();
    // debugger;
    getDataFromTasteDiveApi(query, category, displayTasteDiveSearchData);
}
