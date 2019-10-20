import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Modal, Button, Table, Dropdown, Form, Card, Row, Col} from "react-bootstrap";
import './styles/ArchestEstimateShareModalComponent.scss';

const _ = require('lodash');

class ArchestEstimateShareModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phaseResources: [],
            dataLoaded: false
        };
        this.onCancel = this.onCancel.bind(this);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return !this.state.dataLoaded;
    }

    onCancel() {
        this.setState((prevState) => {
            return {dataLoaded: false}
        }, this.props.onCancel);
    }

    render() {
        if (this.props.show) {
            let requestConfigs = [
                {
                    name: 'phaseResources',
                    url: `${BACKEND_ESTIMATOR_API_URL}/phases/${this.props.estimateData.phaseId}/resources/`,
                    params: {}
                },
            ];

            ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
                let phaseResources = responses.phaseResources.data.results;
                this.setState({
                    phaseResources: phaseResources,
                    dataLoaded: true
                });
            });
        }

        let estimateSharedResources = _.map(
            this.state.phaseResources,
            phaseResource => {
                return (
                    <Row key={phaseResource.id} className="archest-estimate-share-modal-resource-row">
                        <Col sm={10}>{phaseResource.full_name}</Col>
                        <Col sm={2}>
                            <Form>
                                <Form.Group className="archest-estimate-share-modal-resource-row-share-options-group" controlId="estimateShareForm.shareOptions">
                                    <Form.Control as="select" size="sm">
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
                        <Button size={'sm'} variant="primary" onClick={() => {
                        }}>Share</Button>
                    </Modal.Footer>
                </Modal>
            </ArchestAuthEnabledComponent>
        );
    }
}

export default ArchestEstimateShareModalComponent;