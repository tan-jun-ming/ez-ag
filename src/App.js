import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Workspace from './components/Workspace';
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
                        </ul>
                    </nav>
                    <hr />
                    <Switch>
                        <Route exact path='/' component={Home} />
                        <Route exact path='/Login' component={Login} />
                        <Route exact path='/Workspaces' component={Workspace} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

export default App;