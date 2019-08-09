import React, {Component} from "react";
import {Button, Card, Col, Row} from "react-bootstrap";
import ArchestEstimateSubActivityItemComponent from "./ArchestEstimateSubActivityItemComponent";

class ArchestEstimateSubActivitiesComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activity: this.props.activity,
            subActivities: this.props.subActivities,
            newlyAddedSubActivityCount: 0
        };
    }

    render() {

        let component = this;

        let subActivities = this.state.subActivities.map(
            (subActivity) => <ArchestEstimateSubActivityItemComponent key={subActivity.id} subActivity={subActivity}/>
        );

        let addSubActivityItem = function () {
            component.setState(prevState => ({
                subActivities: [...prevState.subActivities, {id: `new_sub_activity_${++prevState.newlyAddedSubActivityCount}`, parent_id: prevState.activity.id}]
            }))
        };

        return (
            <Card border="light" bg="light">
                <Card.Header>
                    Sub Activities
                </Card.Header>
                <Card.Body>
                    {subActivities}
                    <Row>
                        <Col>
                            <Button onClick={addSubActivityItem} variant="link" size="sm">
                                <span className="oi oi-plus"/>&nbsp;&nbsp;
                                <span>Add Sub Activity</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
        );
    }
}

export default ArchestEstimateSubActivitiesComponent;
