import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import Calculator from "./components/calculator";

class App extends Component {
  render() {
    return (
      <div className="App bg-secondary">
        <Calculator />
      </div>
    );
  }
}

export default App;
