// blockRank.js
/***
 * Here are some suggestions to improve the list-making game:
 * 1. Validation and Error Handling:
 * Check if the user enters a valid block name and rank.
 * Prevent users from entering duplicate block names.
 * Display error messages or tooltips for invalid inputs.
 * 2. Additional Features:
 * Block Information: Display information about each block, such as its description, crafting recipe, or image.
 * Block Categories: Allow users to categorize blocks (e.g., building, decorative, redstone).
 * Search Functionality: Implement a search bar to find specific blocks.
 * Sorting Options: Provide additional sorting options (e.g., alphabetical, category).
 * 3. User Experience Enhancements:
 * Responsive Design: Ensure the game is playable on various devices and screen sizes.
 * Animations and Transitions: Add smooth animations for row removal and addition.
 * Tooltips and Help: Provide tooltips or a help section to explain game mechanics.
 * 4. Data Persistence and Sharing:
 * Cloud Storage: Use a cloud storage solution (e.g., Firebase) to store user data.
 * Sharing: Allow users to share their lists via social media or link.
 * 5. Gamification:
 * Challenges: Create challenges or achievements (e.g., "Rank 10 blocks in under 1 minute").
 * Leaderboards: Display leaderboards for users with the most blocks ranked.
 * Rewards: Offer rewards or badges for completing challenges.
 * 6. Minecraft Integration:
 * Minecraft API: Utilize the official Minecraft API to fetch block data.
 * In-Game Import: Allow users to import their Minecraft world's block list.
 * 7. Multiplayer:
 * Collaborative Lists: Enable multiple users to collaborate on a single list.
 * Real-time Updates: Update the list in real-time for all collaborators.
 * 8. Themes and Customization:
 * Themes: Offer various visual themes (e.g., dark mode, Minecraft-themed).
 * Customization: Allow users to customize the game's appearance.
 * Would you like me to prioritize any of these suggestions or provide more ideas?
 **/
// Get the table body and add row button
const tbody = document.getElementById('block-list').getElementsByTagName('tbody')[0];
const addRowButton = document.getElementById('add-row');

// Initialize local storage
const storage = window.localStorage;
const blockListKey = 'minecraft-block-list';

// Load existing list from local storage
loadBlockList();

// Add event listener to add row button
addRowButton.addEventListener('click', addRow);

// Function to add new row
function addRow() {
  const rows = tbody.getElementsByTagName('tr');
  if (rows.length < 10) {
    const row = document.createElement('tr');
    row.innerHTML = `
            <td><input type="text" class="block-name"></td>
            <td><input type="number" min="1" max="10" class="block-rank"></td>
            <td><button class="remove-row">Remove</button></td>
        `;
    tbody.appendChild(row);

    // Add event listeners to new inputs
    const blockNameInput = row.querySelector('.block-name');
    const blockRankInput = row.querySelector('.block-rank');
    blockRankInput.addEventListener('input', clampRankInput);
    blockNameInput.addEventListener('keyup', updateBlockList);
    blockRankInput.addEventListener('keyup', updateBlockList);
    blockRankInput.addEventListener('change', sortBlockList);
    row.querySelector('.remove-row').addEventListener('click', removeRow);

    updateEmptyRowVisibility();
    updateAddRowVisibility();
    // Update add row button state
    updateAddRowButtonState();
  }
}

// Function to remove row
function removeRow(event) {
  const row = event.target.parentNode.parentNode;
  tbody.removeChild(row);
  updateBlockList();
  sortBlockList();
  updateEmptyRowVisibility();
  updateAddRowVisibility();
  updateAddRowButtonState();
}

// Function to update empty row visibility
function updateEmptyRowVisibility() {
  const rows = tbody.getElementsByTagName('tr');
  const firstRow = rows[0];
  if (rows.length <= 10) {
    firstRow.style.display = 'table-row';
  } else {
    firstRow.style.display = 'none';
  }
}

// Function to update add row visibility
function updateAddRowVisibility() {
  const rows = tbody.getElementsByTagName('tr');
  const addRow = document.getElementById('add-row');
  if (rows.length < 10) {
    addRow.style.display = 'block';
  } else {
    addRow.style.display = 'none';
  }
}

// Function to update add row button state
function updateAddRowButtonState() {
  const rows = tbody.getElementsByTagName('tr');
  const addRowButton = document.getElementById('add-row');
  if (rows.length >= 10) {
    addRowButton.disabled = true;
    addRowButton.title = 'Maximum of 10 rows reached';
  } else {
    addRowButton.disabled = false;
    addRowButton.title = '';
  }
}

// Function to clamp rank input value between 1 and 10
function clampRankInput(event) {
  const rankInput = event.target;
  const rankValue = parseInt(rankInput.value);
  if (isNaN(rankValue)) {
    rankInput.value = 1;
  } else if (rankValue < 1) {
    rankInput.value = 1;
  } else if (rankValue > 10) {
    rankInput.value = 10;
  }
}

// Function to update block list in local storage
function updateBlockList() {
  const blockList = [];
  const rows = tbody.getElementsByTagName('tr');

  for (let i = 0; i < rows.length; i++) {
    const blockNameInput = rows[i].querySelector('.block-name');
    const blockRankInput = rows[i].querySelector('.block-rank');
    const removeButton = rows[i].querySelector('.remove-row');
    const blockName = blockNameInput.value.trim();
    const blockRank = blockRankInput.value.trim();

    // Add remove button if missing
    if (!removeButton) {
      const removeButtonCell = document.createElement('td');
      const removeButton = document.createElement('button');
      removeButton.className = 'remove-row';
      removeButton.textContent = 'Remove';
      removeButtonCell.appendChild(removeButton);
      rows[i].appendChild(removeButtonCell);
      removeButton.addEventListener('click', removeRow);
    }

    if (blockName && blockRank) {
      blockList.push({ name: blockName, rank: parseInt(blockRank) });
    }
  }

  storage.setItem(blockListKey, JSON.stringify(blockList));
}

// Function to load block list from local storage
function loadBlockList() {
  const storedBlockList = storage.getItem(blockListKey);
  if (storedBlockList) {
    const blockList = JSON.parse(storedBlockList);
    blockList.forEach((block) => {
      const row = document.createElement('tr');
      row.innerHTML = `
                <td><input type="text" class="block-name" value="${block.name}"></td>
                <td><input type="number" min="1" max="10" class="block-rank" value="${block.rank}"></td>
                <td><button class="remove-row">Remove</button></td>
            `;
      tbody.appendChild(row);

      // Add event listeners to new inputs
      const blockNameInput = row.querySelector('.block-name');
      const blockRankInput = row.querySelector('.block-rank');
      blockRankInput.addEventListener('input', clampRankInput);
      blockNameInput.addEventListener('keyup', updateBlockList);
      blockRankInput.addEventListener('keyup', updateBlockList);
      blockRankInput.addEventListener('change', sortBlockList);
      row.querySelector('.remove-row').addEventListener('click', removeRow);
    });
  }
  updateEmptyRowVisibility();
  updateAddRowVisibility();
}

// Function to sort block list
function sortBlockList() {
  const rows = tbody.getElementsByTagName('tr');
  const blockList = [];

  for (let i = 0; i < rows.length; i++) {
    const blockNameInput = rows[i].querySelector('.block-name');
    const blockRankInput = rows[i].querySelector('.block-rank');
    const blockName = blockNameInput.value.trim();
    const blockRank = blockRankInput.value.trim();

    if (blockName && blockRank) {
      blockList.push({ name: blockName, rank: parseInt(blockRank), row: rows[i] });
    }
  }

  // Sort block list by rank and then name
  blockList.sort((a, b) => {
    if (a.rank === b.rank) {
      return a.name.localeCompare(b.name);
    } else {
      return b.rank - a.rank;
    }
  });

  // Reorder rows in table body
  blockList.forEach((block, index) => {
    tbody.appendChild(block.row);
  });

  // Update local storage
  updateBlockList();
}

// Add event listener to rank inputs for sorting
const rankInputs = document.getElementsByClassName('block-rank');
for (let i = 0; i < rankInputs.length; i++) {
  rankInputs[i].addEventListener('input', clampRankInput);
  rankInputs[i].addEventListener('change', sortBlockList);
}

// Initial empty row visibility update
updateEmptyRowVisibility();
// Initial add row visibility update
updateAddRowVisibility();
// Initial add row button state update
updateAddRowButtonState();
