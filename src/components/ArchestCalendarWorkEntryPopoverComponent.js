import React, {Component} from "react";
import {OverlayTrigger, Popover} from "react-bootstrap";
import ArchestWorkEntryComponent from "./ArchestWorkEntryComponent";

class ArchestCalendarWorkEntryPopoverComponent extends Component {

    constructor(props) {
        super(props);
        this.editWorkEntryBtnClickHandler = this.editWorkEntryBtnClickHandler.bind(this);
        this.deleteWorkEntryBtnClickHandler = this.deleteWorkEntryBtnClickHandler.bind(this);
    }

    editWorkEntryBtnClickHandler() {
        document.body.click();
        this.props.editWorkEntryBtnClickHandler(ArchestWorkEntryComponent.getGenericWorkEntryData(this.props.workEntry));
    }

    deleteWorkEntryBtnClickHandler() {
        document.body.click();
        this.props.deleteWorkEntryBtnClickHandler(ArchestWorkEntryComponent.getGenericWorkEntryData(this.props.workEntry));
    }

    render() {
        const renderTooltip = props => {
            props.show = props.show ? 'true' : 'false';
            return (
                <Popover {...props} style={{...props.style, maxWidth: '70%'}}>
                    <ArchestWorkEntryComponent
                        workEntry={this.props.workEntry}
                        editWorkEntryBtnClickHandler={this.editWorkEntryBtnClickHandler}
                        deleteWorkEntryBtnClickHandler={this.deleteWorkEntryBtnClickHandler}
                    />
                </Popover>
            )
        };

        return (
            <OverlayTrigger rootClose={true} placement="auto" trigger={'click'} overlay={renderTooltip}>
                <div className="fc-content">
                    <span className="fc-title">{this.props.title}</span>
                </div>
            </OverlayTrigger>
        );
    }
}

export default ArchestCalendarWorkEntryPopoverComponent;