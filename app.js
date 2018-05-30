function generateSearchPageHTML() {
    return `

    <div class="search-form-container">
        <form action="#" class="search-form js-search-form">
            <label for="query">Input the name of any book, band or movie to find similar results!</label>
            <input type="text" id="query" class="js-query">
            <button type="submit" class="search-button">Discover</button>
        </form>
    </div>
        <main role="main" aria-live="assertive" >
            <div class="results-container">
                <h2>Results</h2>
                <div class="js-search-results"></div>
            </div>
        </main>
        `
}

function renderView(viewHtml) {
    $('body').html(viewHtml);
}

function renderSearchPageHTML() {
    renderView(generateSearchPageHTML);
}

function generateResultsPageHTML() {
    return `
        <div class="results-container">
            <h2>Results</h2>
            <div class="js-search-results"></div>
        </div>
    `
}

function renderResultsPageHTML() {
    renderView(generateResultsPageHTML);
}

const TASTEDIVE_SEARCH_URL = 'https://tastedive.com/api/similar';
const apiKey = '309203-mediasea-3T1SAXA6';

function getDataFromApi(searchTerm, callback) {
    const settings = {
        url: TASTEDIVE_SEARCH_URL,
        data: {
            k: apiKey,
            q: searchTerm,
        },
        dataType: 'json',
        type: 'GET',
        success: callback
    };

    $.ajax(settings);
}

function renderResult(result) {
    return `
    <div class="injected-results-container">
      <div>
        <a class="js-result-name" href="https://tastedive.com/like/${result.Name}" target="_blank">${result.Name}</a>
        <div>${result.Type}</div>
      </div>
      <br></br>
    </div>
  `;
}

function displayTasteDiveSearchData(data) {
    const results = data.Similar.Results.map((item) => renderResult(item));
    $('.js-search-results').html(results);
}

function searchSubmit() {
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        $('main').prop('hidden', false);
        getDataFromApi(query, displayTasteDiveSearchData);
}

function registerEventHandlers() {
    $('.form-container').on('click', '.enter-page-button', renderSearchPageHTML);
    $('.search-form-container').on('sumit', '.search-button', searchSubmit);
}

$(registerEventHandlers);
