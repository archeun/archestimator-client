import React, {Component} from "react";
import {Button, Col, Form, Modal, Row} from "react-bootstrap";
import {ACTIVITY_WORK_ENTRY_TYPE, BACKEND_ESTIMATOR_API_URL, SUB_ACTIVITY_WORK_ENTRY_TYPE} from "../constants";
import ArchestHttp from "../modules/archest_http";
import ArchestFloatingButtonComponent from "./ArchestFloatingButtonComponent";

const _ = require('lodash');
const moment = require('moment');

class ArchestTimelineComponent extends Component {


    constructor(props) {
        super(props);

        this.state = {
            showWorkEntryFormModal: false,
            addWorkEntryFormConfig: {
                workEntryType: '',
                workEntryId: false,
                estimateId: {value: '', choices: [], valid: true},
                activityId: {value: '', choices: [], valid: true},
                subActivityId: {value: '', choices: [], valid: true},
                workedDate: {value: '', valid: true},
                workedHours: {value: '', valid: true},
                notes: {value: '', valid: true},
            },
            validated: true,
        };


        this.handleTimelineWorkEntryFormFieldChange = this.handleTimelineWorkEntryFormFieldChange.bind(this);
        this.handleTimelineWorkEntryFormEstimateIdFieldChange = this.handleTimelineWorkEntryFormEstimateIdFieldChange.bind(this);
        this.handleTimelineWorkEntryFormActivityIdFieldChange = this.handleTimelineWorkEntryFormActivityIdFieldChange.bind(this);
        this.fetchActivityData = this.fetchActivityData.bind(this);

        this.handleFormCancelAction = this.handleFormCancelAction.bind(this);
        this.handleFormSaveAction = this.handleFormSaveAction.bind(this);

        this.closeModal = this.closeModal.bind(this);
        this.openModal = this.openModal.bind(this);
    }

    componentWillReceiveProps(props) {
        if (props.workEntry) {
            this.openModal();
            this.initWorkEntryForm(props.workEntry);
        }
    }

    componentDidMount() {
        this.initWorkEntryForm();
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
            const today = moment(moment(), "YYYY-MM-DD").format('YYYY-MM-DD');
            this.setState(prevState => {
                let workedDate = today;
                let workedHours = '';
                let notes = '';
                let workEntryId = false;
                let workEntryType = false;
                if (selectedWorkEntry) {
                    workEntryType = selectedWorkEntry.workEntryType ? selectedWorkEntry.workEntryType : false;
                    workEntryId = selectedWorkEntry.id ? selectedWorkEntry.id : false;
                    workedDate = selectedWorkEntry.date ? selectedWorkEntry.date : today;
                    workedHours = selectedWorkEntry.worked_hours ? selectedWorkEntry.worked_hours : '';
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
                if (selectedEstimateId !== '' && typeof selectedEstimateId !== 'undefined') {
                    this.populateActivitiesForEstimateId(selectedEstimateId, selectedWorkEntry);
                }
            });
        });
    }

    runValidations(workEntryData) {
        console.log(workEntryData);
    }

    async handleFormSaveAction(event) {

        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        this.setState({validated: true});

        let workEntryData = {
            workEntryType: this.state.addWorkEntryFormConfig.workEntryType,
            activity_id: this.state.addWorkEntryFormConfig.activityId.value,
            sub_activity_id: this.state.addWorkEntryFormConfig.subActivityId.value,
            worked_hours: this.state.addWorkEntryFormConfig.workedHours.value,
            date: this.state.addWorkEntryFormConfig.workedDate.value,
            note: this.state.addWorkEntryFormConfig.notes.value,
        };

        this.runValidations(workEntryData);

        let workEntryId = this.state.addWorkEntryFormConfig.workEntryId;
        let isEditMode = workEntryId !== false && !isNaN(workEntryId);
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
            this.initWorkEntryForm();
            this.closeModal();
            if (typeof this.props.postSaveCallback === 'function') {
                this.props.postSaveCallback(response);
            }
        }).catch(function (error) {
            console.log(error);
        });
    }

    handleFormCancelAction() {
        this.initWorkEntryForm();
        this.closeModal();
        if (typeof this.props.cancelCallback === 'function') {
            this.props.cancelCallback();
        }
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

    closeModal() {
        this.setState({showWorkEntryFormModal: false});
    }

    openModal() {
        this.setState({showWorkEntryFormModal: true});
    }

    render() {

        return (

            <div>
                <ArchestFloatingButtonComponent hidden={this.state.showWorkEntryFormModal}
                                                icon="add"
                                                helpText="Add Work Entry"
                                                onClickHandler={this.openModal}/>

                <Modal show={this.state.showWorkEntryFormModal} onHide={this.closeModal} onShow={() => {
                }}>
                    <Modal.Header closeButton>
                        <Modal.Title>Work Entry</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="archest-card-container-row">
                            <Col>
                                <Form noValidate validated={this.state.validated}
                                      className="archest-timeline-work-entry-form">

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
                                        <Col lg="3">
                                            <Form.Label>Worked Date</Form.Label>
                                        </Col>
                                        <Col lg="3">
                                            <Form.Label>Worked Hours</Form.Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg="3">
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
                                                    <Form.Control.Feedback type="invalid">
                                                        Required
                                                    </Form.Control.Feedback>
                                                    <Form.Control.Feedback>AHA</Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col lg="3">
                                            <Form.Group as={Row}
                                                        controlId={'timelineWorkEntryForm.WorkedHours'}
                                                        className="archest-timeline-work-entry-form-group">
                                                <Col>
                                                    <Form.Control
                                                        required
                                                        type="number"
                                                        min={0}
                                                        size="sm"
                                                        value={this.state.addWorkEntryFormConfig.workedHours.value}
                                                        name="workedHours"
                                                        onChange={this.handleTimelineWorkEntryFormFieldChange}>
                                                    </Form.Control>
                                                    <Form.Control.Feedback type="invalid">
                                                        Required
                                                    </Form.Control.Feedback>
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col lg="1"/>
                                        <Col lg="5">
                                            <Row>
                                                <Col>
                                                    <Button style={{
                                                        'float': 'right',
                                                        'width': '6rem',
                                                        'marginLeft': '3.7rem'
                                                    }} size="sm"
                                                            variant="primary"
                                                            onClick={this.handleFormSaveAction}>
                                                        Save
                                                    </Button>
                                                </Col>
                                                <Col>
                                                    <Button style={{'float': 'right', 'width': '6rem'}}
                                                            size="sm"
                                                            variant="secondary"
                                                            onClick={this.handleFormCancelAction}>
                                                        Cancel
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Form>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
            </div>


        );
    }
}

export default ArchestTimelineComponent;