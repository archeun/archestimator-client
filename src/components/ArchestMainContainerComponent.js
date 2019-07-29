import React, {Component} from "react";
import {Container} from "react-bootstrap";


class ArchestMainContainerComponent extends Component {

    render() {
        return (
            <Container style={{marginTop: '1%'}}>
                {this.props.children}
            </Container>
        );
    }

}

export default ArchestMainContainerComponent;