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
            savingData: false,
            subActivityDataStore: {}
        };

        for (let i = 0; i < this.props.subActivities.length; i++) {
            this.state.subActivityDataStore[this.props.subActivities[i].id] = {
                name: this.props.subActivities[i].name,
                estimated_time: this.props.subActivities[i].estimated_time,
            };
        }
        this.removeSubActivityItem = this.removeSubActivityItem.bind(this);
        this.saveSubActivityItemCallback = this.saveSubActivityItemCallback.bind(this);
        this.subActivityChangeHandler = this.subActivityChangeHandler.bind(this);
        this.props.subActivityChangeHandler(this.state.subActivityDataStore)
    }

    removeSubActivityItem = function (removedSubActivityId, response) {
        //TODO: Refactor this function to have proper constants and validations
        if (response.status === 204) {
            this.setState(function (prevState) {
                _.remove(prevState.subActivities, {id: removedSubActivityId});
                delete prevState.subActivityDataStore[removedSubActivityId];
                return {subActivities: prevState.subActivities, subActivityDataStore: prevState.subActivityDataStore}
            }, () => this.props.subActivityChangeHandler(this.state.subActivityDataStore));
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

    subActivityChangeHandler(subActivityData) {
        this.setState(function (prevState) {
            prevState.subActivityDataStore[subActivityData.subActivityId] = {
                name: subActivityData.subActivityName,
                estimated_time: subActivityData.subActivityEstimatedTime,
            };
            return {subActivities: prevState.subActivities, subActivityDataStore: prevState.subActivityDataStore}
        }, () => this.props.subActivityChangeHandler(this.state.subActivityDataStore));
    }

    render() {

        let component = this;

        let subActivities = this.state.subActivities.map(
            (subActivity) => <ArchestEstimateSubActivityItemComponent
                key={subActivity.id}
                subActivity={subActivity}
                removeSubActivityItemHandler={this.removeSubActivityItem}
                saveSubActivityItemCallback={this.saveSubActivityItemCallback}
                subActivityChangeHandler={this.subActivityChangeHandler}
            />
        );

        let addSubActivityItem = function () {

            ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/sub_activities/", {
                parent_id: component.state.activity.id,
                name: '',
                estimated_time: 0,
                status: 1,
            }).then(function (response) {
                component.setState(function (prevState) {
                    prevState.subActivityDataStore[response.data.id] = {
                        name: response.data.name,
                        estimated_time: response.data.estimated_time,
                    };
                    return {
                        subActivities: [...prevState.subActivities, response.data],
                        subActivityDataStore: prevState.subActivityDataStore
                    }
                }, () => component.props.subActivityChangeHandler(component.state.subActivityDataStore));
            }).catch(function (error) {
                console.log(error);
            });
        };

        return (
            <Card border="light" bg="light" className="archest-activity-sub-activities-card">
                <Card.Header className="archest-activity-sub-activities-card-heading">
                    <Row>
                        <Col lg="9">
                            <div className="archest-activity-sub-activities-card-heading-title-container">
                                <i className="material-icons archest-activity-sub-activities-card-heading-icon">toc</i>
                                <span>Sub Activities</span>
                                <div className="archest-activity-sub-activities-save-loading-icon-container"
                                     hidden={!this.state.savingData}>
                                    <span
                                        className="archest-activity-sub-activities-save-loading-icon-text">Saving </span>
                                    <Spinner className="archest-activity-sub-activities-save-loading-icon"
                                             animation="grow" size="sm"/>
                                </div>
                            </div>
                        </Col>
                        <Col lg={3}>
                            <div className="archest-activity-sub-activities-card-heading-total-time-container">
                                <i className="material-icons archest-activity-sub-activities-card-heading-icon">av_timer</i>
                                <span>{this.props.subActivityTotalHours} Hours</span>
                            </div>
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
