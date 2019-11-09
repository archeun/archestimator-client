import React, {Component} from "react";
import {Col, OverlayTrigger, ProgressBar, Row, Tooltip} from "react-bootstrap";
import {SUB_ACTIVITY} from "../constants";
import ArchestActivityStatusChangeWidgetComponent from "./ArchestActivityStatusChangeWidgetComponent";

class ArchestFeatureSubActivityProgressComponent extends Component {

    render() {
        let subActivity = this.props.subActivity;
        return (
            <Row className='archest-feature-progress-sub-activity'>
                <Col lg={5} className='archest-feature-progress-sub-activity-name'>
                    {subActivity.name}
                </Col>
                <Col lg={2} className='archest-feature-progress-sub-activity-completion'>
                    <OverlayTrigger placement="top" overlay={
                        <Tooltip variant='primary'>{subActivity.completion_percentage}</Tooltip>
                    }>
                        <ProgressBar striped variant="success" now={subActivity.completion_percentage}/>
                    </OverlayTrigger>
                </Col>
                <Col lg={2} className='archest-feature-progress-sub-activity-owner'>
                    {subActivity.owner}
                </Col>

                <Col lg={2}>
                    <Row>
                        <Col lg={4} className='archest-feature-progress-sub-activity-estimated'>
                            {subActivity.estimated_time}
                        </Col>
                        <Col lg={4} className='archest-feature-progress-sub-activity-entered'>
                            <p onClick={() => this.props.showWorkEntriesCallback(subActivity, SUB_ACTIVITY)}>
                                <strong>{subActivity.entered_time}</strong>
                            </p>

                        </Col>
                        <Col lg={4}>
                            <div className={
                                subActivity.remaining_time < 0 ?
                                    'archest-feature-progress-sub-activity-remaining-danger' : 'archest-feature-progress-sub-activity-remaining'
                            }>
                                {subActivity.remaining_time}
                            </div>
                        </Col>
                    </Row>
                </Col>

                <Col lg={1} className='archest-feature-progress-sub-activity-actions'>
                    <ArchestActivityStatusChangeWidgetComponent activity={subActivity} type={SUB_ACTIVITY}/>
                </Col>
            </Row>
        );
    }
}

export default ArchestFeatureSubActivityProgressComponent;