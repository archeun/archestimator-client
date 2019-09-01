import React, {Component} from "react";
import {withRouter} from 'react-router-dom';
import {PATHS_WITH_NO_NAVBAR} from "../constants";
import {Navbar, Nav, OverlayTrigger, Tooltip} from "react-bootstrap";

const _ = require('lodash');

class NavbarComponent extends Component {

    render() {
        if (!_.includes(PATHS_WITH_NO_NAVBAR, this.props.location.pathname)) {
            return (
                <Navbar fixed="top" collapseOnSelect expand="sm" size="sm" bg="primary" variant="dark">
                    <Navbar.Brand href="/home">ARCHESTIMATOR</Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse>
                        <Nav className="mr-auto">
                            <Nav.Link href="/timeline">

                                <OverlayTrigger placement="right" overlay={<Tooltip>Work Timeline</Tooltip>}>
                                    <i className="material-icons archest-inline-icon">timeline</i>
                                </OverlayTrigger>

                            </Nav.Link>
                            <Nav.Link href="/calendar">

                                <OverlayTrigger placement="right" overlay={<Tooltip>Calendar</Tooltip>}>
                                    <i className="material-icons archest-inline-icon">date_range</i>
                                </OverlayTrigger>

                            </Nav.Link>
                        </Nav>
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
