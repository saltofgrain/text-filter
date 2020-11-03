
// alert('bar');
// function htmlToElement(html) {
//     var template = document.createElement('template');
//     html = html.trim(); // Never return a text node of whitespace as the result
//     template.innerHTML = html;
//     return template.content.firstChild;
// }

// var controlPanel = htmlToElement("<div class='control-panel'>foo bar<\/div>");
// document.body.appendChild(controlPanel);

// alert("bar");

// chrome.runtime.onConnect.addListener((port) => {
//   port.onMessage.addListener((msg) => {
//     if (msg.function == 'html') {
//       port.postMessage({ 
//           html: document.documentElement.outerHTML, 
//         //   description: document.querySelector("meta[name=\'description\']").getAttribute('content'), 
//           description: 'description',
//           title: document.title 
//         }
//       );
//     }
//   });
// });

import "./content.css";

const raw = document.querySelector("pre");
// raw.innerHTML += "\nfoobarx";
var rows = raw.innerHTML.split("\n").map(i => { 
    var row = document.createElement("div");
    row.onclick = function() {
        // chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
        //     console.log('content.js: ' + response);
        // });        
    };
    var t = document.createTextNode(i);
    row.appendChild(t);
    return row;
});
var wrapper = document.createElement("div");
for(var i=0; i<rows.length; i++) {
    wrapper.appendChild(rows[i]);
}
raw.parentNode.replaceChild(wrapper, raw);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('received: ' + request.word);
        let matches = getMatches(rows, request.word);
        hideRows(matches);
    }
);

function getMatches(rows, pattern) {
    let results = [];
    for(var i=0; i<rows.length; i++) {
        let row = rows[i];
        console.log(row.innerHTML + ' ?= ' + pattern + ' : ' + (row.innerHTML == pattern));
        if(row.innerHTML == pattern) {
            results.push(row);
        }
    }
    return results;
}

function hideRows(rows) {
    for(var row of rows) {
        // row.style.color = 'gray';
        row.classList.add('match');
    }
}

// chrome.runtime.sendMessage({greeting: "hello"}, function(response) {
//   console.log(response.farewell);
// });


// window.onload = function() {
//     const raw = document.querySelector("pre");
//     raw.innerHTML += "\nfoobar";
// }

// function onLoad() {
//     // alert("foobar");
// }

// document.addEventListener("DOMContentLoaded", onLoad, false);