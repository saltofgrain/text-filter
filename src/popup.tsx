"use strict";

// import * as React from "react";
// import * as ReactDOM from "react-dom";
import {AppState, AppProps, Pattern, sendMessage} from "./shared";

chrome.storage.sync.get(null, function (data: AppProps) {
    const domContainer = document.querySelector("#popup-app");
    data.patterns = data.patterns || [];
    // ReactDOM.render(<PopupApp {...data} />, domContainer);
});
