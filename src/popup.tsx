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
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import {AppState, AppProps, Pattern, sendMessage} from "./shared";

function getUid() {
    const uid = Math.random().toString(36).slice(-6);
    return uid;
}

class PopupApp extends React.Component<AppProps, AppState> {
    constructor(props) {
        super(props);
        // this.state = {input: "", patterns: []};
        // console.log("ctor patterns: " + JSON.stringify(props.patterns));
        // this.state = {input: "", patterns: props.patterns};
        this.state = props;
        this.handleChange = this.handleChange.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEnableClick = this.handleEnableClick.bind(this);
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
            const newPatternText = event.target.value;
            this.setState((state) => {
                const newPattern: Pattern = {
                    id: getUid(), // TODO: check for collisions
                    text: newPatternText,
                    enabled: true,
                    hits: 0,
                };
                const newState: AppState = {
                    input: "",
                    patterns: state.patterns.concat(newPattern),
                    hideMatches: state.hideMatches,
                };
                chrome.storage.sync.set(newState);
                sendMessage({
                    action: "add-pattern",
                    word: newPatternText,
                });
                return newState;
            });
            event.preventDefault();
        }
    }

    handleDeleteClick(patternId) {
        this.setState((state) => {
            const newState: AppState = {
                input: state.input,
                patterns: state.patterns.filter((p) => p.id !== patternId),
                hideMatches: state.hideMatches,
            };
            chrome.storage.sync.set(newState);
            sendMessage({
                action: "del-pattern",
                id: patternId,
            });
            return newState;
        });
        event.preventDefault();
    }

    handleEnableClick(event, patternId) {
        this.setState((state) => {
            const newState: AppState = {
                input: state.input,
                patterns: state.patterns,
                hideMatches: state.hideMatches,
            };
            const index = newState.patterns.findIndex((p) => p.id === patternId);
            newState.patterns[index].enabled = event.target.checked;
            chrome.storage.sync.set(newState);
            sendMessage({
                action: "toggle-pattern", // TODO: change this to toggle pattern
                id: patternId,
            });
            return newState;
        });
        // event.preventDefault();
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
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.patterns.map((pattern) => (
                                <TableRow key={pattern.id}>
                                    <TableCell>
                                        <Checkbox
                                            checked={pattern.enabled}
                                            onChange={(event) =>
                                                this.handleEnableClick(event, pattern.id)
                                            }
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {pattern.text}
                                    </TableCell>
                                    <TableCell align="right">{pattern.hits}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={() => this.handleDeleteClick(pattern.id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
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
