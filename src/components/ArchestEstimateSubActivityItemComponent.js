import React, {Component} from "react";
import {Col, Form, Row} from "react-bootstrap";

class ArchestEstimateSubActivityItemComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <Row>
                <Col lg={10}>
                    <Form.Group controlId="activityForm.ActivityName">
                        <Form.Control size="sm" as="textarea" rows="1"
                                      placeholder="Sub Activity" defaultValue={this.props.subActivity.name}/>
                    </Form.Group>
                </Col>
                <Col lg={2}>
                    <Form.Group controlId="activityForm.ActivityName">
                        <Form.Control size="sm" type="number" placeholder="Hrs."
                                      defaultValue={this.props.subActivity.estimated_time}/>
                    </Form.Group>
                </Col>
            </Row>
        );
    }
}

export default ArchestEstimateSubActivityItemComponent;
