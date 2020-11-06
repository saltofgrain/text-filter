
function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            // console.log(response);
        });
    });
}


function addCommandHandler() {
    chrome.commands.onCommand.addListener(function(command) {
        console.log("command:");
        console.log(command);
        if (command === "show-only-filtered-lines") {
            sendMessage({
                action: "hide-matches"
            });
        }
    });    
}

addCommandHandler();
