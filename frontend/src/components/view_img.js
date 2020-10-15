import React, { Component } from "react";

class ViewImg extends Component {
  render() {
      console.log("viewImage", this.props.src);
    return (
        <div className="image-modal">
            <span className="close" onClick={this.props.toggle('')}>&times;</span>
            <img src={this.props.src} className="modal-content" alt=""/>
        </div>
    );
  }
}


export default ViewImg;
