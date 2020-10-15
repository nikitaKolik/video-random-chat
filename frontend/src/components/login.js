import React, { Component } from "react";
import { Redirect } from 'react-router-dom';

import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";

import { connect } from "react-redux";
import { login } from "../actions/auth";

const required = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      loading: false,
    };
  }

  onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  }

  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  handleLogin = async (e) => {
    e.preventDefault();

    this.setState({
      loading: true,
    });

    this.form.validateAll();

    const { dispatch, history } = this.props;
    const {username, password} = this.state;
    console.log("login state...", this.state);
    if (this.checkBtn.context._errors.length === 0) {
      var user = await dispatch( login({username, password}) );
      if(user.success === true) {
        history.push("/main");
      }else {
        this.setState({
          loading: false
        });
      };
    }else {
        this.setState({
          loading: false,
        });
    }
  }

  render() {
    const { isLoggedIn, message } = this.props;
    if (isLoggedIn) {
      return <Redirect to="/main" />;
    }
    return (
      <div className="col-md-12">
        <div className="card card-container shadow-lg" style={{backgroundColor:"white"}}>
          <img
            src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
            alt="profile-img"
            className="profile-img-card"
          />
          <Form
            onSubmit={this.handleLogin}
            ref={(c) => {
              this.form = c;
            }}
          >
            <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Username: </div>
                    <input
                      type="text"
                      name="username"
                      className="app-info-input"
                      value={this.state.username}
                      onChange={this.onChangeUsername}
                      style={{ border:'none', borderBottom: "solid 2px #eee"}}
                    />
                </div>

            <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Password: </div>
                  <input
                    type="password"
                    name="password"
                    className="app-info-input"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    validations={[required]}
                    style={{ border:'none', borderBottom: "solid 2px #eee"}}
                  />
                </div>

            <div className="form-group pt-3">
              <button
                className="btn btn-primary btn-block"
                style={{backgroundColor: 'slateblue', border: "none"}}
                disabled={this.state.loading}
              >
                {this.state.loading && (
                  <span className="spinner-border spinner-border-sm"></span>
                )}
                <span>Login</span>
              </button>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <CheckButton
              style={{ display: "none" }}
              ref={(c) => {
                this.checkBtn = c;
              }}
            />
          </Form>
          <div style={{textAlign: 'center'}}>
            Not a member?<a href="/register" style={{color: 'slateblue', display: 'block'}}>Sign up now</a>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { isLoggedIn } = state.auth;
  const { message } = state.message;
  return {
    isLoggedIn,
    message
  };
}

export default connect(mapStateToProps)(Login);
