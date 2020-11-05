"use strict";

import * as React from "react";
import * as ReactDOM from "react-dom";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function sendMessage(message) {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        let tab = tabs[0];
        chrome.tabs.sendMessage(tab.id, message, function (response) {
            // console.log(response);
        });
    });
}

type AppProps = {
    input: "";
    patterns: string[];
};
type AppState = {
    input: "";
    patterns: string[];
};

class PopupApp extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props);
        // this.state = {input: "", patterns: []};
        // console.log("ctor patterns: " + JSON.stringify(props.patterns));
        // this.state = {input: "", patterns: props.patterns};
        this.state = props;
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }

    handleChange(event) {
        this.setState((state) => {
            const data = {
                input: event.target.value,
                patterns: state.patterns,
            };
            chrome.storage.sync.set(data);
            return data;
        });
    }

    handleKeyPress(event) {
        if (event.key === "Enter") {
            sendMessage({
                word: event.target.value,
            });
            this.setState((state) => {
                const patterns = state.patterns.concat(event.target.value);
                const data: AppState = {
                    input: "",
                    patterns: patterns,
                };
                chrome.storage.sync.set(data);
                return data;
            });
            event.preventDefault();
        }
    }

    render() {
        return (
            <Container fixed style={{width: 400, height: 300}}>
                <TextField
                    variant="outlined"
                    size="small"
                    value={this.state.input}
                    onChange={this.handleChange}
                    onKeyPress={this.handleKeyPress}
                />
                <TableContainer component={Paper}>
                    <Table size="small" aria-label="a dense table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Enabled</TableCell>
                                <TableCell>Pattern</TableCell>
                                <TableCell align="right">Hits</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.patterns.map((pattern) => (
                                <TableRow key={pattern}>
                                    <Checkbox />
                                    <TableCell component="th" scope="row">
                                        {pattern}
                                    </TableCell>
                                    <TableCell align="right">3</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        );
    }
}

chrome.storage.sync.get(null, function (data: AppProps) {
    const domContainer = document.querySelector("#popup-app");
    // const patterns = data.patterns || [];
    data.patterns = data.patterns || [];
    ReactDOM.render(<PopupApp {...data} />, domContainer);
});

// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     console.log(sender.tab ?
//                 "from a content script:" + sender.tab.url :
//                 "from the extension");
//     alert('popup');
//     // if (request.greeting == "hello")
//       // sendResponse({farewell: "goodbye"});
//   });
