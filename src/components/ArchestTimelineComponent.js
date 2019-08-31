import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestWorkEntryComponent from "./ArchestWorkEntryComponent";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import ArchestFloatingButtonComponent from "./ArchestFloatingButtonComponent";
import './styles/ArchestTimeline.scss';

const _ = require('lodash');


class ArchestTimelineComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityWorkEntries: {},
            subActivityWorkEntries: {},
            addWorkEntryFormConfig: {
                estimateId: {value: '', choices: []},
                activityId: {value: '', choices: []},
                subActivityId: {value: '', choices: []},
                workedDate: {value: ''},
                workedHours: {value: ''},
                notes: {value: ''},
            },
            showAddWorkEntryForm: false,
        };

        this.addNewWorkEntryClickHandler = this.addNewWorkEntryClickHandler.bind(this);
        this.handleTimelineWorkEntryFormFieldChange = this.handleTimelineWorkEntryFormFieldChange.bind(this);
        this.handleTimelineWorkEntryFormEstimateIdFieldChange = this.handleTimelineWorkEntryFormEstimateIdFieldChange.bind(this);
        this.handleTimelineWorkEntryFormActivityIdFieldChange = this.handleTimelineWorkEntryFormActivityIdFieldChange.bind(this);
        this.fetchActivityData = this.fetchActivityData.bind(this);
        this.showAddWorkEntryForm = this.showAddWorkEntryForm.bind(this);
        this.hideAddWorkEntryForm = this.hideAddWorkEntryForm.bind(this);
        this.initAddNewWorkEntryForm = this.initAddNewWorkEntryForm.bind(this);
        this.initWorkEntryList = this.initWorkEntryList.bind(this);
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
                    activityWorkEntries: responses.activityWorkEntries.data.results,
                    subActivityWorkEntries: responses.subActivityWorkEntries.data.results,
                };
            });
        });
    }

    initAddNewWorkEntryForm() {
        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/', {}).then((response) => {

            let estimates = response.data.results;
            let estimateChoices = estimates.map(
                (estimate) => <option value={estimate.id} key={estimate.id}>{estimate.name}</option>
            );
            let selectedEstimateId = estimates[0] ? estimates[0].id : '';
            this.setState(prevState => {
                return {
                    addWorkEntryFormConfig: {
                        ...prevState.addWorkEntryFormConfig,
                        ...{
                            estimateId: {
                                value: selectedEstimateId,
                                choices: estimateChoices
                            },
                            workedDate: {value: ''},
                            workedHours: {value: ''},
                            notes: {value: ''},
                        }
                    },

                };
            }, () => {
                if (estimates && estimates.length > 0) {
                    this.populateActivitiesForEstimateId(estimates[0].id);
                }
            });
        });
    }

    addNewWorkEntryClickHandler() {

        let workEntryData = {
            activity_id: this.state.addWorkEntryFormConfig.activityId.value,
            sub_activity_id: this.state.addWorkEntryFormConfig.subActivityId.value,
            worked_hours: this.state.addWorkEntryFormConfig.workedHours.value,
            date: this.state.addWorkEntryFormConfig.workedDate.value,
            note: this.state.addWorkEntryFormConfig.notes.value,
        };

        let apiUrl;
        if (workEntryData.sub_activity_id && !isNaN(workEntryData.sub_activity_id)) {
            apiUrl = BACKEND_ESTIMATOR_API_URL + "/sub_activity_work_entries/";
            delete workEntryData.activity_id;
        } else {
            apiUrl = BACKEND_ESTIMATOR_API_URL + "/activity_work_entries/";
            delete workEntryData.sub_activity_id;
        }

        ArchestHttp.POST(apiUrl, workEntryData).then((response) => {
            this.hideAddWorkEntryForm();
            this.initWorkEntryList();
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleTimelineWorkEntryFormFieldChange(formElement) {
        const changedFormElement = formElement.target;
        this.setState((prevState) => {
            prevState.addWorkEntryFormConfig[changedFormElement.name]['value'] = changedFormElement.value;
            return prevState;
        });
    }

    handleTimelineWorkEntryFormEstimateIdFieldChange(formElement) {
        this.handleTimelineWorkEntryFormFieldChange(formElement);
        const selectedEstimateId = formElement.target.value;
        this.populateActivitiesForEstimateId(selectedEstimateId);
    }

    handleTimelineWorkEntryFormActivityIdFieldChange(formElement) {
        this.handleTimelineWorkEntryFormFieldChange(formElement);
        const selectedActivateId = formElement.target.value;
        this.populateSubActivitiesForActivityId(selectedActivateId);
    }

    populateActivitiesForEstimateId(estimateId) {
        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/' + estimateId + '/detailed_view/', {}).then(response => {
            let activities = response.data.results;
            let activityIdChoices = _.map(
                activities,
                (activity) => <option value={activity.id} key={activity.id}>{activity.name}</option>
            );
            let selectedActivityId = activities[0] ? activities[0].id : '';
            this.setState(prevState => {
                return {
                    addWorkEntryFormConfig: {
                        ...prevState.addWorkEntryFormConfig,
                        ...{
                            activityId: {
                                value: selectedActivityId,
                                choices: activityIdChoices
                            }
                        }
                    },
                };
            }, () => {
                this.populateSubActivitiesForActivityId(selectedActivityId);
            });

        }).catch(function (error) {
            console.log(error);
        });
    }

    showAddWorkEntryForm() {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.initAddNewWorkEntryForm();
        this.setState({showAddWorkEntryForm: true});
    }

    hideAddWorkEntryForm() {
        this.setState({showAddWorkEntryForm: false});
    }

    async fetchActivityData(activateId) {
        let activityData = {subActivityId: '', subActivities: []};
        if (activateId !== '') {
            let activityDataFetchReq = ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + `/activities/${activateId}/`, {});
            let fetchedActivityData = await activityDataFetchReq;
            let activity = fetchedActivityData.data;
            let subActivityIdChoices = _.map(
                activity.sub_activities,
                (subActivity) => <option value={subActivity.id} key={subActivity.id}>{subActivity.name}</option>
            );
            activityData.subActivityId = activity.sub_activities[0] ? activity.sub_activities[0].id : '';
            activityData.subActivities = subActivityIdChoices;
        }
        return activityData;
    }

    async populateSubActivitiesForActivityId(activateId) {
        let subActivityData = await this.fetchActivityData(activateId);

        this.setState(prevState => {
            return {
                addWorkEntryFormConfig: {
                    ...prevState.addWorkEntryFormConfig,
                    ...{
                        subActivityId: {
                            value: subActivityData.subActivityId,
                            choices: subActivityData.subActivities
                        }
                    }
                },
            };
        });
    }

    render() {
        const workEntryComponents = this.getWorkEntryComponents(this.state.activityWorkEntries);
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent>

                    <ArchestFloatingButtonComponent hidden={this.state.showAddWorkEntryForm}
                                                    icon="add"
                                                    helpText="Add Work Entry"
                                                    onClickHandler={this.showAddWorkEntryForm}/>


                    <Row hidden={!this.state.showAddWorkEntryForm} className="archest-card-container-row">
                        <Col>
                            <Card className="archest-card">
                                <Card.Body className="archest-card-body">
                                    <Form className="archest-timeline-work-entry-form">

                                        <Row>
                                            <Col lg="2">
                                                <Form.Label>Estimate</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.EstimateId'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            size="sm"
                                                            as="select"
                                                            value={this.state.addWorkEntryFormConfig.estimateId.value}
                                                            name="estimateId"
                                                            onChange={this.handleTimelineWorkEntryFormEstimateIdFieldChange}>
                                                            {this.state.addWorkEntryFormConfig.estimateId.choices}
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="2">
                                                <Form.Label>Activity</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.ActivityId'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            size="sm"
                                                            as="select"
                                                            value={this.state.addWorkEntryFormConfig.activityId.value}
                                                            name="activityId"
                                                            onChange={this.handleTimelineWorkEntryFormActivityIdFieldChange}>
                                                            {this.state.addWorkEntryFormConfig.activityId.choices}
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="2">
                                                <Form.Label>Sub Activity</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.SubActivityId'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            size="sm"
                                                            as="select"
                                                            value={this.state.addWorkEntryFormConfig.subActivityId.value}
                                                            name="subActivityId"
                                                            onChange={this.handleTimelineWorkEntryFormFieldChange}>
                                                            {this.state.addWorkEntryFormConfig.subActivityId.choices}
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="2">
                                                <Form.Label>Notes</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="12">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.notes'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            size="sm"
                                                            as="textarea"
                                                            value={this.state.addWorkEntryFormConfig.notes.value}
                                                            name="notes"
                                                            onChange={this.handleTimelineWorkEntryFormFieldChange}>
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="5">
                                                <Form.Label>Worked Date</Form.Label>
                                            </Col>
                                            <Col lg="5">
                                                <Form.Label>Worked Hours</Form.Label>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col lg="5">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.WorkedDate'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            size="sm"
                                                            type="date"
                                                            value={this.state.addWorkEntryFormConfig.workedDate.value}
                                                            name="workedDate"
                                                            onChange={this.handleTimelineWorkEntryFormFieldChange}>
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                            <Col lg="4">
                                                <Form.Group as={Row}
                                                            controlId={'timelineWorkEntryForm.WorkedHours'}
                                                            className="archest-timeline-work-entry-form-group">
                                                    <Col>
                                                        <Form.Control
                                                            type="number"
                                                            min={0}
                                                            size="sm"
                                                            value={this.state.addWorkEntryFormConfig.workedHours.value}
                                                            name="workedHours"
                                                            onChange={this.handleTimelineWorkEntryFormFieldChange}>
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                            <Col lg="3">
                                                <Row>
                                                    <Col>
                                                        <Button style={{
                                                            'float': 'right',
                                                            'width': '6rem',
                                                            'marginLeft': '1.6rem'
                                                        }} size="sm"
                                                                variant="primary"
                                                                onClick={this.addNewWorkEntryClickHandler}>
                                                            Save
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button style={{'float': 'right', 'width': '6rem'}} size="sm"
                                                                variant="secondary"
                                                                onClick={this.hideAddWorkEntryForm}>
                                                            Cancel
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
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