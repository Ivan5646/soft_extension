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
                        console.log(storageData);
                        console.log(contentState);
                        console.log(result[i].name);
                        if (!(result[i].name in contentState)) {
                            contentState[result[i].name] = {count: 0, closed: false};                            
                        }
                    }
                    // remove old websites
                    Object.keys(contentState)
                        .filter(browser => !result.find(item => item.name === browser))
                        .forEach(browserForRemove => delete contentState[browserForRemove]);
                }
                setTimeout(() => {
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
                }, 1000);
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

console.log("bg 2");

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
                console.log("visited");
                console.log(result.popupState);
                result.popupState.contentState[request.website].count += 1;
                console.log("-----");
                chrome.storage.local.set({
                    'popupState': result.popupState
                });
            });
    }
});

// reset website counters after browser was closed
// window.onbeforeunload = function() {
//     chrome.storage.local.get('popupState', function(result) {
//     for (var key in result.popupState.contentState) {
//       result.popupState.contentState[key].count = 0;
//       console.log(result.popupState.contentState[key].count);
//     }
//         chrome.storage.local.set({
//             'popupState': result.popupState
//         });
//     });
// };

// chrome.app.window.current().onClosed.addListener(function(){  // chrome.app.window undefined
//     chrome.storage.local.get('popupState', function(result) {
//         for (var key in result.popupState.contentState) {
//           result.popupState.contentState[key].count = 0;
//           console.log(result.popupState.contentState[key].count);
//       }
//       chrome.storage.local.set({
//         'popupState': result.popupState
//     });
//   });
// })

// chrome.app.runtime.onLaunched.addListener(function() {
//     console.log('launched');
//     function(window){
//     window.onClosed.addListener(function() {
//     console.log('close bg');
//     });
//     }
// })

chrome.windows.onRemoved.addListener(function(){
    chrome.storage.local.get('popupState', function(result) {
        for (var key in result.popupState.contentState) {
          result.popupState.contentState[key].count = 0;
          console.log(result.popupState.contentState[key].count);
      }
      chrome.storage.local.set({
        'popupState': result.popupState
    });
  });
})

setInterval(requestData, REQUEST_INTERVAL);