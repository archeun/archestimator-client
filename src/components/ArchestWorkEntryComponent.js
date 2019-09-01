import React, {Component} from "react";
import {Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";

const _ = require('lodash');
var moment = require('moment');


class ArchestWorkEntryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    getGenericWorkEntryData(workEntry) {
        let activityStatus = '';

        if (workEntry.activity) {
            activityStatus = workEntry.activity.STATUS_CHOICES[
                _.findIndex(
                    workEntry.activity.STATUS_CHOICES,
                    (o) => o[0] === workEntry.activity.status)
                ][1];
        } else {
            activityStatus = workEntry.sub_activity.STATUS_CHOICES[
                _.findIndex(
                    workEntry.sub_activity.STATUS_CHOICES,
                    (o) => o[0] === workEntry.sub_activity.status)
                ][1];
        }

        return {
            workEntryType: workEntry.workEntryType,
            id: workEntry.id,
            estimateId: workEntry.activity ? workEntry.activity.estimate.id : workEntry.sub_activity.estimate_id,
            estimateName: workEntry.activity ? workEntry.activity.estimate.name : workEntry.sub_activity.estimate_name,
            activityId: workEntry.activity ? workEntry.activity.id : workEntry.sub_activity.parent_activity_id,
            activityName: workEntry.activity ? workEntry.activity.name : workEntry.sub_activity.parent_activity_name,
            activityStatus: activityStatus,
            activityEstimatedTime: workEntry.activity ? workEntry.activity.estimated_time : workEntry.sub_activity.estimated_time,
            subActivityId: workEntry.sub_activity ? workEntry.sub_activity.id : '',
            subActivityName: workEntry.sub_activity ? workEntry.sub_activity.name : false,
            featureName: workEntry.activity ? workEntry.activity.feature.name : workEntry.sub_activity.feature_name,
            note: workEntry.note,
            worked_hours: workEntry.worked_hours,
            date: workEntry.date,
        };
    }

    render() {
        const workEntry = this.getGenericWorkEntryData(this.props.workEntry);
        return (
            <Row className="archest-card-container-row">
                <Col>
                    <Card className="archest-card">
                        <Card.Body className="archest-card-body">
                            <Row>
                                <Col lg={2} className="archest-timeline-we-date-hours-col">
                                    <div className="archest-timeline-we-worked-hrs-container">
                                        <div className="archest-timeline-we-worked-hrs">
                                            {workEntry.worked_hours}
                                        </div>
                                        <div className="archest-timeline-we-worked-hrs-label">
                                            Hrs
                                        </div>
                                    </div>
                                    <div className="archest-timeline-we-date">
                                        {moment(workEntry.date, "YYYY-MM-DD").format('DD MMM')}
                                    </div>
                                </Col>
                                <Col lg={10} className="archest-timeline-we-info-container">
                                    <Row hidden={!workEntry.subActivityName}>
                                        <Col lg={12} className="archest-timeline-we-parent-activity-name">
                                            {workEntry.activityName}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={9} className="archest-timeline-we-activity-name">
                                            {workEntry.subActivityName ? workEntry.subActivityName : workEntry.activityName}
                                        </Col>
                                        <Col lg={3} className="archest-timeline-we-activity-info">
                                            <Badge className="archest-timeline-we-activity-info-badge"
                                                   variant='primary'>{workEntry.activityStatus}</Badge>
                                            <Badge
                                                className="archest-timeline-we-activity-info-badge archest-timeline-we-activity-info-est-time-badge"
                                                variant='success'>{workEntry.activityEstimatedTime} Hrs</Badge>
                                        </Col>
                                    </Row>
                                    <Row className="archest-timeline-we-info">
                                        <Col lg={12}>
                                            <Row hidden={!workEntry.note}>
                                                <Col lg={12}>
                                                    <p className="archest-timeline-we-info-note">
                                                        {workEntry.note}
                                                    </p>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={2} className="archest-timeline-we-info-label">
                                                    Estimate
                                                </Col>
                                                <Col lg={10}>
                                                    {workEntry.estimateName}
                                                    &nbsp;
                                                    <a className=""
                                                       href={`/estimates/${workEntry.estimateId}/edit`}
                                                       rel="noopener noreferrer"
                                                       target="_blank">
                                                        <i className="material-icons archest-inline-icon archest-timeline-we-estimate-link-icon">
                                                            open_in_new
                                                        </i>
                                                    </a>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={2} className="archest-timeline-we-info-label">
                                                    Feature
                                                </Col>
                                                <Col lg={10}>
                                                    {workEntry.featureName}
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={10}/>
                                        <Col lg={2}>
                                            <OverlayTrigger placement="top"
                                                            overlay={
                                                                <Tooltip id="tooltip-top">Delete</Tooltip>
                                                            }>
                                                <Button
                                                    onClick={() => this.props.deleteWorkEntryBtnClickHandler(workEntry)}
                                                    className="archest-timeline-we-btn archest-timeline-we-delete-btn"
                                                    variant="outline-danger" size="sm">
                                                    <span className="oi oi-x"/>
                                                </Button>
                                            </OverlayTrigger>
                                            <OverlayTrigger placement="top"
                                                            overlay={
                                                                <Tooltip id="tooltip-top">Edit</Tooltip>
                                                            }>
                                                <Button
                                                    onClick={() => this.editWorkEntryBtnClickHandler(workEntry)}
                                                    className="archest-timeline-we-btn archest-timeline-we-delete-btn"
                                                    variant="outline-primary" size="sm">
                                                    <span className="oi oi-pencil"/>
                                                </Button>
                                            </OverlayTrigger>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

    editWorkEntryBtnClickHandler(workEntry) {
        this.props.editWorkEntryBtnClickHandler(workEntry)
    }
}

export default ArchestWorkEntryComponent;