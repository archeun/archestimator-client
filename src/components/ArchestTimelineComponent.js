import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestWorkEntryComponent from "./ArchestWorkEntryComponent";

const _ = require('lodash');


class ArchestTimelineComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityWorkEntries: {},
            subActivityWorkEntries: {}
        };
    }

    componentDidMount() {

        const component = this;

        let activityWorkEntries, subActivityWorkEntries = {};

        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/activity_work_entries/', {})
            .then((response) => {
                activityWorkEntries = response.data.results;
                return ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/sub_activity_work_entries/', {});
            })
            .then(response => subActivityWorkEntries = response.data.results)
            .finally(() => {
                component.setState({
                    activityWorkEntries,
                    subActivityWorkEntries
                });
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        const workEntryComponents = this.getWorkEntryComponents(this.state.activityWorkEntries);
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>
                    {workEntryComponents}
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

    getWorkEntryComponents(workEntries) {
        return _.map(
            workEntries,
            (workEntry) => <ArchestWorkEntryComponent workEntry={workEntry} key={workEntry.id}/>
        );
    }

}

export default ArchestTimelineComponent;