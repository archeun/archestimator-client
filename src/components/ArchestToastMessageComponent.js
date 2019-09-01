import React, {Component} from "react";
import {Button, OverlayTrigger, Toast, Tooltip} from "react-bootstrap";

class ArchestToastMessageComponent extends Component {

    render() {
        return <Toast
            style={{
                'position': 'fixed',
                'top': '80%',
                'marginLeft':'-6%',
                'zIndex': '999999'
            }}
        >
            <Toast.Header>
                Success
            </Toast.Header>
            <Toast.Body>Hello, world! This is a toast message asd asdasd asda sdasada sdads adasds.</Toast.Body>
        </Toast>
    }
}

export default ArchestToastMessageComponent;