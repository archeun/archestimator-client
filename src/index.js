import React from 'react';
import ReactDOM from 'react-dom';
import './res/archest-default-theme/index.scss';
import './res/icons/font/css/open-iconic-bootstrap.scss';
import '../node_modules/handsontable/dist/handsontable.full.min.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from "react-router-dom";
import ArchestHomeComponent from "./components/ArchestHomeComponent";
import ArchestLoginComponent from "./components/ArchestLoginComponent";
import ArchestLogoutComponent from "./components/ArchestLogoutComponent";
import ArchestNavbarComponent from "./components/ArchestNavbarComponent";
import ArchestPhaseEstimatesComponent from "./components/ArchestPhaseEstimatesComponent";
import ArchestEstimateViewComponent from "./components/ArchestEstimateViewComponent";
import ArchestEstimateEditComponent from "./components/ArchestEstimateEditComponent";
import ArchestEstimateProgressComponent from "./components/ArchestEstimateProgressComponent";
import ArchestTimelineComponent from "./components/ArchestTimelineComponent.js";
import ArchestCalendarComponent from "./components/ArchestCalendarComponent";

ReactDOM.render(
    <Router>
        <div>
            <ArchestNavbarComponent/>

            <Route path="/" exact component={ArchestHomeComponent}/>
            <Route path="/home" component={ArchestHomeComponent}/>
            <Route path="/timeline" component={ArchestTimelineComponent}/>
            <Route path="/calendar" component={ArchestCalendarComponent}/>
            <Route path="/phase/:phaseId/estimates/" component={ArchestPhaseEstimatesComponent}/>
            <Route path="/estimates/:estimateId/view/" component={ArchestEstimateViewComponent}/>
            <Route path="/estimates/:estimateId/edit/" component={ArchestEstimateEditComponent}/>
            <Route path="/estimates/:estimateId/progress/" component={ArchestEstimateProgressComponent}/>
            <Route path="/login/" component={ArchestLoginComponent}/>
            <Route path="/logout/" component={ArchestLogoutComponent}/>
        </div>
    </Router>,
    document.getElementById('root'),
);

serviceWorker.unregister();
