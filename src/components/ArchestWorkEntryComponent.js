import React, {Component} from "react";
import {Card, Col, Row} from "react-bootstrap";

const _ = require('lodash');


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
                            Estimate Name: {workEntry.activity.estimate.name}<br/>
                            Feature Name: {workEntry.activity.feature.name}<br/>
                            Activity Name: {workEntry.activity.name}<br/>
                            Activity Estimated Time: {workEntry.activity.estimated_time} Hrs.<br/>
                            Activity Status: {
                            workEntry.activity.STATUS_CHOICES[
                                _.findIndex(
                                    workEntry.activity.STATUS_CHOICES,
                                    (o) => o[0] === workEntry.activity.status)
                                ][1]
                        }<br/>
                            Worked Date: {workEntry.date}<br/>
                            Worked Hours: {workEntry.worked_hours} Hrs.<br/>
                            Notes: {workEntry.note}<br/>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        );
    }

}

export default ArchestWorkEntryComponent;