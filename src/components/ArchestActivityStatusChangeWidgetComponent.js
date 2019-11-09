import React, {Component} from "react";
import {BACKEND_ESTIMATOR_API_URL, SUB_ACTIVITY} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Form} from "react-bootstrap";
import './styles/ArchestActivityStatusChangeWidgetComponent.scss';

const _ = require('lodash');

class ArchestActivityStatusChangeWidgetComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: this.props.activity
        };
        this.onChangeStatus = this.onChangeStatus.bind(this);
    }

    onChangeStatus(element) {

        let urlActivityType = 'activities';
        if (this.props.type === SUB_ACTIVITY) {
            urlActivityType = 'sub_activities';
        }

        ArchestHttp.PATCH(`${BACKEND_ESTIMATOR_API_URL}/${urlActivityType}/${this.props.activity.id}/`, {
            status: element.target.value,
        }).then((response) => {
            this.setState({
                activity: response.data
            });
        }).catch((error) => {
            console.log(error);
        });
    }

    render() {
        return (
            <Form className="archest-activity-completion-widget-form">
                <Form.Group className="archest-activity-completion-widget-form-group"
                            controlId="activityCompletionWidgetForm.completeOptions">
                    <Form.Control as="select" size="sm" value={this.state.activity.status}
                                  onChange={this.onChangeStatus}>
                        <option value={''}/>
                        <option value={1}>Backlog</option>
                        <option value={2}>In Progress</option>
                        <option value={3}>Completed</option>
                        <option value={4}>On Hold</option>
                    </Form.Control>
                </Form.Group>
            </Form>
        );
    }

}

export default ArchestActivityStatusChangeWidgetComponent;