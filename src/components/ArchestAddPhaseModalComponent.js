import React, {Component} from "react";
import ArchestAuthEnabledComponent from "./ArchestAuthEnabledComponent";
import {BACKEND_ESTIMATOR_API_URL} from "../constants";
import ArchestHttp from "../modules/archest_http";
import {Modal, Button, Card, Form, Row, Col} from "react-bootstrap";
import './styles/ArchestAddPhaseModalComponent.scss';


class ArchestAddPhaseModalComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {phaseName: ''};
        this.onCancel = this.onCancel.bind(this);
        this.onChangePhaseName = this.onChangePhaseName.bind(this);
        this.addPhase = this.addPhase.bind(this);
    }

    onCancel() {
        this.props.onCancel();
        this.setState((prevState) => {
            return {dataLoaded: false}
        });
    }

    addPhase() {
        ArchestHttp.POST(
            `${BACKEND_ESTIMATOR_API_URL}/phases/`,
            {project_id: this.props.project.id, name: this.state.phaseName}
        ).then((response) => {
            console.log(response);
            this.onCancel();
        });
    }

    onChangePhaseName(element) {
        this.setState({
            phaseName: element.target.value
        })
    }

    render() {
        if (!this.props.show) {
            return (<div/>);
        }
        return (
            <ArchestAuthEnabledComponent>
                <Modal show={this.props.show} onHide={this.onCancel}>
                    <Modal.Header closeButton className="archest-modal-header">
                        <Modal.Title className="archest-modal-title">
                            Add Phase to {this.props.project.name}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="archest-modal-body">
                        <Card className="archest-card archest-modal-card">
                            <Card.Body className="archest-card-body">
                                <Form>
                                    <Row>
                                        <Col lg={12}>
                                            <Form.Label>Name</Form.Label>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col lg={12}>
                                            <Form.Group className="archest-add-phase-modal-phase-name-group"
                                                        controlId="addPhaseForm.phaseName">
                                                <Form.Control size="sm" value={this.state.phaseName}
                                                              onChange={(element) => this.onChangePhaseName(element)}/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Modal.Body>
                    <Modal.Footer className="archest-modal-footer">
                        <Button size={'sm'} variant="secondary" onClick={this.onCancel}>Cancel</Button>
                        <Button size={'sm'} variant="primary" onClick={this.addPhase}>Add</Button>
                    </Modal.Footer>
                </Modal>
            </ArchestAuthEnabledComponent>
        );
    }
}

export default ArchestAddPhaseModalComponent;