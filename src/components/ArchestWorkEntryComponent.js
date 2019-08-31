import React, {Component} from "react";
import {Badge, Button, Card, Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";

const _ = require('lodash');
var moment = require('moment');


class ArchestWorkEntryComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const workEntry = this.props.workEntry;

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
                                <Col lg={10}>
                                    <Row>
                                        <Col lg={10} className="archest-timeline-we-activity-name">
                                            {workEntry.activity.name}
                                        </Col>
                                        <Col lg={2} className="archest-timeline-we-activity-info">
                                            <Badge variant='primary'>
                                                {
                                                    workEntry.activity.STATUS_CHOICES[
                                                        _.findIndex(
                                                            workEntry.activity.STATUS_CHOICES,
                                                            (o) => o[0] === workEntry.activity.status)
                                                        ][1]
                                                }
                                            </Badge>
                                            &nbsp;
                                            <Badge variant='success'>{workEntry.activity.estimated_time} Hrs</Badge>
                                        </Col>
                                    </Row>
                                    <Row className="archest-timeline-we-info">
                                        <Col lg={10}>
                                            <Row>
                                                <Col lg={12}>
                                                    <blockquote>
                                                        <em>
                                                            {workEntry.note}
                                                        </em>
                                                    </blockquote>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col lg={2} className="archest-timeline-we-info-label">
                                                    Estimate
                                                </Col>
                                                <Col lg={10}>
                                                    {workEntry.activity.estimate.name}
                                                    &nbsp;
                                                    <a className=""
                                                       href={`/estimates/${workEntry.activity.estimate.id}/edit`}
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
                                                    {workEntry.activity.feature.name}
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

}

export default ArchestWorkEntryComponent;