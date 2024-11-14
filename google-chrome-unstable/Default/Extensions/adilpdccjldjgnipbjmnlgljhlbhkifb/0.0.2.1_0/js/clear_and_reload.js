// Clear Local Storage
async function clearAndReload() {
  window.localStorage.clear();
  window.sessionStorage.clear();
  console.log("Local Storage Cleared");
  // Reload Page
  var wl = window.location;
  var isChrome = window.chrome;
  if (isChrome) {
    setTimeout(() => {
      wl.reload(); //reloads in chrome! :)
    }, 100);
  } else {
    wl.reload(); //other browsers
  }
  console.log("Page Reloaded");
}

clearAndReload();
