import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Link } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import { TableUser, TableAdmin, TableView } from '../Table';
import TableListPage from '../Table/list';
import TableUpdates from '../Table/updates';


import { withAuthentication } from '../Session';

import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';
import Switch from 'react-bootstrap/esm/Switch';

const App = () => (
    <Router>
        <div>
            <Navigation />

            <hr />
            <Switch>
                <Route exact path={ROUTES.LANDING} component={LandingPage} />
                <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
                <Route path={ROUTES.SIGN_IN} component={SignInPage} />
                <Route
                    path={ROUTES.PASSWORD_FORGET}
                    component={PasswordForgetPage}
                />
                <Route path={ROUTES.HOME} component={HomePage} />
                <Route path={ROUTES.ACCOUNT} component={AccountPage} />


                <Route path={ROUTES.TABLE + "/:table_id/:table_date/:table_block"} component={TableUser} />

                <Route exact path={ROUTES.TABLEVIEW} component={TableUpdates} />

                <Route path={ROUTES.TABLEVIEW + "/:table_id/:target_user/:table_date/:table_block"} component={TableView} />

                <Route path={ROUTES.TABLEADMIN + "/:table_id"} component={TableAdmin} />

                <Route exact path={ROUTES.TABLE + "/:table_id"}
                    render={({ match }) => {
                        // Adapted from https://stackoverflow.com/a/50130338
                        let date = new Date();
                        let datestr = new Date(date - (date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];

                        return <Redirect to={`${ROUTES.TABLE}/${match.params.table_id}/${datestr}/1`} />
                    }} />
                <Route exact path={ROUTES.TABLE + "/:table_id/:table_date"}
                    render={({ match }) => (
                        <Redirect to={`${ROUTES.TABLE}/${match.params.table_id}/${match.params.table_date}/1`} />
                    )
                    } />
                <Route exact path={ROUTES.TABLEADMIN} render={({ match }) => {
                    return <TableListPage admin={true} />
                }} />
                <Route exact path={ROUTES.TABLE} render={({ match }) => {
                    return <TableListPage admin={false} />
                }} />
            </Switch>
        </div>
    </Router>
);

export default withAuthentication(App);