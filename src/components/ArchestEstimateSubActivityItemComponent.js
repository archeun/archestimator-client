import React, {Component} from "react";
import {Col, Form, Row, Button} from "react-bootstrap";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";

class ArchestEstimateSubActivityItemComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            parentActivityId: this.props.subActivity.parent_id,
            subActivityId: this.props.subActivity.id,
            subActivityName: this.props.subActivity.name,
            subActivityEstimatedTime: this.props.subActivity.estimated_time,
        };
        this.saveSubActivityData = this.saveSubActivityData.bind(this);
        this.handleSubActivityFormFieldChange = this.handleSubActivityFormFieldChange.bind(this);
    }

    saveSubActivityData() {
        let subActivityId = this.state.subActivityId;

        if (typeof subActivityId !== 'number' && subActivityId.startsWith('new_sub_activity_')) {

            ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/sub_activities/", {
                parent_id: this.state.parentActivityId,
                name: this.state.subActivityName,
                estimated_time: this.state.subActivityEstimatedTime,
            }).then(function (response) {

            }).catch(function (error) {
                console.log(error);
            });

        } else {

            ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/sub_activities/" + this.state.subActivityId + "/", {
                name: this.state.subActivityName,
                estimated_time: this.state.subActivityEstimatedTime,
            }).then(function (response) {

            }).catch(function (error) {
                console.log(error);
            });

        }
    }

    handleSubActivityFormFieldChange(formElement) {
        this.setState({
            [formElement.target.name]: formElement.target.value,
        });
    }

    render() {
        return (
            <Row>
                <Col lg={10}>
                    <Form.Group controlId="activityForm.ActivityName">
                        <Form.Control size="sm"
                                      as="textarea"
                                      rows="1"
                                      placeholder="Sub Activity"
                                      value={this.state.subActivityName}
                                      name="subActivityName"
                                      onChange={this.handleSubActivityFormFieldChange}/>
                    </Form.Group>
                </Col>
                <Col lg={1}>
                    <Form.Group controlId="activityForm.ActivityName">
                        <Form.Control size="sm"
                                      type="number"
                                      placeholder="Hrs."
                                      defaultValue={this.state.subActivityEstimatedTime}
                                      name="subActivityEstimatedTime"
                                      onChange={this.handleSubActivityFormFieldChange}/>
                    </Form.Group>
                </Col>
                <Col lg={1}>
                    <Row>
                        <Col lg={1}>
                            <Button style={{'float': 'left'}} onClick={this.saveSubActivityData}
                                    size="sm"><span className="oi oi-check"/></Button>
                        </Col>
                        <Col lg={1}>
                            <Button style={{'marginLeft': '10px'}} variant="danger" size="sm"><span
                                className="oi oi-x"/></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default ArchestEstimateSubActivityItemComponent;
