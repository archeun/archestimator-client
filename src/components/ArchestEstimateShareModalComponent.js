import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Modal, Button, Form, Card, Row, Col} from "react-bootstrap";
import './styles/ArchestEstimateShareModalComponent.scss';

const _ = require('lodash');

class ArchestEstimateShareModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phaseResources: [],
            dataLoaded: false,
            resourceSharingOptions: []
        };
        this.onCancel = this.onCancel.bind(this);
        this.onChangeShareOption = this.onChangeShareOption.bind(this);
        this.shareEstimate = this.shareEstimate.bind(this);
    }

    onCancel() {
        this.props.onCancel();
        this.setState((prevState) => {
            return {dataLoaded: false}
        });
    }

    shareEstimate() {
        ArchestHttp.PATCH(
            `${BACKEND_ESTIMATOR_API_URL}/estimates/${this.props.estimateData.estimateId}/shared_resources/`,
            this.state.resourceSharingOptions
        ).then((response) => {
            this.onCancel();
        });
    }

    onChangeShareOption(optionSelectElement, resourceId) {
        let selectedShareOption = optionSelectElement.target.value;

        this.setState(function (prevState) {
            let sharingOptions = prevState.resourceSharingOptions;

            if (sharingOptions[resourceId] && selectedShareOption === '0') {
                delete sharingOptions[resourceId];
            } else {
                sharingOptions[resourceId] = selectedShareOption;
            }

            return {resourceSharingOptions: sharingOptions};
        });
    }

    render() {
        if (this.props.show && !this.state.dataLoaded) {
            let requestConfigs = [
                {
                    name: 'phaseResources',
                    url: `${BACKEND_ESTIMATOR_API_URL}/phases/${this.props.estimateData.phaseId}/resources/`,
                    params: {}
                },
                {
                    name: 'estimateResources',
                    url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${this.props.estimateData.estimateId}/shared_resources/`,
                    params: {}
                },
            ];

            ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
                let phaseResources = responses.phaseResources.data.results;
                let estimateResources = responses.estimateResources.data.results;
                let resourceSharingOptions = {};

                for (let i = 0; i < estimateResources.length; i++) {
                    resourceSharingOptions[estimateResources[i].resource.id] = estimateResources[i].access_level;
                }


                for (let i = 0; i < phaseResources.length; i++) {
                    phaseResources[i]['sharedOption'] = 0;
                    if (resourceSharingOptions[phaseResources[i]['id']]) {
                        phaseResources[i]['sharedOption'] = resourceSharingOptions[phaseResources[i]['id']];
                    }
                }

                this.setState({
                    phaseResources: phaseResources,
                    resourceSharingOptions: resourceSharingOptions,
                    dataLoaded: true
                });
            });
        }

        let estimateSharedResources = _.map(
            this.state.phaseResources,
            phaseResource => {
                let sharedOption = 0;
                if (this.state.resourceSharingOptions[phaseResource.id]) {
                    sharedOption = this.state.resourceSharingOptions[phaseResource.id];
                }

                return (
                    <Row key={phaseResource.id} className="archest-estimate-share-modal-resource-row">
                        <Col sm={10}>{phaseResource.full_name}</Col>
                        <Col sm={2}>
                            <Form>
                                <Form.Group className="archest-estimate-share-modal-resource-row-share-options-group"
                                            controlId="estimateShareForm.shareOptions">
                                    <Form.Control as="select" size="sm" value={sharedOption}
                                                  onChange={(element) => this.onChangeShareOption(element, phaseResource.id)}>
                                        <option value={0}/>
                                        <option value={1}>View</option>
                                        <option value={2}>Edit</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                );
            }
        );

        return (
            <ArchestAuthEnabledComponent>
                <Modal show={this.props.show} onHide={this.onCancel}>
                    <Modal.Header closeButton className="archest-estimate-share-modal-header">
                        <Modal.Title className="archest-estimate-share-modal-title">Share Estimate</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="archest-estimate-share-modal-body">
                        <Card className="archest-card archest-estimate-share-modal-card">
                            <Card.Body className="archest-card-body">
                                <Row className="archest-estimate-share-modal-headings">
                                    <Col sm={10}>Name</Col>
                                    <Col sm={2}>Options</Col>
                                </Row>
                                <hr/>
                                {estimateSharedResources}
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer className="archest-estimate-share-modal-footer">
                        <Button size={'sm'} variant="secondary" onClick={this.onCancel}>Cancel</Button>
                        <Button size={'sm'} variant="primary" onClick={this.shareEstimate}>Share</Button>
                    </Modal.Footer>
                </Modal>
            </ArchestAuthEnabledComponent>
        );
    }
}

export default ArchestEstimateShareModalComponent;