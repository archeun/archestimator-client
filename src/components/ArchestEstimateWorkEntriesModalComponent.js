import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {Modal, Button, Card, Row, Col, OverlayTrigger, Tooltip, ProgressBar} from "react-bootstrap";
import './styles/ArchestEstimateWorkEntriesModalComponent.scss';
import {ACTIVITY_WORK_ENTRY_TYPE, SUB_ACTIVITY_WORK_ENTRY_TYPE} from "../constants";

const _ = require('lodash');

class ArchestEstimateWorkEntriesModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phaseResources: [],
            dataLoaded: false,
            resourceSharingOptions: []
        };
        this.onCancel = this.onCancel.bind(this);
    }

    onCancel() {
        this.props.onCancel();
        this.setState((prevState) => {
            return {dataLoaded: false}
        });
    }

    render() {

        let activityOrSubActivity = this.props.activityOrSubActivity;
        let entered_time = 0;
        let workEntries = _.map(this.props.workEntries, (workEntry) => {
            if (workEntry.ENTRY_TYPE === ACTIVITY_WORK_ENTRY_TYPE) {
                entered_time = activityOrSubActivity.entered_time_directly_to_activity;
            } else if (workEntry.ENTRY_TYPE === SUB_ACTIVITY_WORK_ENTRY_TYPE) {
                entered_time = activityOrSubActivity.entered_time;
            }
            return (
                <Row key={workEntry.id} className="archest-estimate-work-entries-modal-work-entry-row">
                    <Col sm={2}>{workEntry.date}</Col>
                    <Col sm={2}>{workEntry.worked_hours}</Col>
                    <Col sm={3}>{workEntry.owner ? workEntry.owner.full_name : ''}</Col>
                    <Col sm={5}>{workEntry.note}</Col>
                </Row>
            );
        });
        console.log(activityOrSubActivity);
        return (
            <ArchestAuthEnabledComponent>
                <Modal show={this.props.show} onHide={this.onCancel}>
                    <Modal.Header closeButton className="archest-modal-header">
                        <Modal.Title className="archest-modal-title">Work Entries</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="archest-modal-body">
                        <Card className="archest-card archest-modal-card">
                            <Card.Body className="archest-card-body">

                                <Row>
                                    <Col lg={12}>
                                        <div className="archest-estimate-work-entries-modal-activity-info-label">
                                            Activity/Sub Activity Name
                                        </div>
                                        <div>{activityOrSubActivity.name}</div>
                                    </Col>
                                </Row>
                                <br/>
                                <Row>
                                    <Col lg={3}>
                                        <div className="archest-estimate-work-entries-modal-activity-info-label">
                                            Estimated Time
                                        </div>
                                        <div>{activityOrSubActivity.estimated_time} Hrs.</div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="archest-estimate-work-entries-modal-activity-info-label">
                                            Entered Time
                                        </div>
                                        <div>{entered_time} Hrs.</div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="archest-estimate-work-entries-modal-activity-info-label">
                                            Status
                                        </div>
                                        <div>{activityOrSubActivity.status_name}</div>
                                    </Col>
                                    <Col lg={3}>
                                        <div className="archest-estimate-work-entries-modal-activity-info-label">
                                            Completion (%)
                                        </div>
                                        <div>
                                            <OverlayTrigger placement="top" overlay={
                                                <Tooltip
                                                    variant='primary'>{activityOrSubActivity.completion_percentage}</Tooltip>
                                            }>
                                                <ProgressBar striped variant="success"
                                                             now={activityOrSubActivity.completion_percentage}/>
                                            </OverlayTrigger>
                                        </div>
                                    </Col>
                                </Row>
                                <br/>
                                <Row className="archest-modal-headings">
                                    <Col sm={2}>Date</Col>
                                    <Col sm={2}>Worked Hrs.</Col>
                                    <Col sm={3}>Owner</Col>
                                    <Col sm={5}>Note</Col>
                                </Row>
                                <hr/>
                                {workEntries}
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer className="archest-modal-footer">
                        <Button size={'sm'} variant="primary" onClick={this.onCancel}>Ok</Button>
                    </Modal.Footer>
                </Modal>
            </ArchestAuthEnabledComponent>
        );
    }
}

export default ArchestEstimateWorkEntriesModalComponent;