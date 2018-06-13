var processRemoteData = function processRemoteData(popupState) {

  let found = popupState.data.find(i => location.host.indexOf(i.domain) >= 0); // finding the required websites
  console.log(found.domain);
  var website = found.domain;
  website = website.substring(0, website.indexOf(".")); // cut off domain zone 
  var yandex = "yandex"; // remove
  var closed = popupState.contentState.yandex.closed;
  if (found && closed != true ) { // && closed != true  yandex == "yandex"
    var msgText = found.message;
    var div = $("<div>", {id: "myContainer", text: msgText});
    $(div).css({
      "font-size": "28px",
      "position": "absolute",
      "top": "20px",
      "z-index": "99999",
      "padding": "20px",
      "background-color": "#f44336",
      "color": "white",
      "opacity": "1",
      "transition": "opacity 0.6s",
      'margin-bottom': "15px",
      "background-color": "#4CAF50"
    });
    $("body").append(div);

    var close = $("<span>", {id: "close", text: "X"});
    $(close).css({
      "position": "relative",
      "top": "2px",
      "right": "2px",
      "cursor": "pointer",
      "margin-left": "15px",
      "color": "white",
      "font-weight": "bold",
      "font-size": "22px",
      "line-height": "20px",
      "transition": "0.3s"
    });
    $(div).append(close);
  }

  $(document).ready(function(){    
    $("#close").click(function(){
      $("#myContainer").hide();
      chrome.storage.local.set({
        popupState: {
          contentState: {
            website: {
              closed: true
            }
          }
        }
      });
      // chrome.extension.sendMessage({ msg: "closed" });
    });  
  });

}

chrome.storage.local.get('popupState', (result) => processRemoteData(result.popupState));