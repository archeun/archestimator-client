import React, {Component} from "react";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestEstimateActivityComponent from "./ArchestEstimateActivityComponent";

const _ = require('lodash');

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
        this.removeActivityItem = this.removeActivityItem.bind(this);
    }

    componentDidMount() {

        const component = this;

        let estimateId = this.props.match.params.estimateId;

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/' + estimateId + '/detailed_view/', {})
            .then(function (response) {

                component.setState({
                    estimateDetails: response.data.results,
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

    removeActivityItem = function (removedActivityId, response) {
        //TODO: Refactor this function to have proper constants and validations
        if (response.status === 204) {
            this.setState(function (prevState) {
                _.remove(prevState.estimateDetails, {id: removedActivityId});
                return {estimateDetails: prevState.estimateDetails}
            });
        }
    };

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
                <ArchestMainContainerComponent>
                    <Card bg="info" text="white">
                        <Card.Header>
                            {this.state.estimate.name}
                        </Card.Header>
                    </Card>
                    <br/>
                    <Spinner hidden={this.state.dataLoaded} animation="border" style={{margin: '5% 50%'}}/>
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

export default EstimateEditComponent;
