var processRemoteData = function processRemoteData(popupState, pending) {
    if (pending) {
        $('#pending').show();
        $('#status').text("");
    } else if (popupState.error) {
        $('#error').show();
        $('#errorText').text(popupState.error);
        $('#pending').hide();
    } else {
        $('#errorText').text('');
        $('#error').hide();
        $('#pending').hide();
        for (i = 0; i < popupState.data.length; i++) {
            $(`<a class="links" target="_blank" href=https://www.${popupState.data[i].domain} />`).text(popupState.data[i].name).appendTo('#status');
        }
    }
};

updateData();

chrome.storage.onChanged.addListener((data) => {
    if ("pending" in data || "popupState" in data) {
        updateData();        
    }
});

function updateData() {
    chrome.storage.local.get(['popupState', 'pending'], (result) => {
        processRemoteData(result.popupState, result.pending);
    });
}

$('#refreshButton').on('click', (event) => {
    event.stopPropagation();
    event.preventDefault();
    chrome.extension.sendMessage({
        msg: "refreshData"
    });
});