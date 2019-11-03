import React, {Component} from "react";
import {Button, Card, Col, Form, Row, Dropdown, Spinner, Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestEstimateSubActivitiesComponent from "./ArchestEstimateSubActivitiesComponent";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";

const _ = require('lodash');


class ArchestEstimateActivityComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityId: this.props.activity.id,
            featureId: this.props.activity.feature.id,
            activityStatus: this.props.activity.status,
            activityName: this.props.activity.name,
            ownerId: this.props.activity.owner ? this.props.activity.owner.id : '',
            activityEstimatedTime: this.props.activity.estimated_time,
            subActivityTotalHours: 0,
            savingData: false,
            showDeleteActivityModal: false
        };
        this.saveActivityData = this.saveActivityData.bind(this);
        this.deleteActivityData = this.deleteActivityData.bind(this);
        this.handleActivityFormFieldChange = this.handleActivityFormFieldChange.bind(this);
        this.showDeleteActivityModal = this.showDeleteActivityModal.bind(this);
        this.hideDeleteActivityModal = this.hideDeleteActivityModal.bind(this);
        this.subActivityChangeHandler = this.subActivityChangeHandler.bind(this);
        this.syncActivityHoursBySubActivityHours = this.syncActivityHoursBySubActivityHours.bind(this);
    }

    saveActivityData() {
        this.setState({
            savingData: true
        });
        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/activities/" + this.state.activityId + "/", {
            name: this.state.activityName,
            feature_id: this.state.featureId,
            owner_id: this.state.ownerId,
            estimated_time: this.state.activityEstimatedTime,
            status: this.state.activityStatus,
        }).then(function (response) {

        }).catch(function (error) {
            console.log(error);
        }).finally(() => {
            this.setState({
                savingData: false
            });
        });
    }

    deleteActivityData() {
        ArchestHttp.DELETE(BACKEND_ESTIMATOR_API_URL + "/activities/" + this.state.activityId + "/", {}).then(
            (response) => {
                this.setState({showDeleteActivityModal: false});
                this.props.removeActivityItemHandler(this.state.activityId, response);
            }
        ).catch(function (error) {
            console.log(error);
        });
    }

    handleActivityFormFieldChange(formElement) {
        const changedFormElement = formElement.target;
        this.setState({
            [changedFormElement.name]: this.getValidatedInput(changedFormElement),
        }, () => {
            if (changedFormElement.type === 'select-one') {
                changedFormElement.blur();
            }
        });
    }

    getValidatedInput(changedFormElement) {
        let validatedInput = changedFormElement.value;
        if (changedFormElement.name === 'activityEstimatedTime' && parseFloat(changedFormElement.value) < 0) {
            validatedInput = Math.abs(changedFormElement.value);
        }
        return validatedInput;
    }

    showDeleteActivityModal() {
        this.setState({showDeleteActivityModal: true});
    }

    hideDeleteActivityModal() {
        this.setState({showDeleteActivityModal: false});
    }

    subActivityChangeHandler(subActivities) {
        const subActivityTotalHours = _.reduce(subActivities, function (prev, curr, currentIndex, arr) {
            return parseFloat(prev) + (parseFloat(curr.estimated_time) ? parseFloat(curr.estimated_time) : 0);
        }, 0);
        this.setState({subActivityTotalHours: subActivityTotalHours});
    }

    syncActivityHoursBySubActivityHours() {
        const estimatedTimeElement = document.getElementById('activityForm.ActivityEstimatedTime_' + this.state.activityId);
        estimatedTimeElement.focus();
        this.setState(
            {activityEstimatedTime: this.state.subActivityTotalHours},
            () => estimatedTimeElement.blur()
        );
    }

    render() {
        const activityId = this.props.activity.id;

        let featureOptions = [];
        let resourcesOptions = [];

        if (this.props.features) {
            featureOptions = this.props.features.map(
                (feature) => <option value={feature.id} key={feature.id}>{feature.name}</option>
            );
        }

        if (this.props.estimateResources) {
            resourcesOptions = this.props.estimateResources.map(
                (estimateResource) => <option value={estimateResource.resource.id}
                                              key={estimateResource.resource.id}>{estimateResource.resource.full_name}</option>
            );
        }

        if (this.state.ownerId !== '') {
            let estimateResources = this.props.estimateResources.map((estimateResource) => parseInt(estimateResource.resource.id, 10));
            if (estimateResources.indexOf(parseInt(this.state.ownerId, 10)) === -1) {
                resourcesOptions.unshift(<option value={this.state.ownerId} key={this.state.ownerId}>{this.props.activity.owner.full_name}</option>);
            }
        }

        resourcesOptions.unshift(<option value={''} key={''}>{''}</option>);

        return (
            <Row className="archest-card-container-row">
                <Modal show={this.state.showDeleteActivityModal} onHide={this.hideDeleteActivityModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Do you really want to delete this Activity?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.hideDeleteActivityModal}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={this.deleteActivityData}>
                            Delete
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Col>
                    <Card className="archest-card">
                        <Card.Body className="archest-card-body">

                            <Form className="archest-activity-form" id={"archest-activity-form-" + activityId}>
                                <Row>
                                    <Col lg={10}>
                                        <Form.Label>Feature</Form.Label>
                                    </Col>
                                    <Col lg={2} hidden={!this.state.savingData}>
                                        <span style={{'fontSize': '0.8rem'}}>Saving ... </span>
                                        <Spinner animation="grow" size="sm" style={{'marginTop': '-10px'}}/>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg="11">
                                        <Form.Group as={Row}
                                                    controlId={'activityForm.ActivityFeatureId_' + this.state.activityId}
                                                    className="archest-activity-feature-name-form-group">
                                            <Col>
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    value={this.state.featureId}
                                                    disabled={!this.props.activity.is_editable}
                                                    name="featureId"
                                                    onChange={this.handleActivityFormFieldChange}
                                                    onBlur={this.saveActivityData}>
                                                    {featureOptions}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col lg="1">
                                        <Row>
                                            <Col lg="1">
                                                <Dropdown hidden={!this.props.activity.is_editable}>
                                                    <Dropdown.Toggle variant="link"
                                                                     className="archest-activity-settings-dropdown"
                                                                     size="sm">
                                                        <span className='oi oi-cog'/>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        <Dropdown.Item
                                                            onClick={this.showDeleteActivityModal}>Delete</Dropdown.Item>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={9}>
                                        <Form.Label>Activity</Form.Label>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Label id="archest-activity-owner-label">Owner</Form.Label>
                                    </Col>
                                    <Col lg={1}>
                                        <Form.Label className="archest-activity-estimated-time-label">
                                            Hrs.
                                        </Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={9}>
                                        <Form.Group controlId={'activityForm.ActivityName_' + this.state.activityId}
                                                    className="archest-activity-name-form-group">
                                            <Form.Control as="textarea"
                                                          rows="1"
                                                          placeholder="Activity Name"
                                                          size="sm"
                                                          disabled={!this.props.activity.is_editable}
                                                          value={this.state.activityName}
                                                          name="activityName"
                                                          onChange={this.handleActivityFormFieldChange}
                                                          onBlur={this.saveActivityData}/>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group as={Row}
                                                    controlId={'activityForm.ActivityOwnerId_' + this.state.ownerId}
                                                    className="archest-activity-owner-name-form-group">
                                            <Col>
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    value={this.state.ownerId}
                                                    disabled={!this.props.activity.is_editable}
                                                    name="ownerId"
                                                    onChange={this.handleActivityFormFieldChange}
                                                    onBlur={this.saveActivityData}>
                                                    {resourcesOptions}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={1}>
                                        <Row>
                                            <Form.Group
                                                controlId={'activityForm.ActivityEstimatedTime_' + this.state.activityId}
                                                className="archest-activity-estimated-time-form-group">
                                                <Form.Control type="number"
                                                              placeholder="Hrs."
                                                              size="sm"
                                                              value={this.state.activityEstimatedTime}
                                                              disabled={!this.props.activity.is_editable}
                                                              name="activityEstimatedTime"
                                                              onChange={this.handleActivityFormFieldChange}
                                                              onBlur={this.saveActivityData}/>
                                            </Form.Group>
                                            <OverlayTrigger key={this.state.activityName} placement="top"
                                                            overlay={<Tooltip>Auto calculate from Sub Activity
                                                                Hours</Tooltip>}>
                                                <i className="material-icons archest-activity-estimated-time-sync-icon"
                                                   hidden={!this.props.activity.is_editable}
                                                   onClick={this.syncActivityHoursBySubActivityHours}
                                                >
                                                    sync
                                                </i>
                                            </OverlayTrigger>
                                        </Row>
                                    </Col>
                                </Row>
                                <ArchestEstimateSubActivitiesComponent
                                    activity={this.props.activity}
                                    subActivities={this.props.activity.sub_activities}
                                    subActivityChangeHandler={this.subActivityChangeHandler}
                                    subActivityTotalHours={this.state.subActivityTotalHours}
                                    estimateResources={this.props.estimateResources}
                                />
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default ArchestEstimateActivityComponent;
