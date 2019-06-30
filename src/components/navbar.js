import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {PATHS_WITH_NO_NAVBAR} from "../constants";
import {Navbar, Nav} from "react-bootstrap";

const _ = require('lodash');

class NavbarComponent extends Component {

    render() {
        if (!_.includes(PATHS_WITH_NO_NAVBAR, this.props.location.pathname)) {
            return (
                <Navbar collapseOnSelect expand="lg" bg="primary" variant="dark">
                    <Navbar.Brand href="/home">ArChEstimator</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto"/>
                        <Nav>
                            <Nav.Link href="/logout">Logout</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            );
        }
        return (<div/>);
    }
}

export default withRouter(NavbarComponent);
