import React, {Component} from "react";
import {Button, Card, Col, Row, Form} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestEstimateActivityComponent from "./ArchestEstimateActivityComponent";
import './styles/ArchestEstimateEditComponent.scss';
import autosize from 'autosize';

const _ = require('lodash');

class ArchestEstimateEditComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataLoaded: false,
            redirectTo: false,
            estimate: {},
            estimateDetails: {},
            estimateResources: [],
            estimateTableData: [],
            breadcrumbs: []
        };
        this.removeActivityItem = this.removeActivityItem.bind(this);
        this.handleEstimateNameChange = this.handleEstimateNameChange.bind(this);
        this.saveEstimateName = this.saveEstimateName.bind(this);
    }

    componentDidMount() {

        const component = this;

        let estimateId = this.props.match.params.estimateId;

        let requestConfigs = [
            {
                name: 'estimateDetailedView',
                url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${estimateId}/detailed_view/`,
                params: {}
            },
            {
                name: 'estimate',
                url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${estimateId}/`,
                params: {}
            },
            {
                name: 'estimateResources',
                url: `${BACKEND_ESTIMATOR_API_URL}/estimates/${estimateId}/shared_resources/`,
                params: {}
            },
        ];

        ArchestHttp.BATCH_GET(requestConfigs, (responses) => {

            let estimate = responses.estimate.data;

            component.setState({
                estimateDetails: responses.estimateDetailedView.data.results,
                dataLoaded: true,
                estimateResources: responses.estimateResources.data.results,
                estimate: estimate,
                breadcrumbs: [
                    {title: 'Home', url: '/'},
                    {title: 'Projects', url: '/projects'},
                    {title: `Phases of ${estimate.phase.project.name}`, url: '/project/' + estimate.phase.project.id + '/phases/'},
                    {
                        title: `Estimates for ${estimate.phase.name}`,
                        url: `/phase/${estimate.phase.id}/estimates/`
                    },
                    {title: estimate.name, url: '#', active: true},
                ]
            });
        });

    }

    componentDidUpdate() {
        window.addEventListener('load', autosize(document.getElementsByTagName('textarea')));

    }

    removeActivityItem = function (removedActivityId, response) {
        //TODO: Refactor this function to have proper constants and validations
        if (response.status === 204) {
            this.setState(function (prevState) {
                _.remove(prevState.estimateDetails, {id: removedActivityId});
                return {estimateDetails: prevState.estimateDetails}
            });
        }
    };

    handleEstimateNameChange(formElement) {
        if (this.state.dataLoaded) {
            this.setState({estimate: {...this.state.estimate, name: formElement.target.value}})
        }
    }

    saveEstimateName() {
        ArchestHttp.PATCH(BACKEND_ESTIMATOR_API_URL + "/estimates/" + this.state.estimate.id + "/", {
            name: this.state.estimate.name,
        }).then(function (response) {
        }).catch(function (error) {
            console.log(error);
        }).finally(() => {
        });
    }

    render() {
        let activityComps = [];
        let component = this;

        if (this.state.dataLoaded) {
            activityComps = this.state.estimateDetails.map(
                (activity) =>
                    <ArchestEstimateActivityComponent
                        key={activity.id}
                        activity={activity}
                        features={this.state.estimate.features}
                        estimateResources={this.state.estimateResources}
                        removeActivityItemHandler={this.removeActivityItem}
                    />
            );
        }

        let addActivityItem = function () {
            const features = component.state.estimate.features;

            ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/activities/", {
                feature_id: features[0].id,
                name: '',
                estimate_id: component.state.estimate.id,
                estimated_time: 0,
                status: 1,
            }).then(function (response) {
                component.setState(prevState => ({
                    estimateDetails: [...prevState.estimateDetails, response.data]
                }));
            }).catch(function (error) {
                console.log(error);
            });
        };
        return (

            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent breadcrumbs={this.state.breadcrumbs}>
                    <Card text="white">
                        <Card.Header>
                            <Row>
                                <Col lg={12}>
                                    <Form.Control type="text"
                                                  placeholder="Estimate Name"
                                                  size="sm"
                                                  value={this.state.estimate.name || ''}
                                                  name="estimateName"
                                                  onChange={this.handleEstimateNameChange}
                                                  onBlur={this.saveEstimateName}
                                                  id="archest-edit-estimate-name-field"
                                    />
                                </Col>
                            </Row>
                        </Card.Header>
                    </Card>
                    <br/>
                    {activityComps}
                    <Row style={{margin: '0 42%'}}>
                        <Col>
                            <Button onClick={addActivityItem} variant="link">
                                <span className="oi oi-plus"/>&nbsp;&nbsp;
                                <span>Add Activity</span>
                            </Button>
                        </Col>
                    </Row>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

}

export default ArchestEstimateEditComponent;
