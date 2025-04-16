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

// defining my new arcade cabinet DOM elements
const gamesContainer = document.getElementById('games-container');

const gridViewBtn = document.getElementById('grid-view-btn');

const listViewBtn = document.getElementById('list-view-btn');

const searchInput = document.getElementById('search-input');

const filterType = document.getElementById('filter-type');

const filterCategory = document.getElementById('filter-category');

const sortBy = document.getElementById('sort-by');

const gameDetails = document.getElementById('game-details');


// initialization to how it should look when it starts.
function init() {
    // filling up filter to not have it empty
    populateFilterOptions();
    
    // calling render function to actually show games on screen to user
    renderGames(gamesData);

    // start event listerners for controls
    setupEventListeners();
}

// filling filter drop down options
function populateFilterOptions() {
    // using map to make new array that consists of only my game types and removing duplicates
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

// Set up all event listeners
function setupEventListeners() {
  // switch to grid
  gridViewBtn.addEventListener('click', () => {
      currentView = 'grid';
      gamesContainer.className = 'grid-view';
      gridViewBtn.classList.add('active');
      listViewBtn.classList.remove('active');
      renderGames(currentGames);
  });
  // switch to list view
  listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      gamesContainer.className = 'list-view';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      renderGames(currentGames);
  });
  
  // Search input
  searchInput.addEventListener('input', () => {
      applyFilters();
  });
  
  // Filter and sort changes
  filterType.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  sortBy.addEventListener('change', applyFilters);
}


// using filter, search term sort by choice and category to apply proper filter calling on sortGames as well.
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const typeFilter = filterType.value;
  const categoryFilter = filterCategory.value;
  const sortOption = sortBy.value;
  
  // use drop down selection to sort
  let filteredGames = gamesData.filter(game => {
      const matchesSearch = game.name.toLowerCase().includes(searchTerm) || 
                          game.description.toLowerCase().includes(searchTerm);
      const matchesType = typeFilter === '' || game.type === typeFilter;
      const matchesCategory = categoryFilter === '' || game.category === categoryFilter;
      
      return matchesSearch && matchesType && matchesCategory;
  });
  
  // sort the filtered games
  filteredGames = sortGames(filteredGames, sortOption);
  
  // Update current games and render
  currentGames = filteredGames;
  selectedGameId = null;
  
  renderGames(currentGames);
}




// Sort games based on the selected option
function sortGames(games, sortOption) {
  /* learned that using spread ... creates copy vector looks cleaner but idk if i'll keep using because it also feels magical
  switch statement inside sort for efficient sorting with the options i've implemented so far. maybe more later if i have time.
  */
  return [...games].sort((a, b) => {
      switch(sortOption) {
          case 'name':
              return a.name.localeCompare(b.name);
          case 'cost':
              return a.cost - b.cost;
          case 'value':
              return b.value - a.value;
          case 'payout':
              return b.jaysPayout - a.jaysPayout;
          default:
              return 0;
      }
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

// Create a game card element
function createGameCard(game) {
  const gameCard = document.createElement('div');
  gameCard.className = 'game-card';
  gameCard.dataset.id = game.id;
  
  // Use a placeholder image until i have them id'd
  const imagePlaceholder = ``;
  
  if (currentView === 'grid') {
      // creating the grid html layout
      gameCard.innerHTML = `
          <img src="${imagePlaceholder}" alt="${game.name}" class="game-image">
          <div class="game-header">
              <h2 class="game-name">${game.name}</h2>
          </div>
          <div class="game-body">
              <div class="game-tags">
                  <span class="game-type">${game.type}</span>
                  <span class="game-category">${game.category}</span>
              </div>
              <p class="game-cost">${game.cost} credits</p>
              <p class="game-value">Value: <span class="value-stars">${'★'.repeat(game.value)}${'☆'.repeat(5-game.value)}</span></p>
              <p class="game-payout">Jay's Payout: ${game.jaysPayout} tickets/play</p>
          </div>
      `;
  } else {
      // creating the list html layout
      gameCard.innerHTML = `
          <img src="${imagePlaceholder}" alt="${game.name}" class="game-image">
          <div class="game-body">
              <h2 class="game-name">${game.name}</h2>
              <div class="game-tags">
                  <span class="game-type">${game.type}</span>
                  <span class="game-category">${game.category}</span>
              </div>
              <p class="game-description">${game.description.slice(0, 60)}${game.description.length > 60 ? '...' : ''}</p>
          </div>
          <div class="game-stats">
              <p class="game-cost">${game.cost} credits</p>
              <p class="game-value">Value: <span class="value-stars">${'★'.repeat(game.value)}</span></p>
              <p class="game-payout">Jay's Payout: ${game.jaysPayout}</p>
          </div>
      `;
  }
  
  // game is selected by clicking so needs event listener
  gameCard.addEventListener('click', () => {
      selectGame(game.id);
  });
  
  return gameCard;
}



// function to highlight and display details of sected game
function selectGame(gameId) {
  // here i'm highlighting the selected game
  const allCards = document.querySelectorAll('.game-card');
  allCards.forEach(card => {
      if (parseInt(card.dataset.id) === gameId) {
          card.classList.add('selected');
      } else {
          card.classList.remove('selected');
      }
  });
  
  selectedGameId = gameId;
  
  // making sure to the game details otherwise what's the point
  displayGameDetails(gameId);
}


// function using unique gameID
function displayGameDetails(gameId) {
  // finding correct game first before html, using arrow function to check if game is in array.
  const game = gamesData.find(g => g.id === gameId);
  
  // what to do if no gmae was found
  if (!game) {
      gameDetails.innerHTML = '<p class="select-prompt">Select a game to see details!</p>';
      return;
  }
  
  // creating features list HTML
  const featuresHTML = game.features ? `
      <div class="game-info-section">
          <h3>Features</h3>
          <ul class="features-list">
              ${game.features.map(feature => `<li>${feature}</li>`).join('')}
          </ul>
      </div>
  ` : '';
  
  gameDetails.innerHTML = `
      <h2>${game.name}</h2>
      <div class="game-info-section">
          <h3>Game Details</h3>
          <p><strong>Type:</strong> ${game.type}</p>
          <p><strong>Category:</strong> ${game.category}</p>
          <p><strong>Cost:</strong> ${game.cost} credits</p>
          <p><strong>Value Rating:</strong> <span class="value-stars">${'★'.repeat(game.value)}${'☆'.repeat(5-game.value)}</span></p>
          ${game.jackpot ? `<p><strong>Jackpot:</strong> ${game.jackpot}</p>` : ''}
          <p>${game.description}</p>
      </div>
      ${featuresHTML}
      <div class="game-info-section">
          <h3>Jay's Experience</h3>
          <p><strong>Payout:</strong> ${game.jaysPayout} tickets per play</p>
          <p><strong>Tips:</strong> ${game.jaysTips}</p>
      </div>
  `;
}

// running my init function to get things going the moment event listener is triggered.
document.addEventListener('DOMContentLoaded', init);