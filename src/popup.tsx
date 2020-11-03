"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";

const e = React.createElement;

function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            console.log(response);
        });
    });
}

class PopupApp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ""};
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage({
                word: event.target.value,
            });
            event.preventDefault();
        }
    }

    // render() {
    //   const containerOpts = {
    //     fixed: true,
    //     style: {
    //       width: 200,
    //       height: 300,
    //       backgroundColor: 'skyblue'
    //     }
    //   };
    //   const textFieldOpts = {
    //     variant: 'outlined',
    //     onKeyPress: this.handleKeyPress,
    //     size: 'small'
    //   };
    //   const retval =
    //     e(Container, containerOpts,
    //       e(TextField, textFieldOpts),
    //     );
    //   return retval;
    // };

    render() {
        return (
            <Container fixed style={{width: 200, height: 300, backgroundColor: "skyblue"}}>
                <TextField variant="outlined" size="small" onKeyPress={this.handleKeyPress} />
            </Container>
        );
    }
}

const domContainer = document.querySelector("#popup-app");
ReactDOM.render(<PopupApp />, domContainer);

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     alert('popup');
//     // if (request.greeting == "hello")
//       // sendResponse({farewell: "goodbye"});
//   });
