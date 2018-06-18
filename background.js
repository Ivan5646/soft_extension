let REQUEST_INTERVAL = 3600000;

// contentState: {
//     'google': {
//         count: 0,
//         closed: false
//     },
//     'yandex': {
//         count: 0,
//         closed: false
//     },
//     'bing': {
//         count: 0,
//         closed: false
//     }
// }

let requestData = () => {
    // initial state
    chrome.storage.local.set({
        popupState: {
            pending: true
      }
    });

    setTimeout(() => {
        fetch('http://www.softomate.net/ext/employees/list.json')
            .then((result) =>
                result.json()
            )
            .then((result) =>
                // the request is done succesfully

                // fill up the contentState
                // check if there is a contentState already in Storage
                chrome.storage.local.get('popupState', function(storageData) {
                    if (!storageData.contentState) {
                        contentState = {};
                        for (var i =0; i<result.length; i++) {
                            contentState[result[i].name] = {count: 0, closed: false};
                        }
                        chrome.storage.local.set({
                            'popupState': {
                                data: result,
                                pending: false,
                                error: null,
                                contentState
                            }
                        });
                    }
                });
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
            )
    }, 1000);
};

requestData(); // request on the first load of the extension
debugger;
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

setInterval(requestData, REQUEST_INTERVAL);