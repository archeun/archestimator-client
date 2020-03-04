import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestFeatureProgressComponent from "./ArchestFeatureProgressComponent";
import {ACTIVITY, BACKEND_ESTIMATOR_API_URL, SUB_ACTIVITY} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Col, Row, Card} from "react-bootstrap";
import './styles/ArchestEstimateProgressComponent.scss';
import './styles/ArchestEstimateWorkEntriesModalComponent.scss';
import ArchestEstimateWorkEntriesModalComponent from "./ArchestEstimateWorkEntriesModalComponent";

const _ = require('lodash');

class ArchestEstimateProgressComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            estimateId: this.props.match.params.estimateId,
            estimate: {},
            estimateProgress: {},
            workEntriesModalProps: {show: false, workEntries: [], activityOrSubActivity: {},},
            breadcrumbs: []
        };
        this.showWorkEntriesModal = this.showWorkEntriesModal.bind(this);
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
                    {title: 'Projects', url: '/projects'},
                    {title: `Phases of ${estimate.phase.project.name}`, url: '/projects/' + estimate.phase.project.id + '/phases/'},
                    {
                        title: `Estimates for ${estimate.phase.name}`,
                        url: `/phases/${estimate.phase.id}/estimates/`
                    },
                    {title: estimate.name, url: '#', active: true},
                ]
            });
        });
    }

    showWorkEntriesModal(activityOrSubActivity, type) {

        let url = '';

        if (type === ACTIVITY) {
            url = BACKEND_ESTIMATOR_API_URL + "/activities/" + activityOrSubActivity.id + '/work_entries/';
        } else if (type === SUB_ACTIVITY) {
            url = BACKEND_ESTIMATOR_API_URL + "/sub_activities/" + activityOrSubActivity.id + '/work_entries/';
        } else {
            return;
        }

        ArchestHttp.GET(url, {}).then((response) => {
            activityOrSubActivity.status_name = type === ACTIVITY ? response.data.results.activity.status_name : response.data.results.sub_activity.status_name
            this.setState({
                workEntriesModalProps: {
                    show: true,
                    workEntries: response.data.results.work_entries,
                    activityOrSubActivity: activityOrSubActivity,
                    onCancel: () => {
                        this.setState({
                            workEntriesModalProps: {
                                show: false,
                                workEntries: [],
                                activityOrSubActivity: {}
                            }
                        });
                    }
                }
            });
        }).catch(function (error) {
            console.log(error);
        });


    }

    render() {
        let featureProgressComponents = _.map(
            this.state.estimateProgress.features,
            feature => <ArchestFeatureProgressComponent key={feature.id} feature={feature}
                                                        showWorkEntriesCallback={this.showWorkEntriesModal}/>
        );
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent breadcrumbs={this.state.breadcrumbs}>

                    <ArchestEstimateWorkEntriesModalComponent
                        show={this.state.workEntriesModalProps.show}
                        workEntries={this.state.workEntriesModalProps.workEntries}
                        activityOrSubActivity={this.state.workEntriesModalProps.activityOrSubActivity}
                        onCancel={this.state.workEntriesModalProps.onCancel}
                    />

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