let REQUEST_INTERVAL = 3600000;

let requestData = () => {
    // initial state

    chrome.storage.local.set({
        pending: true,
    });

    fetch('http://www.softomate.net/ext/employees/list.json')
        .then((result) =>
            result.json()
        )
        .then((result) => {
            // the request is done succesfully
            chrome.storage.local.get('popupState', function(storageData) {
                let contentState;
                // fill up the contentState
                // check if there is a contentState already in Storage
                if (!storageData.popupState || !storageData.popupState.contentState) {
                    contentState = {};
                    for (var i =0; i<result.length; i++) {
                        contentState[result[i].name] = {count: 0, closed: false};
                    }
                } else {
                    contentState = storageData.popupState.contentState;
                    // add new websites
                    for (var i =0; i<result.length; i++) {
                        if (!(result[i].name in contentState)) {
                            contentState[result[i].name] = {count: 0, closed: false};                            
                        }
                    }
                    // remove old websites
                    Object.keys(contentState)
                        .filter(browser => !result.find(item => item.name === browser))
                        .forEach(browserForRemove => delete contentState[browserForRemove]);
                }
                chrome.storage.local.set({
                    'popupState': {
                        data: result,
                        error: null,
                        contentState
                    }
                });

                chrome.storage.local.set({
                    pending: false,
                });
            });
        })
        .catch((error) =>{
            // the request is failed
            chrome.storage.local.set({
                popupState: {
                    data: null,
                    pending: false,
                    error: error.message
                }
            })

            chrome.storage.local.set({
                pending: false,
            });
        })
};

requestData(); // request on the first load of the extension

// update state
chrome.extension.onMessage.addListener((request, sender, sendResponse) => {
    switch (request.msg) {
        case "refreshData":
            requestData();
            break;
        case "closed":
            chrome.storage.local.get('popupState', function(result) {
                result.popupState.contentState[request.website].closed = true;
                chrome.storage.local.set({
                    'popupState': result.popupState
                });
            });
            break;
        case "visited":
            chrome.storage.local.get('popupState', function(result) {
                result.popupState.contentState[request.website].count += 1;
                chrome.storage.local.set({
                    'popupState': result.popupState
                });
            });
    }
});

// reset website counters after browser was closed
chrome.windows.onRemoved.addListener(function(){
    chrome.storage.local.get('popupState', function(result) {
        for (var key in result.popupState.contentState) {
          result.popupState.contentState[key].count = 0;
      }
      chrome.storage.local.set({
        'popupState': result.popupState
    });
  });
})

setInterval(requestData, REQUEST_INTERVAL);