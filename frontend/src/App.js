import React, { Component } from "react";
import { connect } from "react-redux";
import { Router, Switch, Route, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/login";
import Register from "./components/register";
import Main from "./components/main";
import AdminBoard from './components/admin';
import ProtectedRoute from './protected_route';
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import { history } from './helpers/history';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: undefined,
    };

    history.listen((location) => {
      props.dispatch(clearMessage()); // clear message when changing location
    });
  }

  componentDidMount() {
    const user = this.props.user;
    if (user) {
      this.setState({
        currentUser: user,
      });
    }
  }

  logOut = () => {
    this.props.dispatch(logout(this.props.user));
  }

  render() {
    console.log("env testing...", process.env );
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path={"/"} ><Redirect to="/login" /></Route>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute exact path="/main" component={Main} />
            <Route exact path="/admin" component={AdminBoard} />
          </Switch>
        </div>
      </Router>
    );
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}
export default connect(mapStateToProps)(App);
