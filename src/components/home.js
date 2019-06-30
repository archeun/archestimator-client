import React, {Component} from "react";
import {LOCAL_STORAGE_TOKEN_KEY} from "../constants";
import {Redirect} from "react-router-dom";
import {Container, Row, Col, Card, ListGroup} from "react-bootstrap";


class HomeComponent extends Component {

    render() {
        let token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);

        if (!token) {
            return <Redirect
                to={{
                    pathname: "/login",
                    state: {}
                }}
            />
        }
        return (
            <Container style={{marginTop: '5%'}}>
                <Row>
                    <Col sm={3}/>
                    <Col sm={6}>
                        <Card>
                            <Card.Header>Your Project Phases</Card.Header>
                            <ListGroup variant="flush">
                                <ListGroup.Item>Citadel - 5.0</ListGroup.Item>
                                <ListGroup.Item>Citadel - 5.1</ListGroup.Item>
                                <ListGroup.Item>Citadel - 5.2</ListGroup.Item>
                                <ListGroup.Item>Citadel - 5.3</ListGroup.Item>
                                <ListGroup.Item>Citadel - 5.4</ListGroup.Item>
                                <ListGroup.Item>Citadel - 6.0</ListGroup.Item>
                            </ListGroup>
                        </Card>
                    </Col>
                    <Col sm={3}/>
                </Row>
            </Container>
        );
    }
}

export default HomeComponent;
