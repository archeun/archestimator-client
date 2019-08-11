import React, {Component} from "react";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import ArchestEstimateSubActivityItemComponent from "./ArchestEstimateSubActivityItemComponent";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";

const _ = require('lodash');

class ArchestEstimateSubActivitiesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: this.props.activity,
            subActivities: this.props.subActivities,
            newlyAddedSubActivityCount: 0,
            savingData: false
        };
        this.removeSubActivityItem = this.removeSubActivityItem.bind(this);
        this.saveSubActivityItemCallback = this.saveSubActivityItemCallback.bind(this);

    }

    removeSubActivityItem = function (removedSubActivityId, response) {
        //TODO: Refactor this function to have proper constants and validations
        if (response.status === 204) {
            this.setState(function (prevState) {
                _.remove(prevState.subActivities, {id: removedSubActivityId});
                return {subActivities: prevState.subActivities}
            });
        }
    };

    saveSubActivityItemCallback = function (savedSubActivityId, savedSubActivityData) {
        this.setState({savingData: true});

        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/sub_activities/" + savedSubActivityId + "/", savedSubActivityData).then(
            function (response) {

            }).catch(
            function (error) {
                console.log(error);
            }).finally(
            () => {
                this.setState({savingData: false});
            }
        );
    };

    render() {

        let component = this;

        let subActivities = this.state.subActivities.map(
            (subActivity) => <ArchestEstimateSubActivityItemComponent
                key={subActivity.id}
                subActivity={subActivity}
                removeSubActivityItemHandler={this.removeSubActivityItem}
                saveSubActivityItemCallback={this.saveSubActivityItemCallback}/>
        );

        let addSubActivityItem = function () {

            ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/sub_activities/", {
                parent_id: component.state.activity.id,
                name: '',
                estimated_time: 0,
                status: 1,
            }).then(function (response) {
                component.setState(prevState => ({
                    subActivities: [...prevState.subActivities, response.data]
                }));
            }).catch(function (error) {
                console.log(error);
            });
        };

        return (
            <Card border="light" bg="light">
                <Card.Header className="archest-activity-sub-activities-card-heading">
                    <Row>
                        <Col lg="11">
                            Sub Activities
                        </Col>
                        <Col lg={1} hidden={!this.state.savingData}>
                            <span style={{'fontSize': '0.8rem'}}>Saving </span>
                            <Spinner animation="grow" size="sm" style={{'marginTop': '-10px', 'marginLeft' : '-5px'}}/>
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className="archest-activity-sub-activities-card-body">
                    {subActivities}
                    <Row>
                        <Col>
                            <Button onClick={addSubActivityItem} variant="link" size="sm">
                                <span className="oi oi-plus"/>&nbsp;&nbsp;
                                <span>Add Sub Activity</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}

export default ArchestEstimateSubActivitiesComponent;
