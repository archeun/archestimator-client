import React, {Component} from "react";
import {Button, OverlayTrigger, Tooltip} from "react-bootstrap";

class ArchestFloatingButtonComponent extends Component {

    render() {
        return <OverlayTrigger
            key={'archest-floating-btn'}
            placement="top"
            overlay={<Tooltip>{this.props.helpText}</Tooltip>}>

            <Button hidden={this.props.hidden}
                    size={'sm'}
                    style={{
                        'position': 'fixed',
                        'top': '90%',
                        'left': '95%',
                        'borderRadius': '100%',
                        'width': '43px',
                        'height': '43px',
                    }}
                    onClick={() => this.props.onClickHandler()}
            >
                <i className="material-icons archest-inline-icon">add</i>
            </Button>
        </OverlayTrigger>
    }
}

export default ArchestFloatingButtonComponent;