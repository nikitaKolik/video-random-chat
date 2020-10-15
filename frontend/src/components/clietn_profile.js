import React, { Component } from "react";

const url = process.env.REACT_APP_SOCK;

class ClientProfile extends Component {

  render() {
    console.log("toggle", this.props.toggle);
    const {info} = this.props;
    return (
      <div className="app-client-profile-background" style={{ backgroundImage: `url(${info.avatar?`${url}${info.avatar}`:`${url}/public/avatar/unknown.png`})`}}>
        <div className="d-flex flex-column align-items-center app-client-profile">
          <div className="app-cross-div"><i className="fas fa-times my-cursor app-cross" onClick={this.props.toggle()}></i></div>
          <img src={info.avatar?`${url}${info.avatar}`:`${url}/public/avatar/unknown.png`} className="rounded-circle app-client-avatar" alt="Cinque Terre" />
          <h5 className="app-client-name">{info.username}</h5>
          <p><i className="fa fa-map-marker-alt" style={{color: '#eee'}}/>{info.location}</p>
          <div className="app-profile-desc">
            <p>Gender: {info.gender}</p>
            <p>Age: {info.age}</p>
            <p>About Me:</p>
            <p> {info.aboutMe}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default ClientProfile;
