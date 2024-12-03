// Utility function to generate a unique guest ID (using Math.random)
function generateGuestId() {
    return 'guest-' + Math.random().toString(36).substr(2, 9);  
  }
  
  // Check if guestId already exists in localStorage, if not, create a new one
  function getGuestId() {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = generateGuestId();
      localStorage.setItem('guestId', guestId);  
    }
    return guestId;
  }
  
  export { getGuestId };