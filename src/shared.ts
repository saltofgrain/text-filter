
export type Pattern = {
    id: string,
    text: string,
    enabled: boolean,
    hits: number,
};

export type AppState = {
    input: "";
    patterns: Pattern[];
    hideMatches: boolean;
};

export type AppProps = AppState;

export function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            // console.log(response);
        });
    });
}

type AppStateCallback = (arg: AppState) => void;

export function getAppState(callback: AppStateCallback) {
    chrome.storage.sync.get(null, (appState: AppState) => {
        callback(appState);
    });
}

