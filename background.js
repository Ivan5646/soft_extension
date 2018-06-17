let REQUEST_INTERVAL = 3600000;

let requestData = () => {
    setTimeout(() => {
        fetch('http://www.softomate.net/ext/employees/list.json')
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
            )
    }, 1000);
};

requestData(); // request on the first load of the extension

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