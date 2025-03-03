/**
 * Opens a popup window to lookup seat information
 * @param {Event} e The click event
 */
async function lookupSeat(e) {
  e.preventDefault();
  
  try {
    // Prompt for seat number first
    let seatNumber = prompt('Please enter your seat number:');
    
    if (!seatNumber) {
      return; // User cancelled
    }

    // Remove any non-numeric characters and pad with leading zeros
    seatNumber = seatNumber.replace(/\D/g, '').padStart(3, '0');
    
    // Validate it's exactly 3 digits
    if (seatNumber.length !== 3) {
      alert('Please enter a valid seat number (0-200)');
      return;
    }

    // Fetch the sites data from the JSON endpoint
    const response = await fetch('https://main--wknd-summit2025--adobe.aem.live/lab-337/lab-337-sites.json');
    const data = await response.json();
    
    // Find the matching site data for the entered seat number
    const siteData = data.data.find(site => {
      // Extract seat number from the baseURL to compare
      const urlSeatNumber = site.baseURL.match(/\/(\d{3})\//)?.[1];
      return urlSeatNumber === seatNumber;
    });

    if (!siteData) {
      alert(`No lab environment found for seat number ${seatNumber}`);
      return;
    }

    // Construct the Experience Cloud URL with the matching site data
    const experienceCloudUrl = `https://experience.adobe.com/?organizationId=d488fc90-d009-412c-82a1-70b338b1869c/#/@summit2025l337/project-success-studio/sites/${siteData.id}/home`;
    
    // Open both URLs in new tabs
    window.open(siteData.baseURL, '_blank');
    window.open(experienceCloudUrl, '_blank');

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
  $button.textContent = 'Access My Lab Environment';
  $button.addEventListener('click', lookupSeat);

  // Replace block contents with button
  $block.replaceChildren($button);
} 