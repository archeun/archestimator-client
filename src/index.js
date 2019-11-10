import React from 'react';
import ReactDOM from 'react-dom';
import './res/archest-default-theme/index.scss';
import './res/icons/font/css/open-iconic-bootstrap.scss';
import '../node_modules/handsontable/dist/handsontable.full.min.css';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router, Route} from "react-router-dom";
import ArchestProjectPhasesComponent from "./components/ArchestProjectPhasesComponent";
import ArchestLoginComponent from "./components/ArchestLoginComponent";
import ArchestLogoutComponent from "./components/ArchestLogoutComponent";
import ArchestNavbarComponent from "./components/ArchestNavbarComponent";
import ArchestPhaseEstimatesComponent from "./components/ArchestPhaseEstimatesComponent";
import ArchestEstimateViewComponent from "./components/ArchestEstimateViewComponent";
import ArchestEstimateEditComponent from "./components/ArchestEstimateEditComponent";
import ArchestEstimateProgressComponent from "./components/ArchestEstimateProgressComponent";
import ArchestTimelineComponent from "./components/ArchestTimelineComponent.js";
import ArchestCalendarComponent from "./components/ArchestCalendarComponent";
import ArchestProjectsComponent from "./components/ArchestProjectsComponent";
import ArchestEditPhaseComponent from "./components/ArchestEditPhaseComponent";

ReactDOM.render(
    <Router>
        <div>
            <ArchestNavbarComponent/>

            <Route path="/" exact component={ArchestProjectsComponent}/>
            <Route path="/home/" exact component={ArchestProjectsComponent}/>
            <Route path="/projects/" exact component={ArchestProjectsComponent}/>
            <Route path="/projects/:projectId/phases/" exact component={ArchestProjectPhasesComponent}/>
            <Route path="/timeline/" exact component={ArchestTimelineComponent}/>
            <Route path="/calendar/" exact component={ArchestCalendarComponent}/>
            <Route path="/phases/:phaseId/edit/" exact component={ArchestEditPhaseComponent}/>
            <Route path="/phases/:phaseId/estimates/" exact component={ArchestPhaseEstimatesComponent}/>
            <Route path="/estimates/:estimateId/view/" exact component={ArchestEstimateViewComponent}/>
            <Route path="/estimates/:estimateId/edit/" exact component={ArchestEstimateEditComponent}/>
            <Route path="/estimates/:estimateId/progress/" exact component={ArchestEstimateProgressComponent}/>
            <Route path="/login/" component={ArchestLoginComponent}/>
            <Route path="/logout/" component={ArchestLogoutComponent}/>
        </div>
    </Router>,
    document.getElementById('root'),
);

serviceWorker.unregister();
