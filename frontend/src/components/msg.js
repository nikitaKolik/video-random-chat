import React, { Component } from "react";
import { connect } from "react-redux";
const url = process.env.REACT_APP_SOCK;
class Msg extends Component {
  LeftMsg = () => {
    return(
        <div className="d-flex app-msg-p">
            <img src={this.props.avatar?`${url}${this.props.avatar}`:`${url}/public/avatar/unknown.png`} alt="" className="rounded-circle my-cursor app-msg-client-avatar" onClick={this.props.toggle()}/>
            <div className="app-max-width-70">
              <div className=" shadow app-msg-left">
                {this.props.msg.text}
              </div>
              <p className="app-color-grey">{this.props.msg.time}</p>
            </div>
        </div>
    );
  }
  RightMsg = () => {
    return( 
        <div className="d-flex justify-content-end app-msg-p">
        <div className="app-max-width-70">
          <div className="shadow app-msg-right">
            {this.props.msg.text}
          </div>
          <p className="app-color-grey app-textalign-right">{this.props.msg.time}</p>
        </div>
      </div>
    );
  }
  LeftFileMsg = () => {
    return(
        <div className="d-flex app-msg-p">
        <img src={this.props.avatar?`${url}${this.props.avatar}`:`${url}/public/avatar/unknown.png`} alt="" className="rounded-circle my-cursor app-msg-client-avatar" onClick={this.props.toggle()}/>
        <div>
          <div className=" shadow fade-container app-msg-img-border">
            <img src={url+this.props.msg.src} alt="" className="fade-image my-cursor app-file-upload-img" />
            <div className="fade-middle d-flex">
              <div className="fade-text my-cursor app-btn" onClick={this.props.viewImage(url+this.props.msg.src)}>View</div>
              <div className="fade-text my-cursor app-btn"><a target="_blank" href={url+this.props.msg.src} className="app-download" download>Download</a></div>
            </div>
          </div>
          <p className="app-color-grey">{this.props.msg.time}</p>
        </div>
      </div>
    );
  }
  RightFileMsg = () => {
    return(
        <div className="d-flex justify-content-end app-msg-p">
            <div>
              <div className="shadow fade-container my-cursor app-msg-img-border">
                <img src={url+this.props.msg.src} alt="" className="fade-image app-file-upload-img" />
                <div className="fade-middle d-flex">
                  <div className="fade-text my-cursor app-btn"  onClick={this.props.viewImage(url+this.props.msg.src)}>View</div>
                  <div className="fade-text my-cursor app-btn"><a target="_blank" href={url+this.props.msg.src} className="app-download" download>Download</a></div>
                </div>
              </div>
              <p className="app-color-grey app-textalign-right">{this.props.msg.time}</p>
            </div>
          </div>
    );
  }
  render() {
    const {type} = this.props.msg;
    // console.log("msg..", this.props.msg);
    if(type === 'left_msg') return this.LeftMsg();
    if(type === 'right_msg') return this.RightMsg();
    if(type === 'left_file_msg') return this.LeftFileMsg();
    if(type === 'right_file_msg') return this.RightFileMsg();
    return null;
  }
}

function mapStateToProps(state) {
  const { user } = state.auth;
  return {
    user,
  };
}

export default connect(mapStateToProps)(Msg);
