const butInstall = document.getElementById('buttonInstall')
const appInstallStatus = document.getElementById('installStatus')
// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // the browser fires this event when it knows the user can install the PWA

  // here we prevent the default behavior of the event (older browsers)
  event.preventDefault()

  // Stash the event to globals so it can be triggered later.
  window.deferredPrompt = event

  // Update UI that notifies the user they can install the app
  // ie show the install button
  appInstallStatus.textContent = ''
  appInstallStatus.style.display = 'none'
  butInstall.classList.remove('btn-light')
  butInstall.classList.add('btn-dark')
  butInstall.textContent = 'Install Me!'
  butInstall.style.display = 'block'
  butInstall.disabled = false
})

// Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  butInstall.disabled = true // avoid multiple calls

  // Check if 'beforeinstallprompt' event was fired
  const promptEvent = window.deferredPrompt
  if (!promptEvent) {
    // The deferred prompt isn't available.
    butInstall.disabled = false
    return
  }

  // Manually trigger the prompt that was previously saved
  // i.e., ask the user if they want to install the app
  promptEvent.prompt()

  // Wait for the user to respond to the prompt
  await promptEvent.userChoice

  // Clear the saved prompt since it can't be used again
  window.deferredPrompt = null
})

// Update 'appinstalled' event
window.addEventListener('appinstalled', (event) => {
  // Clear the deferredPrompt
  window.deferredPrompt = null
  // Update the UI
  // Disable the install button, change its color and text
  butInstall.disabled = true
  butInstall.classList.add('btn-light')
  butInstall.classList.remove('btn-dark')
  butInstall.textContent = 'Inkflow is Installed!'
  butInstall.style.display = 'none'
  appInstallStatus.textContent = 'Inkflow is installed'
  appInstallStatus.style.display = 'block'
})

// Function to check if the display mode is standalone
function isRunningStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone
  )
}

// wait until DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Check if the app is running standalone
  // (ie is installed and running from the start menu)
  if (isRunningStandalone()) {
    // If it is, hide the install button
    butInstall.disabled = true
    butInstall.classList.add('btn-light')
    butInstall.classList.remove('btn-dark')
    butInstall.textContent = 'Installed!'
    butInstall.style.display = 'none'
    appInstallStatus.textContent = 'Inkflow is Installed'
    appInstallStatus.style.display = 'none'
  }
  // if not, beforeinstallprompt event will handle the install button
  // and the default is to hide the install button
})
