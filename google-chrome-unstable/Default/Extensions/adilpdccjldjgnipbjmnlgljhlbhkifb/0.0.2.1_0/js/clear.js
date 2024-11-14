document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('clearbutton').addEventListener('click', function () {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      my_tabid = tabs[0].id;
      chrome.scripting.executeScript(
          {
              target: { tabId: my_tabid },
              files: ['js/clear_and_reload.js'],
          });
  });
    setTimeout(() => {
      close();
    }, 500);
  });
});

document.onkeyup = function(e) {
  if (e.keyCode == 13) {
    chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
      my_tabid = tabs[0].id;
      chrome.scripting.executeScript(
          {
              target: { tabId: my_tabid },
              files: ['js/clear_and_reload.js'],
          });
  });
    setTimeout(() => {
      close();
    }, 500);
  }
};
