import React, {Component} from "react";
import {Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestAddPhaseModalComponent from "./ArchestAddPhaseModalComponent";

const _ = require('lodash');

class ArchestProjectPhasesComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phaseList: [],
            breadcrumbs: [],
            project: {},
            redirectTo: false,
            addPhaseModalProps: {
                show: false
            }
        };
        this.showAddPhaseModal = this.showAddPhaseModal.bind(this);
    }

    componentDidMount() {

        let projectId = this.props.match.params.projectId;

        let requestConfigs = [
            {
                name: 'project_phases',
                url: `${BACKEND_ESTIMATOR_API_URL}/projects/${projectId}/phases/`,
                params: {}
            },
            {
                name: 'project',
                url: `${BACKEND_ESTIMATOR_API_URL}/projects/${projectId}/`,
                params: {}
            },
        ];

        ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
            let project = responses.project.data;
            this.setState({
                phaseList: responses.project_phases.data.results,
                project: project,
                breadcrumbs: [
                    {title: 'Home', url: '/'},
                    {title: 'Projects', url: '/projects'},
                    {title: `Phases of ${project.name}`, url: '#', active: true},
                ]
            });
        });
    }

    showAddPhaseModal(estimatedId, estimateOwner) {
        this.setState({
            addPhaseModalProps: {
                show: true,
                project: this.state.project,
                onCancel: () => {
                    this.setState({
                        addPhaseModalProps: {
                            show: false,
                        }
                    });
                }
            }
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

        let phaseList = _.map(this.state.phaseList, (function (phase) {
            return component.getPhaseInfoListItem(phase);
        }));

        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent breadcrumbs={this.state.breadcrumbs}>
                    <ArchestAddPhaseModalComponent
                        show={this.state.addPhaseModalProps.show}
                        project={this.state.addPhaseModalProps.project}
                        onCancel={this.state.addPhaseModalProps.onCancel}
                    />
                    <Row>
                        <Col sm={3}/>
                        <Col sm={6}>
                            <Card>
                                <Card.Header>
                                    Your Phases of {this.state.project.name}
                                    <OverlayTrigger key="edit" placement="top"
                                                    overlay={
                                                        <Tooltip id="tooltip-top">
                                                            Add New Phase to {this.state.project.name}
                                                        </Tooltip>
                                                    }>
                                        <Button
                                            style={{'float': 'right'}}
                                            variant="success"
                                            size="sm"
                                            onClick={this.showAddPhaseModal}
                                        >
                                            <span className="oi oi-plus"/>
                                        </Button>
                                    </OverlayTrigger>
                                </Card.Header>
                                <ListGroup variant="flush">
                                    {phaseList}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col sm={3}/>
                    </Row>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }


    handleEstimateListBtnClick(phase) {
        this.setState({
            redirectTo: '/phase/' + phase.id + '/estimates/'
        });
    };

    getPhaseInfoListItem(phase) {
        let managersNames = _.map(phase.managers, (manager) => manager.full_name).join(', ');
        return (
            <ListGroup.Item key={phase.id}>
                <div>
                    <h5 style={{'display': 'inline-block'}}>{phase.name}</h5>
                    <OverlayTrigger key="right" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">
                                            Estimates
                                        </Tooltip>
                                    }>
                        <Button onClick={this.handleEstimateListBtnClick.bind(this, phase)}
                                style={{'float': 'right'}} variant="outline-primary" size="sm">
                            <span className="oi oi-excerpt"/>
                        </Button>
                    </OverlayTrigger>
                </div>
                <div>
                    <footer className="blockquote-footer">
                        From <cite>{phase.start_date}</cite> To <cite>{phase.end_date}.</cite> Managers: <cite>{managersNames}</cite>
                    </footer>
                </div>
                <Badge variant="info">{phase.project.customer.name}</Badge>
                <span> > </span>
                <Badge variant="success">{phase.project.name}</Badge>
            </ListGroup.Item>
        );
    }
}

export default ArchestProjectPhasesComponent;
