import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

class ProtectedRoute extends Component{
    render(){
        if(this.props.user && this.props.isLoggedIn){
            return <Route {...this.props} />;
        }else{
            return <Redirect to='/login' />;
        }
    }
}

function mapStateToProps(state) {
    const { user, isLoggedIn } = state.auth;
    return {
      user,
      isLoggedIn
    };
  }
  export default connect(mapStateToProps)(ProtectedRoute);
  