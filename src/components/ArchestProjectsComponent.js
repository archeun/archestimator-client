import React, {Component} from "react";
import {Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Redirect} from "react-router-dom";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";

const _ = require('lodash');

class ArchestProjectsComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            projectList: [],
            breadcrumbs: [],
            redirectTo: false,
        };
        this.handlePhaseListBtnClick = this.handlePhaseListBtnClick.bind(this)
    }

    componentDidMount() {

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/projects/', {}).then(
            (response) => {
                this.setState({
                    projectList: response.data.results,
                    breadcrumbs: [
                        {title: 'Home', url: '/'},
                        {title: 'Projects', url: '#', active: true},
                    ]
                });
            }
        ).catch(
            (error) => {
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

        let projectList = _.map(this.state.projectList, ((project) => {
            return this.getProjectInfoListItem(project);
        }));

        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent breadcrumbs={this.state.breadcrumbs}>
                    <Row>
                        <Col sm={3}/>
                        <Col sm={6}>
                            <Card>
                                <Card.Header>Your Projects</Card.Header>
                                <ListGroup variant="flush">
                                    {projectList}
                                </ListGroup>
                            </Card>
                        </Col>
                        <Col sm={3}/>
                    </Row>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }


    handlePhaseListBtnClick(project) {
        this.setState({
            redirectTo: '/projects/' + project.id + '/phases/'
        });
    };

    getProjectInfoListItem(project) {
        return (
            <ListGroup.Item key={project.id}>
                <div>
                    <h5 style={{'display': 'inline-block'}}>{project.name}</h5>
                    <OverlayTrigger key="right" placement="right"
                                    overlay={
                                        <Tooltip id="tooltip-right">
                                            Phases
                                        </Tooltip>
                                    }>
                        <Button onClick={() => this.handlePhaseListBtnClick(project)}
                                style={{'float': 'right'}} variant="outline-primary" size="sm">
                            <span className="oi oi-excerpt"/>
                        </Button>
                    </OverlayTrigger>
                </div>
                <Badge variant="info">{project.customer.name}</Badge>
            </ListGroup.Item>
        );
    }
}

export default ArchestProjectsComponent;
