import React, { Component } from "react";

class Button extends Component {
  state = {};
  render() {
    return (
      <button
        tabIndex="-1"
        onClick={event => {
          event.currentTarget.blur();
          this.props.handler(this.props.value, this.props.type);
        }}
        id={this.props.id}
        className={`btn ${this.props.subClass} button`}
      >
        {this.props.children}
      </button>
    );
  }
}

export default Button;
