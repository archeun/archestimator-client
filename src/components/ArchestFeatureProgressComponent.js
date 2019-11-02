import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import ArchestFeatureActivityProgressComponent from "./ArchestFeatureActivityProgressComponent";

const _ = require('lodash');

class ArchestFeatureProgressComponent extends Component {

    render() {
        let feature = this.props.feature;
        let activityComponents = _.map(
            feature.activities,
            activity => <ArchestFeatureActivityProgressComponent key={activity.id} activity={activity}/>
        );
        return (
            <Row key={feature.id}>
                <Col lg={12}>
                    <Row className='archest-feature-progress-feature'>
                        <Col lg={12} className='archest-feature-progress-feature-name'>
                            {feature.name}
                        </Col>
                    </Row>

                    <Row className='archest-feature-progress-time-main-heading-row'>
                        <Col lg={10}/>
                        <Col lg={2} className='archest-feature-progress-heading'>
                            Times
                        </Col>
                    </Row>
                    <Row className='archest-feature-progress-headings'>
                        <Col lg={5} className='archest-feature-progress-heading'>
                            Activity/Sub Activity
                        </Col>
                        <Col lg={2} className='archest-feature-progress-heading'>
                            Progress (%)
                        </Col>
                        <Col lg={2} className='archest-feature-progress-heading'>
                            Owner
                        </Col>

                        <Col lg={2}>
                            <Row>
                                <Col lg={4} className='archest-feature-progress-heading archest-feature-progress-time-sub-heading'>
                                    Estimated
                                </Col>
                                <Col lg={4} className='archest-feature-progress-heading archest-feature-progress-time-sub-heading'>
                                    Entered
                                </Col>
                                <Col lg={4} className='archest-feature-progress-heading archest-feature-progress-time-sub-heading'>
                                    Remaining
                                </Col>
                            </Row>
                        </Col>

                        <Col lg={1} className='archest-feature-progress-heading'>
                            Actions
                        </Col>
                    </Row>
                    <hr/>
                    {activityComponents}
                </Col>
            </Row>
        );
    }

}

export default ArchestFeatureProgressComponent;