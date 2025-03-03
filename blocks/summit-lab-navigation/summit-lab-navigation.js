/**
 * Opens a popup window to lookup seat information
 * @param {Event} e The click event
 */
async function lookupSeat(e) {
  e.preventDefault();
  
  try {
    // Fetch the base URL from the JSON endpoint
    const response = await fetch('https://main--wknd-summit2025--adobe.aem.live/lab-337/lab-337-sites.json');
    const data = await response.json();
    
    // Get the base URL pattern from the first item
    const baseURLPattern = data.data[0].baseURL;
    
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
        // Replace '000' in the baseURL with the actual seat number
        const fullUrl = baseURLPattern.replace('000', seatNumber);
        // Open in new tab
        window.open(fullUrl, '_blank');
      } else {
        alert('Please enter a valid seat number (0-200)');
      }
    }
  } catch (error) {
    console.error('Error fetching seat information:', error);
    alert('Unable to load seat information. Please try again later.');
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