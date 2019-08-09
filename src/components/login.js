import React, {Component} from "react";
import {Button, FormGroup, FormControl, FormLabel, Card, Container, Row, Col} from "react-bootstrap";
import {BACKEND_API_BASE_URL} from "../constants";
import {Redirect} from "react-router-dom";
import ArchestHttp from "../modules/archest_http";
import ArchestAuth from "../modules/archest_auth";


class LoginComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: "",
            redirectTo: false
        };
    }

    validateForm() {
        return this.state.username.length > 0 && this.state.password.length > 0;
    }

    handleChange = event => {
        this.setState({
            [event.target.id]: event.target.value
        });
    };

    handleSubmit = event => {
        event.preventDefault();

        const loginComponent = this;

        ArchestHttp.POST(BACKEND_API_BASE_URL + '/api-token-auth/', {
            username: this.state.username,
            password: this.state.password
        }, false).then(function (response) {
            ArchestAuth.setToken(response.data.token);
            loginComponent.setState({
                redirectTo: 'home'
            });

        }).catch(function (error) {
            console.log(error);
        });
    };

    render() {

        if (ArchestAuth.getToken()) {
            return <Redirect to={
                {
                    pathname: "/home",
                    state: {}
                }
            }
            />
        }

        return (
            <Container>
                <Row>
                    <Col sm={4}/>
                    <Col sm={4}>
                        <Card>
                            <Card.Header>ArChEstimator</Card.Header>
                            <Card.Body>
                                <Card.Title>Login</Card.Title>
                                <form onSubmit={this.handleSubmit}>
                                    <FormGroup controlId="username" bssize="large">
                                        <FormLabel>Username</FormLabel>
                                        <FormControl
                                            autoFocus
                                            type="text"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                    <FormGroup controlId="password" bssize="large">
                                        <FormLabel>Password</FormLabel>
                                        <FormControl
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                            type="password"
                                        />
                                    </FormGroup>
                                    <Button
                                        block
                                        bssize="large"
                                        disabled={!this.validateForm()}
                                        type="submit"
                                    >
                                        Login
                                    </Button>
                                </form>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col sm={4}/>
                </Row>
            </Container>
        );
    }
}

export default LoginComponent;
