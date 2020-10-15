import React, { Component } from "react";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import UploadService from '../services/upload.service';
import countryList from 'react-select-country-list';
import { connect } from "react-redux";
import { register } from "../actions/auth";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      age: 0,
      gender: 'Male',
      location: '',
      aboutMe: '',
      file: null,
      avatarSrc: null,
      successful: false,
    };
    this.hiddenFileInput = React.createRef();
    this.locationOptions = countryList().getData().map((item, idx) => {
      return <option key={idx}>{item.label}</option>;
    });
  }

  onChangeUsername = (e) => {
    this.setState({
      username: e.target.value,
    });
  }
  onChangeAge = (e) => {
    this.setState({
      age: e.target.value,
    });
  }
  onChangeGender = (e) => {
    this.setState({
      gender: e.target.value,
    });
  }
  onChangeLocation = (e) => {
    this.setState({
      location: e.target.value,
    });
  }
  onChangeAboutMe = (e) => {
    this.setState({
      aboutMe: e.target.value,
    });
  }
  onChangePassword = (e) => {
    this.setState({
      password: e.target.value,
    });
  }

  handleRegister = async (e) => {
    e.preventDefault();

    this.setState({
      successful: false,
    });

    this.form.validateAll();
    const {file, username, age, gender, location, password, aboutMe} = this.state;
    let avatar;
    if (this.checkBtn.context._errors.length === 0) {
      if(file){
        avatar = await UploadService.uploadAvatar(file);
      }
      var response = await this.props.dispatch( register({ username, age, gender, location, password, aboutMe, avatar }) );
      if(response.success === true){
          this.setState({
            successful: true,
          });
          this.props.history.push("/login");
          window.location.reload();
        }else {
          this.setState({
            successful: false,
          });
        }
    }
  }
  handleClick = async event => {
    await this.hiddenFileInput.current.click();
  };
  handleChange = async event => {
    const fileUploaded = event.target.files[0];
    if(fileUploaded){
        console.log(fileUploaded);
        await this.readURL(fileUploaded);
        await this.setState({file: fileUploaded});
    }
  }
  readURL = async (file) => {
    if (file) {
        var reader = new FileReader();

        reader.onload = async (e) => {
          await this.setState({avatarSrc: e.target.result});
        };

        reader.readAsDataURL(file);
    }
  }
  render() {
    const { message } = this.props;
    const {file, avatarSrc} = this.state;
    return (
      <div className="col-md-12">
        <div className="card card-container shadow-lg" style={{backgroundColor:"white"}}>
          <input type="file"
                ref={this.hiddenFileInput}
                onChange={this.handleChange}
                style={{display:'none'}} 
          /> 
          <img
            src={file ? avatarSrc : "//ssl.gstatic.com/accounts/ui/avatar_2x.png"}
            alt="profile-img"
            className="profile-img-card"
            onClick={this.handleClick}
          />

          <Form
            onSubmit={this.handleRegister}
            ref={(c) => {
              this.form = c;
            }}
          >
            {!this.state.successful && (
              <div>
                <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Username: </div>
                  <input
                    type="text"
                    name="username"
                    className="app-info-input"
                    autoComplete="off"
                    value={this.state.username}
                    onChange={this.onChangeUsername}
                    style={{ border:'none', borderBottom: "solid 2px #eee"}}
                    required
                  />
                </div>
                <div className="d-flex pt-3 justify-content-between form-group">
                  <div className="d-flex form-group">
                    <div style={{color: '#ccc', paddingRight: '6px'}}>gender: </div>
                    <select 
                      style={{ border:'none', borderBottom: "solid 2px #eee"}}
                      value={this.state.gender}
                      onChange={this.onChangeGender}
                      required
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>orther</option>
                    </select>
                  </div>
                  <div className="d-flex form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Age: </div>
                  <input
                        type="number"
                        name="username"
                        value={this.state.age}
                        autoComplete="off"
                        onChange={this.onChangeAge}
                        style={{ border:'none', borderBottom: "solid 2px #eee", width: "50px"}}
                        min='13'
                        max='99'
                        required
                  />
                  </div>
                </div>
                <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Location: </div>
                  <select 
                      style={{ border:'none', borderBottom: "solid 2px #eee", maxWidth: "178px"}}
                      value={this.state.location}
                      onChange={this.onChangeLocation}
                      required
                    >
                      {
                        this.locationOptions
                      }
                    </select>
                </div>
                <div className="d-flex pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>Password: </div>
                  <input
                    type="password"
                    name="password"
                    className="app-info-input"
                    value={this.state.password}
                    onChange={this.onChangePassword}
                    style={{ border:'none', borderBottom: "solid 2px #eee"}}
                    required
                  />
                </div>
                <div className="pt-3 form-group">
                  <div style={{color: '#ccc', paddingRight: '6px'}}>About me: </div>
                  <textarea
                    row="3"
                    value={this.state.aboutMe}
                    onChange={this.onChangeAboutMe}
                    // validations={[required, vpassword]}
                    style={{ border:'none', borderBottom: "solid 2px #eee", width: "100%"}}
                  />
                </div>
                <div className="form-group pt-3">
                  <button className="btn btn-primary btn-block" style={{backgroundColor: 'slateblue', border: "none"}}>Sign Up</button>
                </div>
              </div>
            )}

            {message && (
              <div className="form-group">
                <div className={ this.state.successful ? "alert alert-success" : "alert alert-danger" } role="alert">
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { message } = state.message;
  return {
    message,
  };
}

export default connect(mapStateToProps)(Register);
