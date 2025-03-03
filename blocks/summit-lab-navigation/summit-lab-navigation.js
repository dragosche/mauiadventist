/**
 * Opens a popup window to lookup seat information
 * @param {Event} e The click event
 */
function lookupSeat(e) {
  e.preventDefault();
  
  // Prompt for seat number
  let seatNumber = prompt('Please enter your seat number:');
  
  // Validate and format seat number
  if (seatNumber) {
    // Remove any non-numeric characters
    seatNumber = seatNumber.replace(/\D/g, '');
    
    // Pad with leading zeros if less than 3 digits
    seatNumber = seatNumber.padStart(3, '0');
    
    // Validate it's exactly 3 digits
    if (seatNumber.length === 3) {
      const baseUrl = `https://aem.live/${seatNumber}`;
      // Open in new tab
      window.open(baseUrl, '_blank');
    } else {
      alert('Please enter a valid seat number (1-200)');
    }
  }
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