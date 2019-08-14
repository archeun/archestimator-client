import React, {Component} from "react";
import {Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";

const _ = require('lodash');

class PhaseEstimatesComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: false,
            phase: {},
            phaseEstimateList: [],
            modalProps: {}
        };
        this.addNewEstimate = this.addNewEstimate.bind(this);
        this.showAddEstimateModal = this.showAddEstimateModal.bind(this);
        this.showDeleteEstimateModal = this.showDeleteEstimateModal.bind(this);
        this.deleteEstimate = this.deleteEstimate.bind(this);
        this.handleEstimateNavigationBtnClick = this.handleEstimateNavigationBtnClick.bind(this);
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

    addNewEstimate() {
        let phaseId = this.props.match.params.phaseId;
        const component = this;

        ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/estimates/", {
            phase_id: phaseId,
        }).then(function (response) {
            component.setState({
                modalProps: {show: false},
                redirectTo: '/estimates/' + response.data.id + '/edit'
            });
        }).catch(function (error) {
            component.setState({
                modalProps: {show: false},
            });
            console.log(error);
        });
    }

    showAddEstimateModal() {
        this.setState({
            modalProps: {
                show: true,
                onConfirm: this.addNewEstimate,
                message: 'Do you really want to create an Estimate for Phase - ' + this.state.phase.name,
                onCancel: () => {
                    this.setState({modalProps: {show: false}});
                }
            }
        })
    }

    showDeleteEstimateModal(estimateId) {
        this.setState({
            modalProps: {
                show: true,
                onConfirm: () => this.deleteEstimate(estimateId),
                message: 'Do you really want to delete this estimate?',
                onCancel: () => {
                    this.setState({modalProps: {show: false}});
                }
            }
        })
    }

    deleteEstimate(estimateId) {
        let component = this;

        ArchestHttp.DELETE(BACKEND_ESTIMATOR_API_URL + "/estimates/" + estimateId + '/', {}).then(function (response) {
            if (response.status === 204) {
                component.setState(function (prevState) {
                    _.remove(prevState.phaseEstimateList, {id: estimateId});
                    return {phaseEstimateList: prevState.phaseEstimateList, modalProps: {show: false}}
                });
            }
        }).catch(function (error) {
            console.log(error);
        });
    };

    handleEstimateNavigationBtnClick(estimate, viewType) {
        this.setState({
            redirectTo: '/estimates/' + estimate.id + '/' + viewType
        });
    };

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
                <ArchestMainContainerComponent modalProps={this.state.modalProps}>
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
                                        <Button
                                            style={{'float': 'right'}}
                                            variant="success"
                                            size="sm"
                                            onClick={this.showAddEstimateModal}
                                        >
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
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

    getPhaseEstimateInfoListItem(estimate) {
        return (
            <ListGroup.Item key={estimate.id}>
                <div>
                    <h5 style={{'display': 'inline-block', 'maxWidth': '80%'}}>{estimate.name}</h5>
                    <OverlayTrigger key="delete" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">Delete</Tooltip>
                                    }>
                        <Button onClick={() => this.showDeleteEstimateModal(estimate.id)}
                                style={{'float': 'right', 'marginLeft': '10px'}} variant="outline-danger" size="sm">
                            <span className="oi oi-x"/>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger key="view" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">View</Tooltip>
                                    }>
                        <Button onClick={() => this.handleEstimateNavigationBtnClick(estimate, 'view')}
                                style={{'float': 'right', 'marginLeft': '10px'}} variant="outline-primary" size="sm">
                            <span className="oi oi-eye"/>
                        </Button>
                    </OverlayTrigger>
                    <OverlayTrigger key="edit" placement="top"
                                    overlay={
                                        <Tooltip id="tooltip-top">Edit</Tooltip>
                                    }>
                        <Button onClick={() => this.handleEstimateNavigationBtnClick(estimate, 'edit')}
                                style={{'float': 'right'}} variant="outline-primary" size="sm">
                            <span className="oi oi-pencil"/>
                        </Button>
                    </OverlayTrigger>
                </div>
                <Badge variant="success">{estimate.owner.full_name}</Badge>
            </ListGroup.Item>
        );
    }
}

export default PhaseEstimatesComponent;
