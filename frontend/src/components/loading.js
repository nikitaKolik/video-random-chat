import React, { Component } from "react";

class Loading extends Component {

  render() {
    return ( 
        <div className="app-loading">
            <div className="dotsContainer" >
              <h1>Finding</h1>
              <span id="dot1"></span>
              <span id="dot2"></span>
              <span id="dot3"></span>
            </div>
        </div>
    );
  }
}

export default Loading;
