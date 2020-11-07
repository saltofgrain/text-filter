import { sendMessage, getAppState } from "./shared"

function toggleHideMatches() {
    getAppState((appState) => {
        appState.hideMatches = !appState.hideMatches;
        chrome.storage.sync.set(appState);
        sendMessage({
            action: "hide-matches"
        });
    });
}

function addCommandHandler() {
    chrome.commands.onCommand.addListener(function(command) {
        console.log("command:");
        console.log(command);
        if (command === "toggle-hide-matches") { // TODO: change this to "toggle-hide-matches"
            toggleHideMatches();
        }
        return true;
    });    
}

addCommandHandler();
