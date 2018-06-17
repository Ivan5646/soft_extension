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
        'popupState': {
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
    // Error in event handler for runtime.onMessage: ReferenceError: result is not defined
    chrome.storage.local.get('popupState', function(result) {
      result.popupState.contentState.yandex.closed = true;
      chrome.storage.local.set({'popupState': result});
    });

    //console.log(result.popupState.contentState[request.website].count);
  }
});

setInterval(requestData, REQUEST_INTERVAL);
