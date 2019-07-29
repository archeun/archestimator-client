import React, {Component} from "react";
import {Container, Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";

const _ = require('lodash');

class PhaseEstimatesComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: false,
            phase: {},
            phaseEstimateList: [],
        };
    }

    componentDidMount() {

        const component = this;
        let phaseId = this.props.match.params.phaseId;

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/phases/' + phaseId + '/estimates/', {})
            .then(function (response) {
                component.setState({
                    phaseEstimateList: response.data.results
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/phases/' + phaseId + '/', {})
            .then(function (response) {
                component.setState({
                    phase: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {

        if (this.state.redirectTo) {
            return <Redirect push to={{
                pathname: this.state.redirectTo,
                state: {}
            }}
            />
        }

        const component = this;

        let phaseEstimateList = _.map(this.state.phaseEstimateList, (function (estimate) {
            return component.getPhaseEstimateInfoListItem(estimate);
        }));

        return (
            <ArchestAuthEnabledComponent>
                <Container style={{marginTop: '5%'}}>
                    <Row>
                        <Col sm={2}/>
                        <Col sm={8}>
                            <Card>
                                <Card.Header>
                                    Your Estimates for {this.state.phase.name}
                                    <OverlayTrigger key="edit" placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-top">Add New Estimate</Tooltip>
                                                    }>
                                        <Button style={{'float': 'right'}} variant="success" size="sm">
                                            <span className="oi oi-plus"/>
                                        </Button>
                                    </OverlayTrigger>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {phaseEstimateList}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col sm={2}/>
                    </Row>
                </Container>
            </ArchestAuthEnabledComponent>
        );
    }

    handleEstimateBtnClick(estimate, viewType) {
        this.setState({
            redirectTo: '/estimates/' + estimate.id + '/' + viewType
        });
    };

    getPhaseEstimateInfoListItem(estimate) {
        return (
            <ListGroup.Item key={estimate.id}>
                <div>
                    <h5 style={{'display': 'inline-block', 'maxWidth': '85%'}}>{estimate.name}</h5>
                    <OverlayTrigger key="view" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">View</Tooltip>
                                    }>
                        <Button onClick={this.handleEstimateBtnClick.bind(this, estimate, 'view')}
                                style={{'float': 'right', 'marginLeft': '10px'}} variant="outline-primary" size="sm">
                            <span className="oi oi-eye"/>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger key="edit" placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-top">Edit</Tooltip>
                                    }>
                        <Button style={{'float': 'right'}} variant="outline-primary" size="sm">
                            <span className="oi oi-pencil"/>
                        </Button>
                    </OverlayTrigger>
                </div>
                <Badge variant="info">{estimate.phase.project.name}</Badge>
                <span>&nbsp;</span>
                <Badge variant="success">{estimate.owner.full_name}</Badge>
            </ListGroup.Item>
        );
    }
}

export default PhaseEstimatesComponent;
