import React, {Component} from "react";
import {LOCAL_STORAGE_TOKEN_KEY} from "../constants";
import {Redirect} from "react-router-dom";


class ArchestAuthEnabledComponent extends Component {

    render() {
        let token = localStorage.getItem(LOCAL_STORAGE_TOKEN_KEY);
        if (!token) {

            return <Redirect
                to={{
                    pathname: "/login",
                    state: {}
                }}
            />
        }
        return (
            <div>
                {this.props.children}
            </div>
        );
    }

}

export default ArchestAuthEnabledComponent;