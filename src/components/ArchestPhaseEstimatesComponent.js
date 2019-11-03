import React, {Component} from "react";
import {Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import './styles/ArchestPhaseEstimatesComponent.scss';
import ArchestEstimateShareModalComponent from "./ArchestEstimateShareModalComponent";

const _ = require('lodash');

class ArchestPhaseEstimatesComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            redirectTo: false,
            phase: {},
            phaseEstimateList: [],
            modalProps: {},
            breadcrumbs: [],
            shareEstimateModalProps: {
                show: false
            }
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
                const phase = response.data;
                component.setState({
                    phase: phase,
                    breadcrumbs: [
                        {title: 'Home', url: '/'},
                        {title: phase.name, url: '#', active: true},
                    ]
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

    showShareEstimateModal(estimatedId, estimateOwner) {
        this.setState({
            shareEstimateModalProps: {
                show: true,
                estimateId: estimatedId,
                estimateOwner: estimateOwner,
                onCancel: () => {
                    this.setState({
                        shareEstimateModalProps: {
                            show: false,
                            estimateId: estimatedId,
                            estimateOwner: estimateOwner,
                        }
                    });
                }
            }
        });
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
                <ArchestMainContainerComponent modalProps={this.state.modalProps} breadcrumbs={this.state.breadcrumbs}>
                    <ArchestEstimateShareModalComponent
                        show={this.state.shareEstimateModalProps.show}
                        estimateData={{
                            phaseId: this.state.phase.id,
                            estimateId: this.state.shareEstimateModalProps.estimateId,
                            estimateOwner: this.state.shareEstimateModalProps.estimateOwner
                        }}
                        onCancel={this.state.shareEstimateModalProps.onCancel}
                    />
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
                <Col>
                    <Row>
                        <Col sm={9}>
                            <p style={{}}>{estimate.name}</p>
                        </Col>
                        <Col sm={3}>
                            <Row className="archest-phase-estimates-icons-row">
                                <Col sm={2}>

                                    <OverlayTrigger key="progress" placement="top"
                                                    overlay={<Tooltip>Progress</Tooltip>}>
                                        <i onClick={() => this.handleEstimateNavigationBtnClick(estimate, 'progress')}
                                           className="material-icons md-18 archest-phase-estimates-icon">view_list</i>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm={2}>

                                    <OverlayTrigger key="view" placement="top" overlay={<Tooltip>Sheet View</Tooltip>}>
                                        <i onClick={() => this.handleEstimateNavigationBtnClick(estimate, 'view')}
                                           className="material-icons md-18 archest-phase-estimates-icon">grid_on</i>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm={2}>

                                    <OverlayTrigger key="edit" placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                        <i onClick={() => this.handleEstimateNavigationBtnClick(estimate, 'edit')}
                                           className="material-icons md-18 archest-phase-estimates-icon">edit</i>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm={2}>
                                    <OverlayTrigger key="share" placement="top" overlay={<Tooltip>Share</Tooltip>}>
                                        <i onClick={() => this.showShareEstimateModal(estimate.id, estimate.owner)}
                                           className="material-icons md-18 archest-phase-estimates-icon">folder_shared</i>
                                    </OverlayTrigger>
                                </Col>
                                <Col sm={2}>
                                    <OverlayTrigger key="delete" placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                        <i onClick={() => this.showDeleteEstimateModal(estimate.id)}
                                           className="material-icons md-18 archest-phase-estimates-icon">delete</i>
                                    </OverlayTrigger>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={12}>
                            <Badge variant="success">{estimate.owner.full_name}</Badge>
                        </Col>
                    </Row>
                </Col>
            </ListGroup.Item>
        );
    }
}

export default ArchestPhaseEstimatesComponent;
