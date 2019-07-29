import React, {Component} from "react";
import {Card} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";

class EstimateEditComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataLoaded: false,
            redirectTo: false,
            estimate: {},
            estimateDetails: {},
            estimateTableData: [],
        };
        this.hotTableComponent = React.createRef();
    }

    componentDidMount() {

        const component = this;

        let estimateId = this.props.match.params.estimateId;

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/' + estimateId + '/detailed_read_view/', {})
            .then(function (response) {
                let estimateActivities = response.data.results;
                let estimateTableRows = [];
                let featureNames = {};
                let activityNames = {};
                for (let i = 0; i < estimateActivities.length; i++) {
                    if (estimateActivities[i].sub_activities.length > 0) {
                        for (let j = 0; j < estimateActivities[i].sub_activities.length; j++) {

                            let subActivityData = [
                                estimateActivities[i].feature.name,
                                estimateActivities[i].name,
                                estimateActivities[i].sub_activities[j].name,
                                estimateActivities[i].sub_activities[j].estimated_time,
                                estimateActivities[i].sub_activities[j].actual_time,
                                estimateActivities[i].sub_activities[j].is_completed ? 'Completed' : 'Pending',
                            ];
                            if (featureNames[estimateActivities[i].feature.id]) {
                                subActivityData[0] = '';
                            }
                            if (activityNames[estimateActivities[i].id]) {
                                subActivityData[1] = '';
                            }
                            estimateTableRows.push(subActivityData);
                            featureNames[estimateActivities[i].feature.id] = true;
                            activityNames[estimateActivities[i].id] = true;
                        }
                    } else {
                        let activityData = [
                            estimateActivities[i].feature.name,
                            estimateActivities[i].name,
                            '',
                            estimateActivities[i].estimated_time,
                            estimateActivities[i].actual_time,
                            estimateActivities[i].is_completed ? 'Completed' : 'Pending',
                        ];

                        if (featureNames[estimateActivities[i].feature.id]) {
                            activityData[0] = '';
                        }
                        if (activityNames[estimateActivities[i].id]) {
                            activityData[1] = '';
                        }

                        estimateTableRows.push(activityData);
                        featureNames[estimateActivities[i].feature.id] = true;
                        activityNames[estimateActivities[i].id] = true;
                    }
                }

                component.setState({
                    estimateDetails: response.data.results,
                    estimateTableData: estimateTableRows,
                    dataLoaded: true
                });
            })
            .catch(function (error) {
                console.log(error);
            });

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/' + estimateId + '/', {})
            .then(function (response) {
                component.setState({
                    estimate: response.data
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (

            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>
                    <Card>
                        <Card.Body>
                            <Card.Subtitle>ASHABSDn kjkajasd</Card.Subtitle>
                        </Card.Body>
                    </Card>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

    saveEstimateData() {
        console.log(this.hotTableComponent.current.hotInstance.getData());
    }

}

export default EstimateEditComponent;
