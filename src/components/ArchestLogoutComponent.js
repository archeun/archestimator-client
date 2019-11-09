import React, {Component} from "react";
import {LOCAL_STORAGE_TOKEN_KEY} from "../constants";


class ArchestLogoutComponent extends Component {

    render() {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
        return (
            <div>
                <h3>Successfully logged out!</h3>
                <p>Click <a href={'/login'}>here</a> to login</p>
            </div>
        );
    }
}

export default ArchestLogoutComponent;
