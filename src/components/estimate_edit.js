import React, {Component} from "react";
import {Container, Row, Col, Card, ListGroup, Badge, Button, OverlayTrigger, Tooltip, Spinner} from "react-bootstrap";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL, HANDSONTABLE_KEY} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {HotTable} from '@handsontable/react'

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
        this.hotTableComponent = React.createRef();
    }

    componentDidMount() {

        const component = this;
    }

    render() {
        return (

            <ArchestAuthEnabledComponent>
            </ArchestAuthEnabledComponent>
        );
    }

    saveEstimateData() {
        console.log(this.hotTableComponent.current.hotInstance.getData());
    }

}

export default EstimateEditComponent;
