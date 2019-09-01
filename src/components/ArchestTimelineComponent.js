import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import ArchestMainContainerComponent from "./ArchestMainContainerComponent";
import {ACTIVITY_WORK_ENTRY_TYPE, BACKEND_ESTIMATOR_API_URL, SUB_ACTIVITY_WORK_ENTRY_TYPE} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestWorkEntryComponent from "./ArchestWorkEntryComponent";
import {Button, Card, Col, Form, Row} from "react-bootstrap";
import ArchestFloatingButtonComponent from "./ArchestFloatingButtonComponent";
import './styles/ArchestTimeline.scss';
import ArchestToastMessageComponent from "./ArchestToastMessageComponent";

const _ = require('lodash');
var moment = require('moment');


class ArchestTimelineComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activityWorkEntries: [],
            subActivityWorkEntries: [],
            addWorkEntryFormConfig: {
                workEntryType: '',
                workEntryId: false,
                estimateId: {value: '', choices: []},
                activityId: {value: '', choices: []},
                subActivityId: {value: '', choices: []},
                workedDate: {value: ''},
                workedHours: {value: ''},
                notes: {value: ''},
            },
            showWorkEntryForm: false,
            modalProps: {},
        };

        this.saveWorkEntryClickHandler = this.saveWorkEntryClickHandler.bind(this);
        this.handleTimelineWorkEntryFormFieldChange = this.handleTimelineWorkEntryFormFieldChange.bind(this);
        this.handleTimelineWorkEntryFormEstimateIdFieldChange = this.handleTimelineWorkEntryFormEstimateIdFieldChange.bind(this);
        this.handleTimelineWorkEntryFormActivityIdFieldChange = this.handleTimelineWorkEntryFormActivityIdFieldChange.bind(this);
        this.fetchActivityData = this.fetchActivityData.bind(this);
        this.showWorkEntryForm = this.showWorkEntryForm.bind(this);
        this.hideWorkEntryForm = this.hideWorkEntryForm.bind(this);
        this.initWorkEntryForm = this.initWorkEntryForm.bind(this);
        this.initWorkEntryList = this.initWorkEntryList.bind(this);
        this.editWorkEntryBtnClickHandler = this.editWorkEntryBtnClickHandler.bind(this);
        this.deleteWorkEntryBtnClickHandler = this.deleteWorkEntryBtnClickHandler.bind(this);
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

    initWorkEntryForm(selectedWorkEntry = false) {
        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/', {}).then((response) => {

            let estimates = response.data.results;
            let estimateChoices = estimates.map(
                (estimate) => <option value={estimate.id} key={estimate.id}>{estimate.name}</option>
            );

            let selectedEstimateId;

            if (selectedWorkEntry) {
                selectedEstimateId = selectedWorkEntry.estimateId;
            } else if (estimates[0]) {
                selectedEstimateId = estimates[0].id;
            } else {
                selectedEstimateId = '';
            }
            this.setState(prevState => {
                let workedDate = moment();
                let workedHours = '';
                let notes = '';
                let workEntryId = false;
                let workEntryType = false;

                if (selectedWorkEntry) {
                    workEntryType = selectedWorkEntry.workEntryType;
                    workEntryId = selectedWorkEntry.id;
                    workedDate = selectedWorkEntry.date;
                    workedHours = selectedWorkEntry.worked_hours;
                    notes = selectedWorkEntry.note || '';
                }

                return {
                    addWorkEntryFormConfig: {
                        ...prevState.addWorkEntryFormConfig,
                        ...{
                            workEntryType: workEntryType,
                            workEntryId: workEntryId,
                            estimateId: {
                                value: selectedEstimateId,
                                choices: estimateChoices
                            },
                            workedDate: {value: workedDate},
                            workedHours: {value: workedHours},
                            notes: {value: notes},
                        }
                    },

                };
            }, () => {
                if (selectedEstimateId !== '') {
                    this.populateActivitiesForEstimateId(selectedEstimateId, selectedWorkEntry);
                }
            });
        });
    }

    async saveWorkEntryClickHandler() {

        let workEntryData = {
            workEntryType: this.state.addWorkEntryFormConfig.workEntryType,
            activity_id: this.state.addWorkEntryFormConfig.activityId.value,
            sub_activity_id: this.state.addWorkEntryFormConfig.subActivityId.value,
            worked_hours: this.state.addWorkEntryFormConfig.workedHours.value,
            date: this.state.addWorkEntryFormConfig.workedDate.value,
            note: this.state.addWorkEntryFormConfig.notes.value,
        };

        let workEntryId = this.state.addWorkEntryFormConfig.workEntryId;
        let isEditMode = workEntryId !== false;
        let apiRequest;

        if (workEntryData.sub_activity_id && !isNaN(workEntryData.sub_activity_id)) {
            delete workEntryData.activity_id;
            if (isEditMode) {
                if (workEntryData.workEntryType === SUB_ACTIVITY_WORK_ENTRY_TYPE) {
                    apiRequest = ArchestHttp.PATCH(`${BACKEND_ESTIMATOR_API_URL}/sub_activity_work_entries/${workEntryId}/`, workEntryData)
                } else {
                    await ArchestHttp.DELETE(`${BACKEND_ESTIMATOR_API_URL}/activity_work_entries/${workEntryId}/`, {}).then((response) => {
                        apiRequest = ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/sub_activity_work_entries/", workEntryData)
                    });
                }
            } else {
                apiRequest = ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/sub_activity_work_entries/", workEntryData)
            }
        } else {
            delete workEntryData.sub_activity_id;
            if (isEditMode) {
                if (workEntryData.workEntryType === ACTIVITY_WORK_ENTRY_TYPE) {
                    apiRequest = ArchestHttp.PATCH(`${BACKEND_ESTIMATOR_API_URL}/activity_work_entries/${workEntryId}/`, workEntryData)
                } else {
                    await ArchestHttp.DELETE(`${BACKEND_ESTIMATOR_API_URL}/sub_activity_work_entries/${workEntryId}/`, {}).then((response) => {
                        apiRequest = ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/activity_work_entries/", workEntryData)
                    });
                }
            } else {
                apiRequest = ArchestHttp.POST(BACKEND_ESTIMATOR_API_URL + "/activity_work_entries/", workEntryData)
            }
        }

        apiRequest.then((response) => {
            this.hideWorkEntryForm();
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

    populateActivitiesForEstimateId(estimateId, selectedWorkEntry = false) {
        ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + '/estimates/' + estimateId + '/detailed_view/', {}).then(response => {
            let activities = response.data.results;
            let activityIdChoices = _.map(
                activities,
                (activity) => <option value={activity.id} key={activity.id}>{activity.name}</option>
            );

            let selectedActivityId = activities[0] ? activities[0].id : '';

            if (selectedWorkEntry) {
                selectedActivityId = selectedWorkEntry.activityId;
            }
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
                this.populateSubActivitiesForActivityId(selectedActivityId, selectedWorkEntry);
            });

        }).catch(function (error) {
            console.log(error);
        });
    }

    showWorkEntryForm(workEntry = false) {
        window.scrollTo({top: 0, behavior: 'smooth'});
        this.initWorkEntryForm(workEntry);
        this.setState({showWorkEntryForm: true});
    }

    hideWorkEntryForm() {
        this.setState({showWorkEntryForm: false});
    }

    async fetchActivityData(activateId, selectedWorkEntry) {
        let activityData = {subActivityId: '', subActivities: []};
        if (activateId !== '') {
            let activityDataFetchReq = ArchestHttp.GET(BACKEND_ESTIMATOR_API_URL + `/activities/${activateId}/`, {});
            let fetchedActivityData = await activityDataFetchReq;
            let activity = fetchedActivityData.data;
            let subActivityIdChoices = _.map(
                activity.sub_activities,
                (subActivity) => <option value={subActivity.id} key={subActivity.id}>{subActivity.name}</option>
            );
            subActivityIdChoices.unshift(<option value='' key=''/>);
            if (selectedWorkEntry) {
                activityData.subActivityId = selectedWorkEntry.subActivityId ? selectedWorkEntry.subActivityId : '';
            } else {
                activityData.subActivityId = activity.sub_activities[0] ? activity.sub_activities[0].id : '';
            }
            activityData.subActivities = subActivityIdChoices;
        }
        return activityData;
    }

    async populateSubActivitiesForActivityId(activateId, selectedWorkEntry = false) {
        let subActivityData = await this.fetchActivityData(activateId, selectedWorkEntry);

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

    editWorkEntryBtnClickHandler(workEntry) {
        this.showWorkEntryForm(workEntry);
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

    render() {
        const workEntryComponents = this.getWorkEntryComponents();
        return (
            <ArchestAuthEnabledComponent>
                <ArchestMainContainerComponent modalProps={this.state.modalProps}>

                    <ArchestFloatingButtonComponent hidden={this.state.showWorkEntryForm}
                                                    icon="add"
                                                    helpText="Add Work Entry"
                                                    onClickHandler={this.showWorkEntryForm}/>


                    <Row hidden={!this.state.showWorkEntryForm} className="archest-card-container-row">
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
                                                                onClick={this.saveWorkEntryClickHandler}>
                                                            Save
                                                        </Button>
                                                    </Col>
                                                    <Col>
                                                        <Button style={{'float': 'right', 'width': '6rem'}} size="sm"
                                                                variant="secondary"
                                                                onClick={this.hideWorkEntryForm}>
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

    getWorkEntryComponents() {

        return _.map(
            this.getSortedWorkEntries(),
            (workEntry) => <ArchestWorkEntryComponent
                workEntry={workEntry}
                key={`${workEntry.workEntryType}_${workEntry.id}`}
                editWorkEntryBtnClickHandler={this.editWorkEntryBtnClickHandler}
                deleteWorkEntryBtnClickHandler={this.deleteWorkEntryBtnClickHandler}
            />
        );

    }

    getSortedWorkEntries() {
        let workEntries = this.state.activityWorkEntries.concat(this.state.subActivityWorkEntries);
        workEntries = _.map(workEntries, (workEntry) => {
            if (workEntry.sub_activity) {
                workEntry.workEntryType = SUB_ACTIVITY_WORK_ENTRY_TYPE;
            } else {
                workEntry.workEntryType = ACTIVITY_WORK_ENTRY_TYPE;
            }
            return workEntry;
        });
        return _.orderBy(workEntries, ['date'], ['desc']);
    }

}

export default ArchestTimelineComponent;