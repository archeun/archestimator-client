import React, {Component} from "react";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import ArchestEstimateSubActivitiesComponent from "./ArchestEstimateSubActivitiesComponent";

class ArchestEstimateActivityComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {

        let featureOptions = this.props.features.map(
            (feature) => <option value={feature.id} key={feature.id}>{feature.name}</option>
        );

        return (
            <Row style={{'marginBottom': '20px'}}>
                <Col>
                    <Card border="info" bg="light">
                        <Card.Body>

                            <Form>
                                <Row>
                                    <Col>
                                        <Form.Group as={Row} controlId="activityForm.FeatureName">
                                            <Form.Label column sm="1">Feature</Form.Label>
                                            <Col sm="11">
                                                <Form.Control
                                                    size="sm"
                                                    as="select"
                                                    defaultValue={this.props.activity.feature.id}>
                                                    {featureOptions}
                                                </Form.Control>
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Form.Label column lg="1">Activity</Form.Label>
                                    <Col lg={9}>
                                        <Form.Group controlId="activityForm.ActivityName">
                                            <Form.Control as="textarea" rows="1" placeholder="Activity Name"
                                                          defaultValue={this.props.activity.name}/>
                                        </Form.Group>
                                    </Col>
                                    <Col lg={2}>
                                        <Form.Group controlId="activityForm.ActivityName">
                                            <Form.Control type="number" placeholder="Hrs."
                                                          defaultValue={this.props.activity.estimated_time}/>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <ArchestEstimateSubActivitiesComponent
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
