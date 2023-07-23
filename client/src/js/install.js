const butInstall = document.getElementById('buttonInstall')

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // here we prevent the default behavior of the event (older browsers)
  event.preventDefault()

  // console.log('👍', 'beforeinstallprompt', event)
  // Stash the event to globals so it can be triggered later.
  window.deferredPrompt = event

  // Update UI that notifies the user they can install the app
  butInstall.style.visibility = 'visible'
})

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  // console.log('👍', 'butInstall-clicked');

  // Check if 'beforeinstallprompt' event was fired
  const promptEvent = window.deferredPrompt;
  if (!promptEvent) {
    // The deferred prompt isn't available.
    // console.log('👎', 'butInstall-clicked but no prompt');
    return;
  }
  
  // Manually trigger the prompt that was previously saved
  // i.e., ask the user if they want to install the app
  promptEvent.prompt();

  // Wait for the user to respond to the prompt
  const choiceResult = await promptEvent.userChoice;
  console.log('👍', 'userChoice', choiceResult);
  
  // Clear the saved prompt since it can't be used again
  window.deferredPrompt = null;

  // Hide the install button
  butInstall.style.display = 'none';

  // Update the UI
  butInstall.setAttribute('disabled', true);
  butInstall.textContent = 'Installed!';
});


// Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  // Clear the deferredPrompt
  window.deferredPrompt = null
  // Update the UI
  butInstall.setAttribute('disabled', true);
  butInstall.textContent = 'Installed!';
})

// Function to check if the display mode is standalone
function isRunningStandalone() {
    return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) || document.referrer.includes('android-app://');
}

// wait until DOM is ready
document.addEventListener('DOMContentLoaded', () => {
// Check if the app is running standalone
if (isRunningStandalone()) {
    // If it is, hide the install button
    butInstall.style.display = 'none';
} else {
    // If it's not, show the install button
    butInstall.style.display = 'block';
}
})
