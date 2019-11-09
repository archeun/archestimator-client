import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestWorkEntryComponent from "./ArchestWorkEntryComponent";
import './styles/ArchestTimelineComponent.scss';
import ArchestWorkEntryFormComponent from "./ArchestWorkEntryFormComponent";

const _ = require('lodash');

class ArchestTimelineComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityWorkEntries: [],
            subActivityWorkEntries: [],
            selectedWorkEntry: false,
            modalProps: {},
        };

        this.initWorkEntryList = this.initWorkEntryList.bind(this);
        this.editWorkEntryBtnClickHandler = this.editWorkEntryBtnClickHandler.bind(this);
        this.deleteWorkEntryBtnClickHandler = this.deleteWorkEntryBtnClickHandler.bind(this);
        this.workEntryFormSaveCallback = this.workEntryFormSaveCallback.bind(this);
    }

    componentDidMount() {
        this.initWorkEntryList();
    }

    initWorkEntryList() {

        let requestConfigs = [
            {name: 'activityWorkEntries', url: BACKEND_ESTIMATOR_API_URL + '/activity_work_entries/', params: {}},
            {
                name: 'subActivityWorkEntries',
                url: BACKEND_ESTIMATOR_API_URL + '/sub_activity_work_entries/',
                params: {}
            },
        ];

        ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
            this.setState(prevState => {
                return {
                    activityWorkEntries: responses.activityWorkEntries.data,
                    subActivityWorkEntries: responses.subActivityWorkEntries.data,
                };
            });
        });
    }

    editWorkEntryBtnClickHandler(workEntry) {
        this.setState({selectedWorkEntry: workEntry});
    }

    deleteWorkEntry(workEntry) {
        let apiRequest;

        if (workEntry.subActivityId !== '') {
            apiRequest = ArchestHttp.DELETE(`${BACKEND_ESTIMATOR_API_URL}/sub_activity_work_entries/${workEntry.id}/`, {})

        } else {
            apiRequest = ArchestHttp.DELETE(`${BACKEND_ESTIMATOR_API_URL}/activity_work_entries/${workEntry.id}/`, {})
        }

        apiRequest.then((response) => {
            this.setState({
                modalProps: {show: false},
            });
            this.initWorkEntryList();
        }, (error) => {
            console.log(error);
        });
    }

    deleteWorkEntryBtnClickHandler(workEntry) {

        this.setState({
            modalProps: {
                show: true,
                onConfirm: () => this.deleteWorkEntry(workEntry),
                message: 'Do you really want to delete this work entry?',
                onCancel: () => {
                    this.setState({modalProps: {show: false}});
                }
            }
        });

    }

    workEntryFormSaveCallback() {
        this.setState({selectedWorkEntry: false});
        this.initWorkEntryList();
    }

    render() {
        const workEntryComponents = this.getWorkEntryComponents();
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent modalProps={this.state.modalProps}>

                    <ArchestWorkEntryFormComponent
                        workEntry={this.state.selectedWorkEntry}
                        postSaveCallback={this.workEntryFormSaveCallback}
                    />

                    {workEntryComponents}
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

    getWorkEntryComponents() {

        return _.map(
            this.getSortedWorkEntries(),
            (workEntry) => <ArchestWorkEntryComponent
                workEntry={workEntry}
                key={`${workEntry.ENTRY_TYPE}_${workEntry.id}`}
                editWorkEntryBtnClickHandler={this.editWorkEntryBtnClickHandler}
                deleteWorkEntryBtnClickHandler={this.deleteWorkEntryBtnClickHandler}
            />
        );

    }

    getSortedWorkEntries() {
        let workEntries = this.state.activityWorkEntries.concat(this.state.subActivityWorkEntries);
        return _.orderBy(workEntries, ['date'], ['desc']);
    }

}

export default ArchestTimelineComponent;