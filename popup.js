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
        let links = '';
        // popupState.data.forEach((item) => {links += "link"});
        // $('#status').append(links);

        for (i = 0; i < popupState.data.length; i++) {
            $(`<a class="links" href=https://www.${popupState.data[i].domain} />`).text(popupState.data[i].name).appendTo('#status');
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