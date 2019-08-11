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
            subActivityStatus: this.props.subActivity.status,
            subActivityName: this.props.subActivity.name,
            subActivityEstimatedTime: this.props.subActivity.estimated_time,
        };
        this.saveSubActivityData = this.saveSubActivityData.bind(this);
        this.deleteSubActivityActivityItem = this.deleteSubActivityActivityItem.bind(this);
        this.handleSubActivityFormFieldChange = this.handleSubActivityFormFieldChange.bind(this);
    }

    saveSubActivityData() {
        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/sub_activities/" + this.state.subActivityId + "/", {
            name: this.state.subActivityName,
            estimated_time: this.state.subActivityEstimatedTime,
            status: this.state.subActivityStatus,
        }).then(function (response) {

        }).catch(function (error) {
            console.log(error);
        });
    }

    handleSubActivityFormFieldChange(formElement) {
        this.setState({
            [formElement.target.name]: formElement.target.value,
        });
    }

    deleteSubActivityActivityItem() {
        ArchestHttp.DELETE(BACKEND_ESTIMATOR_API_URL + "/sub_activities/" + this.state.subActivityId + "/", {}).then(
            (response) => this.props.removeSubActivityItemHandler(this.state.subActivityId, response)
        ).catch(function (error) {
            console.error(error);
        });
    }

    render() {

        let subActivityStatusOptions = this.props.subActivity.STATUS_CHOICES.map(
            (status_choice) => {
                return <option value={status_choice[0]} key={status_choice[0]}>{status_choice[1]}</option>
            }
        );

        return (
            <Row>
                <Col lg={8}>
                    <Form.Group controlId="subActivityForm.ActivityName"
                                className="archest-sub-activity-item-activity-name-form-group">
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
                    <Form.Group controlId="subActivityForm.ActivityName"
                                className="archest-sub-activity-item-activity-estimated-time-form-group">
                        <Form.Control size="sm"
                                      type="number"
                                      placeholder="Hrs."
                                      defaultValue={this.state.subActivityEstimatedTime}
                                      name="subActivityEstimatedTime"
                                      onChange={this.handleSubActivityFormFieldChange}/>
                    </Form.Group>
                </Col>
                <Col lg={2}>
                    <Form.Group controlId="subActivityForm.ActivityStatus"
                                className="archest-sub-activity-item-activity-status-form-group">
                        <Form.Control
                            size="sm"
                            as="select"
                            value={this.state.activityStatus}
                            name="activityStatus"
                            onChange={this.handleActivityFormFieldChange}>
                            {subActivityStatusOptions}
                        </Form.Control>
                    </Form.Group>
                </Col>
                <Col lg={1}>
                    <Row>
                        {/*<Col lg={1}>*/}
                        {/*<Button style={{'float': 'left'}} onClick={this.saveSubActivityData}*/}
                        {/*size="sm"><span className="oi oi-check"/></Button>*/}
                        {/*</Col>*/}
                        <Col lg={1}>
                            <Button className="archest-sub-activity-item-delete-btn"
                                    onClick={this.deleteSubActivityActivityItem}
                                    variant="danger" size="sm">
                                <span className="oi oi-x"/></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        );
    }
}

export default ArchestEstimateSubActivityItemComponent;
