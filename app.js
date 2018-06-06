// function generateSearchPageHTML() {
//     return `
//
    // <div class="search-form-container">
    //     <form action="#" class="search-form js-search-form">
    //         <label for="query">Input the name of any book, band or movie to find similar results!</label>
    //         <input type="text" id="query" class="js-query">
    //         <button type="submit" class="search-button">Discover</button>
    //     </form>
    // </div>
    //     <main role="main" aria-live="assertive" >
    //         <div class="results-container">
    //             <h2>Results</h2>
    //             <div class="js-search-results"></div>
    //         </div>
    //     </main>
//         `
// }
//
// function renderView(viewHtml) {
//     $('body').html(viewHtml);
// }
//
// function renderSearchPageHTML() {
//     renderView(generateSearchPageHTML);
// }
//
// function generateResultsPageHTML() {
//     return `
//         <div class="results-container">
//             <h2>Results</h2>
//             <div class="js-search-results"></div>
//         </div>
//     `
// }
//
// function renderResultsPageHTML() {
//     renderView(generateResultsPageHTML);
// }

const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar';
const WALMART_SEARCH_URL = 'http://api.walmartlabs.com/v1/search';
const apiKeyTasteDive = '309203-mediasea-3T1SAXA6';
const apiKeyWalmart = 'k4ja8d6q36qp2bpg54b5s7pg';

// function handleLandingPageButton() {
//     $('.form-container').on('click', '.enter-page-button', renderSearchPageHTML);
// }

function getDataFromTasteDiveApi(searchTerm, callback) {
    const settings = {
        url: TASTEDIVE_SEARCH_URL,
        data: {
            k: apiKeyTasteDive,
            q: searchTerm,
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
        <form action="#" class="js-buy-link">
          <button type="submit" class="buy-links">Purchase this ${result.Type}</button>
        </form>
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
        dataType: 'json',
        type: 'GET',
        success: callback
    };
    $.ajax(settings);
}

function generateWalmartResult(result) {
    return `
    <div class="injected-results-container">
      <div>
        <a class="js-result-name" href="${result.items.addToCartUrl}" target="_blank">${result.items.imageEntities.mediumImage}</a>
        <div>${result.Type}</div>
      </div>
      <br></br>
    </div>
  `;
}

function displayWalmartSearchData(data) {
    // this function should display the buy links for the selected taste dive result.
    const results = data.items.map((item) => generateWalmartResult(item));
    $('.js-walmart-search-results').html(results);
}

function handlePurchaseLinksBtn() {
    $('.js-buy-link').submit(function(event) {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-result-name');
        const query = (queryTarget).val();
        getDataFromWalmartApi(query, displayWalmartSearchData);
    });
}

function handleSearchSubmitInput() {
    $('.js-search-form').submit(function(event) {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        $('main').prop('hidden', false);
        getDataFromTasteDiveApi(query, displayTasteDiveSearchData);

    });
}

function handleSelectedResult () {
  $(handleSearchSubmitInput);
  $(handlePurchaseLinksBtn);
}

$(handleSelectedResult);
