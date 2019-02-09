import React, { Component } from "react";

class ResultDisplay extends Component {
  state = {};
  render() {
    return (
      <div className="alert alert-info" id="display">
        {this.props.children}
      </div>
    );
  }
}

export default ResultDisplay;
