import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Workspace from './components/Workspace';
import WorkspaceList from './components/WorkspaceList';
import Plan from './components/plan/Plan';
import User from './components/User';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends Component {

    render() {
        return (
            <Router>
                <div>
                    <h2>Welcome to React Router Tutorial</h2>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <ul className="navbar-nav mr-auto">
                            <li><Link to={'/'} class="nav-link"> Home </Link></li>
                            <li><Link to={'/Login'} className="nav-link"> Login </Link></li>
                            <li><Link to={'/Workspaces'} className="nav-link"> Workspaces </Link></li>
                            <li><Link to={'/Plan'} className="nav-link">Plan</Link></li>
                        </ul>
                    </nav>
                    <hr />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/Login' component={Login} />
                        <Route exact path='/Workspaces' component={WorkspaceList} />
                        <Route exact path='/User' component={User} />
                        <Route exact path="/workspace/:id" component={Workspace} />
                        <Route exact path="/Plan/" component={Plan}/>
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;