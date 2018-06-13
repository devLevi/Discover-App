const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar';
const WALMART_SEARCH_URL = 'https://api.walmartlabs.com/v1/search';
const apiKeyTasteDive = '309203-mediasea-3T1SAXA6';
const apiKeyWalmart = 'k4ja8d6q36qp2bpg54b5s7pg';

$(setupEventListeners);

function setupEventListeners() {
  showLandingPageView();
  $('.splash-screen-view').on('click', '.discover', showSearchInput);
  $('.js-tastedive-search-results').on('click', '.buy-links-btn', handlePurchaseLinksBtn);
  $('.js-search-form').submit(handleSearchSubmitInput);
  $('.start-over-btn-container').on('click', '.start-over-btn', showSearchInput);
  $('.back-to-similar-results-container').on('click', '.similar-results-btn', showSimilarResultsView);
}


function showLandingPageView() {
  $('.splash-screen-view').show();
  $('.main-view').hide();
  $('.js-similar-results-view').hide();
  $('.js-purchase-results-view').hide();
  $('.start-over-btn-container').hide();
  $('.back-to-similar-results-container').hide();
}

function showSearchInput() {
  $('.splash-screen-view').hide();
  $('.main-view').show();
  $('.js-similar-results-view').hide();
  $('.js-purchase-results-view').hide();
  $('.start-over-btn-container').hide();
  $('.back-to-similar-results-container').hide();
}

function showSimilarResultsView() {
  $('.splash-screen-view').hide();
  $('.main-view').hide();
  $('.js-similar-results-view').show();
  $('.js-purchase-results-view').hide();
  $('.start-over-btn-container').show();
  $('.back-to-similar-results-container').hide();
}

function showPurchaseLinks() {
  $('.splash-screen-view').hide();
  $('.main-view').hide();
  $('.js-similar-results-view').hide();
  $('.js-purchase-results-view').show();
  $('.start-over-btn-container').show();
  $('.back-to-similar-results-container').show();
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
    <div class="injected-js-similar-results">
        <div class="js-result-name">${result.Name}</div>
          <button type="button" class="buy-links-btn">Purchase this ${result.Type}</button>
      <br></br>
    </div>
  `;
}

function generateEmptyTasteDiveResults() {
  return `
    <div class="no-results-view">Oops! Nothing was found.. Please try again!</div>
  `
}

function displayTasteDiveSearchData(data) {
  if (data.Similar.Results.length === 0) {
    $('.js-tastedive-search-results').html(generateEmptyTasteDiveResults());
  } else {
    const results = data.Similar.Results.map((item) => generateTasteDiveResult(item));
    $('.js-tastedive-search-results').html(results);
  }
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
    customerRatingTemplate = `<img src="${result.customerRatingImage}" alt="customer rating">`;
  } else {
    customerRatingTemplate = `not reviewed`;
  }
  return `
    <div class="injected-js-purchase-results">
      <div>
        <a class="js-result-name" href="${result.productUrl}" target="_blank">
            <img src="${result.mediumImage}" alt="${result.name} image"
        </a>
        <div>${result.name}</div>
        ${customerRatingTemplate}
      </div>
    </div>
  `;
}

function displayWalmartSearchData(data) {
  const results = data.items.map((item) => generateWalmartResult(item));
  $('.js-walmart-search-results').html(results);
}

function handlePurchaseLinksBtn() {
  event.preventDefault();
  showPurchaseLinks();
  const $queryTarget = $(event.target)
    .closest('.injected-js-similar-results')
    .find('.js-result-name');
  const query = $queryTarget.text();
  let category = $('#menu-values').val();
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
  queryTarget.val("");
  $('main').prop('hidden', false);
  const category = $('.dropdown-menu').find(':selected').text();
  showSimilarResultsView();
  getDataFromTasteDiveApi(query, category, displayTasteDiveSearchData);
}
