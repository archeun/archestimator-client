import ReactDOM from 'react-dom';
import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import './styles/ArchestTimeline.scss';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import {Card} from "react-bootstrap";
import ArchestHttp from "../modules/archest_http";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestCalendarWorkEntryPopoverComponent from "./ArchestCalendarWorkEntryPopoverComponent";
import ArchestWorkEntryFormComponent from "./ArchestWorkEntryFormComponent";


class ArchestCalendarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedEventId: null,
            activityWorkEntries: [],
            subActivityWorkEntries: [],
            modalProps: {},
        };
        this.editWorkEntryBtnClickHandler = this.editWorkEntryBtnClickHandler.bind(this);
        this.deleteWorkEntryBtnClickHandler = this.deleteWorkEntryBtnClickHandler.bind(this);
        this.workEntryFormSaveCallback = this.workEntryFormSaveCallback.bind(this);
    }

    componentDidMount() {
        this.fetchWorkEntries();
    }

    fetchWorkEntries() {
        let requestConfigs = [
            {
                name: 'activityWorkEntries',
                url: BACKEND_ESTIMATOR_API_URL + '/activity_work_entries/',
                params: {}
            },
            {
                name: 'subActivityWorkEntries',
                url: BACKEND_ESTIMATOR_API_URL + '/sub_activity_work_entries/',
                params: {}
            },
        ];

        ArchestHttp.BATCH_GET(requestConfigs, (responses) => {
            this.setState({
                activityWorkEntries: responses.activityWorkEntries.data,
                subActivityWorkEntries: responses.subActivityWorkEntries.data,
            });
        });
    }

    handleDateClick = (arg) => {
        this.setState({selectedWorkEntry: {date: arg.dateStr}});
    };


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
            this.fetchWorkEntries();
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

    customEventRender = () => {
        return (info) => {
            let eventItemProps = {
                show: false,
                title: info.event.title,
                workEntry: info.event.extendedProps.workEntry,
                editWorkEntryBtnClickHandler: this.editWorkEntryBtnClickHandler,
                deleteWorkEntryBtnClickHandler: this.deleteWorkEntryBtnClickHandler,
            };
            ReactDOM.render(
                React.createElement(ArchestCalendarWorkEntryPopoverComponent, eventItemProps, ''),
                info.el
            );
            return info.el;
        };
    };

    workEntryFormSaveCallback() {
        this.setState({selectedWorkEntry: false});
        this.fetchWorkEntries();
    }

    render() {
        let workEntries = this.state.activityWorkEntries.concat(this.state.subActivityWorkEntries);
        let events = workEntries.map((workEntry) => {
            return {
                title: workEntry.activity ? workEntry.activity.name : workEntry.sub_activity.name,
                id: workEntry.sub_activity ? `sub_act_${workEntry.id}` : `act_${workEntry.id}`,
                date: workEntry.date,
                workEntry: workEntry
            }
        });
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent modalProps={this.state.modalProps}>
                    <ArchestWorkEntryFormComponent
                        workEntry={this.state.selectedWorkEntry}
                        postSaveCallback={this.workEntryFormSaveCallback}
                    />
                    <Card className="archest-card">
                        <Card.Body className="archest-card-body">
                            <FullCalendar
                                defaultView="dayGridMonth"
                                eventLimit={4}
                                eventColor='#1B998B'
                                eventTextColor='white'
                                plugins={[dayGridPlugin, interactionPlugin]}
                                dateClick={this.handleDateClick}
                                events={events}
                                editable={true}
                                eventRender={this.customEventRender()}
                            />
                        </Card.Body>
                    </Card>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

}

export default ArchestCalendarComponent;