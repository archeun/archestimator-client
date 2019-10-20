import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestFeatureProgressComponent from "./ArchestFeatureProgressComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Col, Row, Card} from "react-bootstrap";
import './styles/ArchestEstimateProgressComponent.scss';

const _ = require('lodash');

class ArchestEstimateProgressComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            estimateId: this.props.match.params.estimateId,
            estimate: {},
            estimateProgress: {},
            breadcrumbs: []
        };
    }

    componentDidMount() {

        let requestConfigs = [
            {
                name: 'estimate',
                url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${this.state.estimateId}/`,
                params: {}
            },
            {
                name: 'estimateProgress',
                url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${this.state.estimateId}/progress/`,
                params: {}
            },
        ];

        ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
            let estimate = responses.estimate.data;
            this.setState({
                estimate: estimate,
                estimateProgress: responses.estimateProgress.data.results,
                breadcrumbs: [
                    {title: 'Home', url: '/'},
                    {
                        title: estimate.phase.name + ' - Estimates',
                        url: `/phase/${estimate.phase.id}/estimates/`
                    },
                    {title: estimate.name, url: '#', active: true},
                ]
            });
        });
    }

    render() {
        let featureProgressComponents = _.map(
            this.state.estimateProgress.features,
            feature => <ArchestFeatureProgressComponent key={feature.id} feature={feature}/>
        );
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent breadcrumbs={this.state.breadcrumbs}>
                    <Row className="archest-card-container-row">
                        <Col>
                            <Card className="archest-card">
                                <Card.Body className="archest-card-body archest-estimate-progress-card-body">
                                    {featureProgressComponents}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }
}

export default ArchestEstimateProgressComponent;