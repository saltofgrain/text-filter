import "./content.css";

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
            // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
            //     console.log('content.js: ' + response);
            // });
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

function getPatterns(callback) {
    chrome.storage.sync.get(null, (data) => {
        let patterns = data.patterns || [];
        callback(patterns);
    });
}

function applyMatches(rows, patterns) {
    for (var pattern of patterns) {
        let matches = getMatches(rows, pattern);
        hideRows(matches);
    }
}

function hideMatches() {
    const elements = document.querySelectorAll(".match");
    elements.forEach((element) => {
        if(element.classList.contains("hidden")) {
            element.classList.remove("hidden");
        }
        else {
            element.classList.add("hidden");
        }
    })    
}

function addListener(rows) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        console.log("received: " + JSON.stringify(request));
        const action = request.action;
        if (action === "add-pattern") {
            let matches = getMatches(rows, request.word);
            hideRows(matches);
        }
        else if (action === "hide-matches") {
            hideMatches();
        }
        // sendResponse({});
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

function hideRows(rows) {
    for (var row of rows) {
        // row.style.color = 'gray';
        row.classList.add("match");
    }
}

function onLoad() {
    console.log("loaded");
    checkIfPlaintext(
        function (pre) {
            console.log("Is plaintext!");
            let rows = parseText(pre);
            getPatterns((patterns) => {
                applyMatches(rows, patterns);
                addListener(rows);
            });
        },
        function () {
            console.log("Not plaintext!");
        }
    );
}

console.log("here");
if (document.readyState != "loading") {
    console.log("already loaded");
    onLoad();
} else {
    document.addEventListener("DOMContentLoaded", onLoad, false);
}
console.log("there");
