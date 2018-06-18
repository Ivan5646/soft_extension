var processRemoteData = function processRemoteData(popupState, pending) {
    if (pending) {
        $('#pending').show();
    } else if (popupState.error) {
        $('#error').show();
        $('#errorText').text(popupState.error);
        $('#pending').hide();
    } else {
        $('#errorText').text('');
        $('#error').hide();
        $('#pending').hide();
        let text = '';
        popupState.data.forEach((item) => text += item.name + ' ');
        $('#status').text(text);
    }
};

updateData();

chrome.storage.onChanged.addListener((data) => {
    if ("pending" in data || "popupState" in data) {
        updateData();        
    }
});

function updateData() {
    chrome.storage.local.get('popupState', (resultPopupState) => {
        chrome.storage.local.get('pending', (resultPending) => {
            processRemoteData(resultPopupState.popupState, resultPending.pending);
        });
    });
}

$('#refreshButton').on('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    chrome.extension.sendMessage({
        msg: "refreshData"
    });
});