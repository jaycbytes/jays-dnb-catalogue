/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */



// creating my DOM objects to use later 
const gamesContainer = document.getElementById('games-container');

const searchInput = document.getElementById('search-input');

const filterType = document.getElementById('filter-type');
const filterCategory = document.getElementById('filter-category');

const sortBy = document.getElementById('sort-by');


// initialization to how it should look when it starts.
function init() {
    // filling up filter to not have it empty
    populateFilterOptions();
    
    // calling render function to actually show games on screen to user
    renderGames(gamesData);
}

// filling filter drop down options
function populateFilterOptions() {
    // using map to make new array that consists of only my game types
    const types = [...new Set(gamesData.map(game => game.type))];

    types.forEach(type => {
        const option = document.createElement('option');
        option.value = type;
        // filling option with type from mapped over arry.
        option.textContent = type;
        filterType.appendChild(option);
    });
    
    // same map idea but now extracting category key and making new array with it.
    const categories = [...new Set(gamesData.map(game => game.category))];
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterCategory.appendChild(option);
    });
}

// what i'll call when it's time to show the actual cards on screen.
function renderGames(games) {
    // Clear container
    gamesContainer.innerHTML = '';
    
    // Create game cards
    games.forEach(game => {
        const gameCard = document.createElement('div');
        gameCard.className = 'game-card';
        
        
        const imageOfGame = ``;
        
        gameCard.innerHTML = `
            <img src="${imageofGame}" alt="${game.name}" class="game-image">
            <h2 class="game-name">${game.name}</h2>
        `;
        
        gamesContainer.appendChild(gameCard);
    });
}

// running my init function to get things going the moment event listener is triggered.
document.addEventListener('DOMContentLoaded', init);