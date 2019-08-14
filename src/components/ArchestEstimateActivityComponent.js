import React, {Component} from "react";
import {Button, Card, Col, Form, Row, Dropdown, Spinner, Modal} from "react-bootstrap";
import ArchestEstimateSubActivitiesComponent from "./ArchestEstimateSubActivitiesComponent";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import './styles/ArchestEstimateActivityComponent.scss'


class ArchestEstimateActivityComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityId: this.props.activity.id,
            featureId: this.props.activity.feature.id,
            activityStatus: this.props.activity.status,
            activityName: this.props.activity.name,
            activityEstimatedTime: this.props.activity.estimated_time,
            savingData: false,
            showDeleteActivityModal: false
        };
        this.saveActivityData = this.saveActivityData.bind(this);
        this.deleteActivityData = this.deleteActivityData.bind(this);
        this.handleActivityFormFieldChange = this.handleActivityFormFieldChange.bind(this);
        this.showDeleteActivityModal = this.showDeleteActivityModal.bind(this);
        this.hideDeleteActivityModal = this.hideDeleteActivityModal.bind(this);
    }

    saveActivityData() {
        this.setState({
            savingData: true
        });
        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/activities/" + this.state.activityId + "/", {
            name: this.state.activityName,
            feature_id: this.state.featureId,
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
            [formElement.target.name]: formElement.target.value,
        }, () => {
            if (changedFormElement.type === 'select-one') {
                changedFormElement.blur();
            }
        });
    }

    showDeleteActivityModal() {
        this.setState({showDeleteActivityModal: true});
    }

    hideDeleteActivityModal() {
        this.setState({showDeleteActivityModal: false});
    }

    render() {
        const activityId = this.props.activity.id;

        let featureOptions = this.props.features.map(
            (feature) => <option value={feature.id} key={feature.id}>{feature.name}</option>
        );

        let activityStatusOptions = this.props.activity.STATUS_CHOICES.map(
            (status_choice) => {
                return <option value={status_choice[0]} key={status_choice[0]}>{status_choice[1]}</option>
            }
        );

        return (
            <Row className="archest-activity-container-row">
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
                    <Card border="info" bg="light">
                        <Card.Body className="archest-activity-card-body">

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
                                        <Form.Group as={Row} controlId="activityForm.FeatureName"
                                                    className="archest-activity-feature-name-form-group">
                                            <Col>
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    value={this.state.featureId}
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
                                                <Dropdown>
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
                                    <Col lg={1}>
                                        <Form.Label className="archest-activity-estimated-time-label">Hrs.</Form.Label>
                                    </Col>
                                    <Col lg={1}>
                                        <Form.Label className="archest-activity-status-label">Status</Form.Label>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={9}>
                                        <Form.Group controlId="activityForm.ActivityName">
                                            <Form.Control as="textarea"
                                                          rows="1"
                                                          placeholder="Activity Name"
                                                          size="sm"
                                                          value={this.state.activityName}
                                                          name="activityName"
                                                          onChange={this.handleActivityFormFieldChange}
                                                          onBlur={this.saveActivityData}/>
                                        </Form.Group>
                                    </Col>

                                    <Col lg={1}>
                                        <Form.Group controlId="activityForm.ActivityEstimatedTime"
                                                    className="archest-activity-estimated-time-form-group">
                                            <Form.Control type="number"
                                                          placeholder="Hrs."
                                                          size="sm"
                                                          value={this.state.activityEstimatedTime}
                                                          name="activityEstimatedTime"
                                                          onChange={this.handleActivityFormFieldChange}
                                                          onBlur={this.saveActivityData}/>
                                        </Form.Group>
                                    </Col>

                                    <Col lg="2">
                                        <Form.Group as={Row} controlId="activityForm.ActivityStatus"
                                                    className="archest-activity-status-form-group">
                                            <Col>
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    value={this.state.activityStatus}
                                                    name="activityStatus"
                                                    onChange={this.handleActivityFormFieldChange}
                                                    onBlur={this.saveActivityData}>
                                                    {activityStatusOptions}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <ArchestEstimateSubActivitiesComponent
                                    activity={this.props.activity}
                                    subActivities={this.props.activity.sub_activities}/>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }
}

export default ArchestEstimateActivityComponent;
