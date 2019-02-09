import React, { Component } from "react";

class OperationsDisplay extends Component {
  state = {};
  render() {
    return (
      <div id="displayOperations" className="alert alert-success">
        {this.props.children}
      </div>
    );
  }
}

export default OperationsDisplay;
