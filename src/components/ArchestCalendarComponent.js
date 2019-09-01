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

// const _ = require('lodash');
// const moment = require('moment');


class ArchestCalendarComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activityWorkEntries: [],
            subActivityWorkEntries: []
        };

    }

    componentDidMount() {
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
                activityWorkEntries: responses.activityWorkEntries.data.results,
                subActivityWorkEntries: responses.subActivityWorkEntries.data.results,
            });
        });
    }

    handleDateClick = (arg) => {
        alert(arg.dateStr);
    };

    handleEventClick = (event) => {
        console.log(event.event);
    };

    customEventRender = info => {
        info.el.firstChild.innerText = "Text Overwrite";
        return info.el
    };

    render() {
        let workEntries = this.state.activityWorkEntries.concat(this.state.subActivityWorkEntries);
        let events = workEntries.map((workEntry) => {
            return {
                title: workEntry.activity ? workEntry.activity.name : workEntry.sub_activity.name,
                id: workEntry.id,
                date: workEntry.date
            }
        });
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>
                    <Card className="archest-card">
                        <Card.Body className="archest-card-body">
                            <FullCalendar
                                defaultView="dayGridMonth"
                                eventLimit={5}
                                eventColor='#1B998B'
                                eventTextColor='white'
                                plugins={[dayGridPlugin, interactionPlugin]}
                                dateClick={this.handleDateClick}
                                eventClick={this.handleEventClick}
                                events={events}
                                editable={true}
                                eventRender={this.customEventRender}
                            />
                        </Card.Body>
                    </Card>
                </ArchestMainContainerComponent>
            </ArchestAuthEnabledComponent>
        );
    }

}

export default ArchestCalendarComponent;