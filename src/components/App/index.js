import React from 'react';
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom';
import { withFirebase } from '../Firebase';

import Navigation from '../Navigation';
import LandingPage from '../Landing';
import SignUpPage from '../SignUp';
import SignInPage from '../SignIn';
import PasswordForgetPage from '../PasswordForget';
import HomePage from '../Home';
import AccountPage from '../Account';
import AdminPage from '../Admin';
import TablePage from '../Table';
import TableListPage from '../Table/list';


import { withAuthentication } from '../Session';


import { AuthUserContext } from '../Session';
import * as ROUTES from '../../constants/routes';

const App = () => (
    <Router>
        <div>
            <Navigation />

            <hr />

            <Route exact path={ROUTES.LANDING} component={LandingPage} />
            <Route path={ROUTES.SIGN_UP} component={SignUpPage} />
            <Route path={ROUTES.SIGN_IN} component={SignInPage} />
            <Route
                path={ROUTES.PASSWORD_FORGET}
                component={PasswordForgetPage}
            />
            <Route path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.ACCOUNT} component={AccountPage} />
            <Route path={ROUTES.ADMIN} component={AdminPage} />
            <Route exact path={ROUTES.TABLE} component={TableListPage} />
            <Route path={ROUTES.TABLE + "/:table_id/:table_date/:table_block"}
                render={({ match }) => {
                    return <TablePage
                        id={match.params.table_id}
                        date={match.params.table_date}
                        block={match.params.table_block}

                    />
                }

                } />
            <Route exact path={ROUTES.TABLE + "/:table_id"}
                render={({ match }) => (
                    <Redirect to={`${ROUTES.TABLE}/${match.params.table_id}/2020-12-10/1`} />
                )
                } />
            <Route exact path={ROUTES.TABLE + "/:table_id/:table_date"}
                render={({ match }) => (
                    <Redirect to={`${ROUTES.TABLE}/${match.params.table_id}/${match.params.table_date}/1`} />
                )
                } />
        </div>
    </Router>
);

export default withAuthentication(App);