"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            console.log(response);
        });
    });
}

type AppProps = {}
type AppState = {
    data: string[]
}

class PopupApp extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props);
        this.state = {data: []};
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage({
                word: event.target.value,
            });
            const data = this.state.data.concat(event.target.value);
            this.setState({data: data});
            event.preventDefault();
        }
    }

    render() {
        return (
            <Container fixed style={{width: 200, height: 300, backgroundColor: "skyblue"}}>
                <TextField variant="outlined" size="small" onKeyPress={this.handleKeyPress} />
                <List dense={true}>
                    {this.state.data.map(item => (
                        <ListItem><ListItemText primary={item} /></ListItem>
                    ))}
                </List>
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
