/**
 * Opens a popup window to lookup seat information
 * @param {Event} e The click event
 */
function lookupSeat(e) {
  e.preventDefault();
  // Open popup window centered on screen
  const width = 800;
  const height = 600;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;
  window.open('https://aem.live', 'SeatLookup', 
    `width=${width},height=${height},left=${left},top=${top}`);
}

/**
 * @param {HTMLElement} $block The block element
 */
export default async function decorate($block) {
  // Create button element
  const $button = document.createElement('a');
  $button.href = '#';
  $button.className = 'button';
  $button.textContent = 'Find Your Seat';
  $button.addEventListener('click', lookupSeat);

  // Replace block contents with button
  $block.replaceChildren($button);
} 