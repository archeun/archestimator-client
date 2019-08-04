import React, {Component} from "react";
import {Button, Card, Col, Row, Spinner} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import ArchestEstimateActivityComponent from "./ArchestEstimateActivityComponent";

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

    render() {
        let activityComps = [];
        if (this.state.dataLoaded) {
            activityComps = this.state.estimateDetails.map(
                (activity, idx) =>
                    <ArchestEstimateActivityComponent
                        key={idx}
                        activity={activity}
                        features={this.state.estimate.features}
                    />
            );
        }
        return (

            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>
                    <Button style={{'left': '93%', 'marginBottom': '2%'}} className='fixed-bottom' variant="success"
                            size="lg">
                        <span className="oi oi-check"/>
                    </Button>
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
                            <Button variant="link">
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
