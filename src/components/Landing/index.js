import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';

import logo from './img/ez-ag-logo.png';
import mock from './img/ez_ag_mockup.png';
import mock2 from './img/ez_ag_mockup_2.png'
import mock3 from './img/ez_ag_mockup_3.png'

import './landing.css';

import { AuthUserContext, withAuthorization } from '../Session';
import { auth } from 'firebase';
import { fireEvent } from '@testing-library/react';

// const LandingUser = (props) => (
//   <AuthUserContext.Consumer>
//     {authUser => (
//       authUser ? <LandingAuths authUser = {authUser} {...props}/> : <LandingNonAuth/>
//     )}
//   </AuthUserContext.Consumer>
// )

const Landing = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <LandingAuths authUser = {authUser}/> : <LandingNonAuth/>
      }
    </AuthUserContext.Consumer>
  </div>
);

class LandingAuths extends Component {
  constructor(props){
    super(props);

    this.state = {
      curr_user: null,
      isAdmin: false,
    }
  }

  render(){
    return(
      <div>
        <div id = 'announcements'>
          <h1>Announcements</h1>
        </div>
      </div>
    );
  }
}

const LandingNonAuth = () => (
  <div>
    <table id = 'sec1'>
      <tr>
        <td id = 'sec1'><img src= {logo} width = '100'/></td>
        <td id = 'sec1' width = '100%'><h1>Welcome to Easy Agricultire or Ez-Az <br/> Streaminglining Farm Data</h1></td>
      </tr>
    </table>

    <div id = 'sec2'>
      <h1>Description</h1>
      <p>
        In the farming industry, farm managers wnat to know how produce can be most effectively
        utilized. For example, whether any given batch is used fresh, frozen, or juiced.
      </p>

      <p>
        Farm managers under our mentor’s company, Food Origins, accomplishes this by creating spreadsheets
       and distributing them to their farmers to fill in information about their produce. These filled in 
       spreadsheets are then sent back to the manager, who collates them into a master spreadsheet in order 
       to make a decision on the upcoming harvest.
      </p>

      <p>
        This method is slow and inconvenient. Not only are the spreadsheets being passed around using email, 
        the manager will have to collate the spreadsheets manually, using up valuable time and resources. By devising 
        a system to streamline both data gathering and collation, we can free up resources that can be better spent elsewhere, 
        ultimately lowering the cost of food for consumers.
      </p>
    </div>

    <div id = 'sec3'>
      <h1>Solution</h1>
      <p>
        The problem with the current data entry method was, that it was slow and sometimes the data that would reach people 
        would be inaccurate or out of date. Our solution was to design a system where admin users can create tables dynamically 
        for users who would input the data directly onto them eliminating the passing around of spreadsheets. 
      </p>

      <p>
        We are delivering a simple web application that allows the user to keep everything up to date; as well as, keep the data in 
        order. To allow all users, the ability to view and edit data as they see fit so they can be offered with the best predictions 
        for what to do with their products and maintain any labor as low as possible. This project uses React and Firebase.
      </p>  
    </div>

    <div id = 'sec4'>
      <h1>Plan and Iterations</h1>
      <div class="row">
        <div class="column"><img src = {mock} style= {{width:"100%"}}/></div>
        <div class="column"><img src = {mock2} style= {{width:"100%"}}/></div>
        <div class="column"><img src = {mock3} style= {{width:"100%"}}/></div>
      </div>
      <p>
        Our original plan was to be able to assign users to groups called workspaces, and each workspaces would be assigned a 
        workflow, which was the name we were going to use for the spreadsheet. We have since scaled this design down through various 
        iterations and mockups with our mentor’s advice. Our current plan is to simply allow managers to create spreadsheets, and allow 
        each user to have their own copy of the spreadsheet to add values to.
      </p>
    </div>

    <div id = 'sec5'>
      <h1>Future Work</h1>
      <p>
        More work can be put into this project. For example, we could allow multiple users to work on the same iteration of a spreadsheet.
      </p>

      <p>
        Aside from that, some spreadsheet formulas do not fully work, likely due to issues in the library that are outside our scope of expertise. Rectifying 
        this issue may be a project worth undertaking for a future group.  
      </p>

    </div>
    <footer>
      <p>Authors: <br/>
        Antonio Felix: <a href="mailto:anfelix@csumb.edu">anfelix@csumb.edu</a><br/>
        Jun Ming Tang: <a href="mailto:jtan@csumb.edu">jtan@csumb.edu</a><br/>
        Mikal Whaley: <a href="mailto:mwhaley@csumb.edu">mwhaley@csumb.edu</a>
      </p> 
    </footer>
  </div>
)

const INITIAL_STATE = {
  c_user: null,
  isAdmin: false,
}


const LandingPage = compose(
  withRouter,
  withFirebase,
)(Landing);
 
export default Landing;