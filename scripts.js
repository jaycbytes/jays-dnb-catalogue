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

// global vars for various states
// starting copy of the gamesData
let currentGames = [...gamesData];
let selectedGameId = null;
let selectedGameElement = null;
let currentView = "grid";
let currentIndex = -1;
let currentPage = 1;
let gamesPerPage = 9; 

// defining my new arcade cabinet DOM elements
const gamesContainer = document.getElementById('games-container');

const gridViewBtn = document.getElementById('grid-view-btn');

const listViewBtn = document.getElementById('list-view-btn');

const searchInput = document.getElementById('search-input');

const filterType = document.getElementById('filter-type');

const filterCategory = document.getElementById('filter-category');

const sortBy = document.getElementById('sort-by');

const gameDetails = document.getElementById('game-details');

const prevPageBtn = document.getElementById('prev-page-btn');

const nextPageBtn = document.getElementById('next-page-btn');

const pageIndicator = document.getElementById('page-indicator');

// defining all the dpad control buttons
const upBtn = document.getElementById('up-btn');
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');
const downBtn = document.getElementById('down-btn');
const selectBtn = document.getElementById('select-btn');
const resetBtn = document.getElementById('reset-btn');

// hopefully fixes assets not loading
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.hostname.includes('github.io')) {
    gamesData.forEach(game => {
      if (game.imagePath) {
        game.imagePath = '/jays-dnb-catalog/' + game.imagePath;
      }
    });
  }
});


// initialization to how it should look when it starts.
function init() {
    // filling up filter to not have it empty
    populateFilterOptions();

    updatePagination();
    // calling render function to actually show games on screen to user
    renderGames(getPaginatedGames());

    // start event listerners for controls
    setupEventListeners();
    // used to get flicker effect on my title
    setupNeonEffect();
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
      updatePagination()
      // passing in the sliced paginated games as argument
      renderGames(getPaginatedGames());
  });
  // switch to list view
  listViewBtn.addEventListener('click', () => {
      currentView = 'list';
      gamesContainer.className = 'list-view';
      listViewBtn.classList.add('active');
      gridViewBtn.classList.remove('active');
      updatePagination();
      // again passing in same slice but for list view
      renderGames(getPaginatedGames());
  });
  
  // Search input
  searchInput.addEventListener('input', () => {
      applyFilters();
  });
  
  // Filter and sort changes
  filterType.addEventListener('change', applyFilters);
  filterCategory.addEventListener('change', applyFilters);
  sortBy.addEventListener('change', applyFilters);
  
  // chunk of code where the dpad buttons are set up with appropriate function call w/direction arg
  upBtn.addEventListener('click', () => navigateWithDPad('up'));
  leftBtn.addEventListener('click', () => navigateWithDPad('left'));
  rightBtn.addEventListener('click', () => navigateWithDPad('right'));
  downBtn.addEventListener('click', () => navigateWithDPad('down'));
  selectBtn.addEventListener('click', () => selectCurrentGame());
  resetBtn.addEventListener('click', resetFilters);
  
  // Pagination controls
  prevPageBtn.addEventListener('click', () => {
      if (currentPage > 1) {
          currentPage--;
          updatePagination();
          renderGames(getPaginatedGames());
      }
  });
  
  nextPageBtn.addEventListener('click', () => {
      const totalPages = Math.ceil(currentGames.length / gamesPerPage);
      if (currentPage < totalPages) {
          currentPage++;
          updatePagination();
          renderGames(getPaginatedGames());
      }
  });
  
  // keyboard controls for extra coolness
  document.addEventListener('keydown', (e) => {
      switch(e.key) {
          case 'ArrowUp':
              navigateWithDPad('up');
              break;
          case 'ArrowLeft':
              navigateWithDPad('left');
              break;
          case 'ArrowRight':
              navigateWithDPad('right');
              break;
          case 'ArrowDown':
              navigateWithDPad('down');
              break;
          case 'Enter':
              selectCurrentGame();
              break;
      }
  });
}

// nice versatile function to giver user feedback when element is clicked
function flashElement(element) {
  element.style.transform = 'scale(1.2)';
  setTimeout(() => {
      element.style.transform = 'scale(1)';
  }, 200);
}

// used to create cool "strobe" effect on title
function setupNeonEffect() {
  const title = document.querySelector('.neon-title');
  
  // Set up the random flicker effect
  setInterval(() => {
      if (Math.random() > 0.95) {
          // easy way of getting a strobe effect using random and comparing to .5, like flipping a coin
          title.style.opacity = Math.random() > 0.5 ? 0.8 : 1;
      } else {
          title.style.opacity = 1;
      }
  }, 100);
}


// function meant just for reseting any filters that may have been triggered
function resetFilters() {
  // resetting form controls
  searchInput.value = '';
  filterType.value = '';
  filterCategory.value = '';
  sortBy.value = 'name';
  

  // using spread again to make copy, leading to reset data
  currentGames = [...gamesData];
  currentPage = 1;
  currentIndex = -1;
  selectedGameId = null;
  selectedGameElement = null;

  // updating UI back to og reset state
  updatePagination();
  renderGames(getPaginatedGames());
  gameDetails.innerHTML = '<p class="select-prompt">Select a game to see details!</p>';
  
  // gives user some visual feedback
  flashElement(resetBtn);
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
  // resets us to first page
  currentPage = 1;
  // resets the selection
  currentIndex = -1;

  selectedGameId = null;
  selectedGameElement = null;

  updatePagination();
  renderGames(getPaginatedGames());
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

function updatePagination() {
  const totalPages = Math.ceil(currentGames.length / gamesPerPage);
  
  pageIndicator.textContent = `Page ${currentPage} of ${totalPages || 1}`;
  
  // disables them if not needed
  prevPageBtn.disabled = currentPage <= 1;
  nextPageBtn.disabled = currentPage >= totalPages;
  
  // gives a bit of visual feed back if they're disabled shouldn't be the case too often
  prevPageBtn.style.opacity = currentPage <= 1 ? 0.5 : 1;
  nextPageBtn.style.opacity = currentPage >= totalPages ? 0.5 : 1;
}

// returns a slice with the current games in page
function getPaginatedGames() {
  const startIndex = (currentPage - 1) * gamesPerPage;
  const endIndex = startIndex + gamesPerPage;
  return currentGames.slice(startIndex, endIndex);
}



// what i'll call when it's time to show the actual cards on screen.
function renderGames(games) {
    // Clear container
    gamesContainer.innerHTML = '';
    if (games.length === 0) {
      gamesContainer.innerHTML = '<p class="no-results">No games found. Try adjusting your filters.</p>';
      return;
  }
    // Create game cards
    games.forEach((game, index) => {
      const gameCard = createGameCard(game, index);
      gamesContainer.appendChild(gameCard);
  });
}


// making the DPad flash
function flashDPadButton(direction) {
  const buttonMap = {
      'up': upBtn,
      'down': downBtn,
      'left': leftBtn,
      'right': rightBtn
  };
  
  const button = buttonMap[direction];
  if (button) {
      button.style.backgroundColor = 'var(--neon-blue)';
      button.style.color = 'var(--background-dark)';
      
      setTimeout(() => {
          button.style.backgroundColor = 'var(--background-dark)';
          button.style.color = 'var(--neon-blue)';
      }, 200);
  }
}

// Create a game card element
function createGameCard(game, index) {
  const gameCard = document.createElement('div');
  gameCard.className = 'game-card';
  gameCard.dataset.id = game.id;
  gameCard.dataset.index = index;
  
  // Use the image path if available, otherwise empty for the placeholder
  const imageSrc = game.imagePath ? game.imagePath : '';
  
  if (currentView === 'grid') {
      // Grid view card layout
      const imageElement = imageSrc ? 
            `<img src="${imageSrc}" alt="${game.name}" class="game-image">` : 
            `<div class="game-image-placeholder"></div>`;
      
      // creating the grid html layout
      gameCard.innerHTML = `
          ${imageElement}
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
      // List view card layout
      const imageElement = imageSrc ? 
            `<img src="${imageSrc}" alt="${game.name}" class="game-image">` : 
            `<div class="game-image-placeholder list-view-placeholder"></div>`;
      
      // creating the list html layout
      gameCard.innerHTML = `
          ${imageElement}
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
      selectGame(game.id, index);
  });
  
  return gameCard;
}

// dpad navigation - calculates which direction to go
function navigateWithDPad(direction) {
    if (currentGames.length === 0) return;
    
    const paginatedGames = getPaginatedGames();
    const gameCards = document.querySelectorAll('.game-card');
    if (gameCards.length === 0) return;
    
    // Initialize index if none is selected
    if (currentIndex === -1) {
        currentIndex = 0;
    } else {
        // Calculate the next index based on direction
        const columns = currentView === 'grid' ? 3 : 1; // 3 columns in grid view, 1 in list view
        
        let newIndex = currentIndex;
        switch(direction) {
            case 'up':
                newIndex = Math.max(0, currentIndex - columns);
                break;
            case 'down':
                newIndex = Math.min(gameCards.length - 1, currentIndex + columns);
                break;
            case 'left':
                if (currentIndex % columns > 0) {
                    newIndex = currentIndex - 1;
                }
                break;
            case 'right':
                if (currentIndex % columns < columns - 1 && currentIndex < gameCards.length - 1) {
                    newIndex = currentIndex + 1;
                }
                break;
        }
        currentIndex = newIndex;
    }
    
    // Get the game at the new index
    if (currentIndex >= 0 && currentIndex < paginatedGames.length) {
        const gameId = paginatedGames[currentIndex].id;
        selectGame(gameId, currentIndex);
        
        // Light up the corresponding d-pad button for visual feedback
        flashDPadButton(direction);
        
        // Make sure the selected card is visible
        gameCards[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Select the current game with the select button
function selectCurrentGame() {
  if (selectedGameId !== null) {
      // Flash the select button 
      flashElement(selectBtn);
      
      // flashing coin slot as well for funsys and to alert 
      flashCoinSlot();
      
      // slight transformation to make the selection slightly more prominent
      gameDetails.style.transform = 'scale(1.02)';
      setTimeout(() => {
          gameDetails.style.transform = 'scale(1)';
      }, 300);
  }
}


// function to highlight and display details of selected game
function selectGame(gameId, index) {
  // first let's highlight the selected game card
  if (selectedGameElement) {
      selectedGameElement.classList.remove('selected');
  }
  selectedGameId = gameId;
  currentIndex = index;
  
  const newSelectedElement = document.querySelector(`.game-card[data-id="${gameId}"]`);
    if (newSelectedElement) {
        newSelectedElement.classList.add('selected');
        selectedGameElement = newSelectedElement;
        
        // Coin slot animation
        flashCoinSlot();
    }
  // making sure to the game details otherwise what's the point
  displayGameDetails(gameId);
}

// display coin slot animation
function flashCoinSlot() {
  const coinSlot = document.querySelector('.coin-slot');
  coinSlot.style.backgroundColor = 'var(--neon-yellow)';
  setTimeout(() => {
      coinSlot.style.backgroundColor = 'var(--background-dark)';
  }, 300);
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
  
  // Create image HTML if there's an image
  const imageHTML = game.imagePath ? `
      <img src="${game.imagePath}" alt="${game.name}" class="game-info-image">
  ` : '';
  
  gameDetails.innerHTML = `
        <h2>${game.name}</h2>
        <div class="game-details-container">
            <div class="game-info-text">
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
            </div>
            ${imageHTML ? `<div class="game-image-container">${imageHTML}</div>` : ''}
        </div>
    `;

    // this little bit sort of animates the detail display area
    gameDetails.style.opacity = 0.7;
    setTimeout(() => {
        gameDetails.style.opacity = 1;
    }, 100);
}

// running my init function to get things going the moment event listener is triggered.
document.addEventListener('DOMContentLoaded', init);