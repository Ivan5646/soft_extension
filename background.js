let REQUEST_INTERVAL = 3600000;

let requestData = () => {
  // the request is started
  chrome.storage.local.set({
    popupState: {
      pending: true
    }//, 
    // contentState: {
    //   'google': {
    //     count: 0,
    //     closed: false
    //   },
    //   'yandex': {
    //     count: 0,
    //     closed: false
    //   },
    //   'bing': {
    //     count: 0,
    //     closed: false
    //   }
    // }
  });

setTimeout( () => {fetch('http://www.softomate.net/ext/employees/list.json') 
    .then((result) =>
      result.json()
    )
    .then((result) =>
      // the request is done succesfully
      chrome.storage.local.set({
        popupState: {
          data: result,
          pending: false,
          error: null, 
          contentState: {
            'google': {
              count: 0,
              closed: false
            },
            'yandex': {
              count: 0,
              closed: false
            },
            'bing': {
              count: 0,
              closed: false
            }
          }
        }
      })
    )
    .catch((error) =>
      // the request is failed
      chrome.storage.local.set({
        popupState: {
          data: null,
          pending: false,
          error: error.message
        }
      })
    )}, 1000);

};

requestData();

chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
  if (request.msg === "refreshData") {
    requestData();
  }
  else if (request.msg === "closed") {
    // chrome.storage.local.get('storageKey', function(result) {
    //   //data.visited will be in the result object for a specific key. You can change data.visited 
    //   //to be true here. After changing it to true you can save it again under 
    //   //the key 'storageKey' or any key you like.

    //   chrome.storage.local.set({storageKey: result});
    // });

    console.log("chrome onMessage");
  }
});

setInterval(requestData, REQUEST_INTERVAL);
