import "./content.css";
import { AppState, Pattern, getAppState } from "./shared"

function checkIfPlaintext(trueCallback, falseCallback) {
    if (document.body.children.length === 1) {
        const child = document.body.children[0];
        if (child.tagName === "PRE") {
            trueCallback(child);
            return;
        }
    }
    if (falseCallback) {
        falseCallback();
    }
}

function parseText(pre) {
    var rows = pre.innerHTML.split("\n").map((i) => {
        var row = document.createElement("div");
        row.onclick = function () {
        };
        var t = document.createTextNode(i);
        row.appendChild(t);
        return row;
    });
    var wrapper = document.createElement("div");
    for (var i = 0; i < rows.length; i++) {
        wrapper.appendChild(rows[i]);
    }
    pre.parentNode.replaceChild(wrapper, pre);
    return rows;
}


function applyAppState(rows, appState: AppState) {
    const patterns = appState.patterns || [];
    labelMatches(rows, false);
    for (var pattern of patterns) {
        let matches = getMatches(rows, pattern.text);
        labelMatches(matches, pattern.enabled);
        hideMatches(matches, appState.hideMatches && pattern.enabled);
    }
}

function addListener() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("received: " + JSON.stringify(request));
        const action = request.action;
        if (action === "add-pattern") {
            // let matches = getMatches(rows, request.word);
            // hideRows(matches);
            getAppState((appState) => {
                applyAppState(textRows, appState);
            });
        }
        else if (action === "del-pattern") {
            getAppState((appState) => {
                applyAppState(textRows, appState);
            });
        }
        else if (action === "toggle-pattern") {
            getAppState((appState) => {
                applyAppState(textRows, appState);
            });
        }
        else if (action === "hide-matches") {
            getAppState((appState) => {
                applyAppState(textRows, appState);
            });
        }
        return true;
    });
}

function addNoopListener() {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("noop: " + JSON.stringify(request));
        return true;
    });
}

function getMatches(rows, pattern) {
    let results = [];
    for (var i = 0; i < rows.length; i++) {
        let row = rows[i];
        if (row.innerHTML.toLowerCase().includes(pattern)) {
            results.push(row);
        }
    }
    return results;
}

function labelMatches(rows, label: boolean) {
    for (var row of rows) {
        if(label) {
            row.classList.add("match");
        }
        else {
            row.classList.remove("match");
        }
    }
}

function hideMatches(matches, hide: boolean) {
    matches.forEach((element) => {
        if(hide) {
            element.classList.add("hidden");
        }
        else {
            element.classList.remove("hidden");
        }
    });
}

var textRows; // TODO: replace this with global member store

function onLoad() {
    console.log("loaded");
    checkIfPlaintext(
        function (pre) {
            console.log("Is plaintext!");
            let rows = parseText(pre);
            textRows = rows;
            getAppState((appState) => {
                applyAppState(rows, appState);
                addListener();
            });
        },
        function () {
            console.log("Not plaintext!");
            addNoopListener();
        }
    );
}

if (document.readyState != "loading") {
    console.log("already loaded");
    onLoad();
} else {
    document.addEventListener("DOMContentLoaded", onLoad, false);
}
