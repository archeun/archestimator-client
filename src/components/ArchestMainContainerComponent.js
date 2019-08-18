import React, {Component} from "react";
import {Container, Modal, Button, Breadcrumb, OverlayTrigger, Tooltip} from "react-bootstrap";

const _ = require('lodash');

class ArchestMainContainerComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    modalFunctions = {
        onCancelClickHandler: () => {
            if (typeof this.props.modalProps.onCancel === "function") {
                this.props.modalProps.onCancel();
            }
        },
        onConfirmClickHandler: () => {
            if (typeof this.props.modalProps.onConfirm === "function") {
                this.props.modalProps.onConfirm();
            }
        }
    };

    render() {

        let breadcrumbs = _.map(this.props.breadcrumbs, (function (breadcrumb) {
            return (

                <OverlayTrigger key={breadcrumb.title} placement="bottom" overlay={<Tooltip>{breadcrumb.title}</Tooltip>}>
                    <Breadcrumb.Item key={breadcrumb.title} active={breadcrumb.active} href={breadcrumb.url}>
                        {breadcrumb.title}
                    </Breadcrumb.Item>
                </OverlayTrigger>
            )
        }));

        return (
            <Container style={{marginTop: '4%'}}>
                <Modal show={this.props.modalProps.show} onHide={this.modalFunctions.onCancelClickHandler}
                       onShow={this.props.modalProps.onShow}>
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.modalProps.title || 'Confirmation'}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{this.props.modalProps.message || 'Do you really want to proceed?'}</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.modalFunctions.onCancelClickHandler}>
                            {this.props.modalProps.cancelBtnText || 'Cancel'}
                        </Button>
                        <Button variant="primary" onClick={this.modalFunctions.onConfirmClickHandler}>
                            {this.props.modalProps.confirmBtnText || 'Ok'}
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Breadcrumb>
                    {breadcrumbs}
                </Breadcrumb>
                {this.props.children}
            </Container>
        );
    }

}

ArchestMainContainerComponent.defaultProps = {
    modalProps: {
        show: false,
    },
    breadcrumbs: [
        {title: 'Home', url: '/'}
    ]
};

export default ArchestMainContainerComponent;