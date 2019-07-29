import React, {Component} from "react";
import {Container, Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip, Spinner} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL, HANDSONTABLE_KEY} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {HotTable} from '@handsontable/react'

const _ = require('lodash');

class EstimateViewComponent extends Component {

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

        const estimateTableRows = this.state.estimateTableData;
        if (estimateTableRows.length < 100) {
            for (let i = estimateTableRows.length; i < 100; i++) {
                estimateTableRows[i] = [];
            }
        }

        const tableSettings = {
            data: estimateTableRows,
            colHeaders: ["Feature", "Activity", "Sub-Activity", "Estimate", "Actual", "Status"],
            rowHeaders: false,
            colWidths: [210, 315, 315, 80, 70, 100],
            manualColumnResize: true,
            manualRowResize: true,
            dropdownMenu: true,
            filters: true
        };

        return (

            <ArchestAuthEnabledComponent>
                <Container style={{marginTop: '1%'}}>
                    <Card>
                        <Card.Body>
                            <Card.Subtitle>{this.state.estimate.name}</Card.Subtitle>
                        </Card.Body>
                    </Card>
                    <Spinner hidden={this.state.dataLoaded} animation="border" style={{margin: '5% 50%'}}/>
                    <div style={{overflowX: 'hidden'}}>
                        <HotTable licenseKey={HANDSONTABLE_KEY}
                                  hidden={!this.state.dataLoaded}
                                  ref={this.hotTableComponent}
                                  settings={tableSettings}
                                  width="100%"
                                  height="500"
                        />
                    </div>
                </Container>
            </ArchestAuthEnabledComponent>
        );
    }

    saveEstimateData() {
        console.log(this.hotTableComponent.current.hotInstance.getData());
    }

}

export default EstimateViewComponent;
