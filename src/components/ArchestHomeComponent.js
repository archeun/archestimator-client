import React, {Component} from "react";
import {Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";

const _ = require('lodash');

class ArchestHomeComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            phaseList: [],
            redirectTo: false,
        };
    }

    componentDidMount() {

        const component = this;

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/phases/', {})
            .then(function (response) {
                    component.setState({
                        phaseList: response.data.results
                    });
                }
            )
            .catch(function (error) {
                    console.log(error);
                }
            );
    }

    render() {

        if (this.state.redirectTo) {
            return <Redirect push to={{
                pathname: this.state.redirectTo,
                state: {}
            }}
            />
        }
        const component = this;

        let phaseList = _.map(this.state.phaseList, (function (phase) {
            return component.getPhaseInfoListItem(phase);
        }));

        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>
                    <Row>
                        <Col sm={3}/>
                        <Col sm={6}>
                            <Card>
                                <Card.Header>Your Project Phases</Card.Header>
                                <ListGroup variant="flush">
                                    {phaseList}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col sm={3}/>
                    </Row>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }


    handleEstimateListBtnClick(phase) {
        this.setState({
            redirectTo: '/phase/' + phase.id + '/estimates/'
        });
    };

    getPhaseInfoListItem(phase) {
        let managersNames = _.map(phase.managers, (manager) => manager.full_name).join(', ');
        return (
            <ListGroup.Item key={phase.id}>
                <div>
                    <h5 style={{'display': 'inline-block'}}>{phase.name}</h5>
                    <OverlayTrigger key="right" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">
                                            Estimates
                                        </Tooltip>
                                    }>
                        <Button onClick={this.handleEstimateListBtnClick.bind(this, phase)}
                                style={{'float': 'right'}} variant="outline-primary" size="sm">
                            <span className="oi oi-excerpt"/>
                        </Button>
                    </OverlayTrigger>
                </div>
                <div>
                    <footer className="blockquote-footer">
                        From <cite>{phase.start_date}</cite> To <cite>{phase.end_date}.</cite> Managers: <cite>{managersNames}</cite>
                    </footer>
                </div>
                <Badge variant="info">{phase.project.customer.name}</Badge>
                <span> > </span>
                <Badge variant="success">{phase.project.name}</Badge>
            </ListGroup.Item>
        );
    }
}

export default ArchestHomeComponent;
