var processRemoteData = function processRemoteData(popupState) {
  console.log(popupState);

  if (popupState.pending) {
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

chrome.storage.local.get('popupState', (result) => processRemoteData(result.popupState));
chrome.storage.onChanged.addListener((result) => processRemoteData(result.popupState.newValue)); //newValue?

$('#refreshButton').on('click', (event) => {
  event.stopPropagation();
  event.preventDefault();
  chrome.extension.sendMessage({ msg: "refreshData" });
});
