import React, {Component} from "react";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import ArchestEstimateSubActivitiesComponent from "./ArchestEstimateSubActivitiesComponent";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";

class ArchestEstimateActivityComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityId: this.props.activity.id,
            featureId: this.props.activity.feature.id,
            activityName: this.props.activity.name,
            activityEstimatedTime: this.props.activity.estimated_time,
        };
        this.saveActivityData = this.saveActivityData.bind(this);
        this.deleteActivityData = this.deleteActivityData.bind(this);
        this.handleActivityFormFieldChange = this.handleActivityFormFieldChange.bind(this);
    }

    saveActivityData() {
        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/activities/" + this.state.activityId + "/", {
            name: this.state.activityName,
            feature_id: this.state.featureId,
            estimated_time: this.state.activityEstimatedTime,
        }).then(function (response) {

        }).catch(function (error) {
            console.log(error);
        });
    }

    deleteActivityData() {
        ArchestHttp.DELETE(BACKEND_ESTIMATOR_API_URL + "/activities/" + this.state.activityId + "/", {}).then(
            (response) => this.props.removeActivityItemHandler(this.state.activityId, response)
        ).catch(function (error) {
            console.log(error);
        });
    }

    handleActivityFormFieldChange(formElement) {
        this.setState({
            [formElement.target.name]: formElement.target.value,
        });
    }

    render() {
        const activityId = this.props.activity.id;

        let featureOptions = this.props.features.map(
            (feature) => <option value={feature.id} key={feature.id}>{feature.name}</option>
        );

        return (
            <Row style={{'marginBottom': '20px'}}>
                <Col>
                    <Card border="info" bg="light">
                        <Card.Body>

                            <Form className="archest-activity-form" id={"archest-activity-form-" + activityId}>
                                <Row>
                                    <Col>
                                        <Form.Group as={Row} controlId="activityForm.FeatureName">
                                            <Form.Label column lg="1">Feature</Form.Label>
                                            <Col lg="10">
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    value={this.state.featureId}
                                                    name="featureId"
                                                    onChange={this.handleActivityFormFieldChange}>
                                                    {featureOptions}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={1}>
                                        <Form.Label>Activity</Form.Label>
                                    </Col>
                                    <Col lg={9}>
                                        <Form.Group controlId="activityForm.ActivityName">
                                            <Form.Control as="textarea"
                                                          rows="1"
                                                          placeholder="Activity Name"
                                                          size="sm"
                                                          value={this.state.activityName}
                                                          name="activityName"
                                                          onChange={this.handleActivityFormFieldChange}/>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={1}>
                                        <Form.Group controlId="activityForm.ActivityName">
                                            <Form.Control type="number" placeholder="Hrs."
                                                          size="sm"
                                                          value={this.state.activityEstimatedTime}
                                                          name="activityEstimatedTime"
                                                          onChange={this.handleActivityFormFieldChange}/>
                                        </Form.Group>
                                    </Col>

                                    <Col lg="1">
                                        <Row>
                                            <Col lg="1">
                                                <Button style={{'marginLeft': '-18px'}} onClick={this.saveActivityData}
                                                        size="sm">
                                                    <span className="oi oi-check"/>
                                                </Button>
                                            </Col>
                                            <Col lg="1">
                                                <Button style={{'marginLeft': '-8px'}} onClick={this.deleteActivityData}
                                                        size="sm"
                                                        variant="danger">
                                                    <span className="oi oi-x"/>
                                                </Button>
                                            </Col>
                                        </Row>
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
