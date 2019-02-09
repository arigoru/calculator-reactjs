import React, { Component } from "react";
import Button from "./calculator/button";
import ResultDisplay from "./calculator/resultDisplay";
import OperationsDisplay from "./calculator/operationsDisplay";

let operationString = [
  "", // 0
  "*", // 1
  "/", // 2
  "+", // 3
  "-", // 4
  "=" // 5
];
let showingResult = false;

function cycleOperation(list, operations) {
  let i = 0;
  while (i <= list.length - 1) {
    if (operations.indexOf(list[i].operation) >= 0) {
      list[i + 1] = calculate(list[i], list[i + 1]);
      list.splice(i, 1);
    } else {
      i++;
    }
  }
  return list;
}

function calculateList(listOrigin) {
  let list = [...listOrigin];
  list = cycleOperation(list, [1]); // do multiplication
  list = cycleOperation(list, [2]); // do division
  list = cycleOperation(list, [3, 4]); // do addition and subtraction
  return list[0].operand;
}

function calculate(element, nextElement) {
  switch (element.operation) {
    case 1:
      return {
        operand: element.operand * nextElement.operand,
        operation: nextElement.operation
      };
    case 2:
      return {
        operand: element.operand / nextElement.operand,
        operation: nextElement.operation
      };
    case 3:
      return {
        operand: element.operand + nextElement.operand,
        operation: nextElement.operation
      };
    case 4:
      return {
        operand: element.operand - nextElement.operand,
        operation: nextElement.operation
      };
    default:
      return 0;
  }
}

class Calculator extends Component {
  constructor(props) {
    super(props);
    this.calculatorReference = React.createRef();
    this.state = {
      display: "0",
      hadDecimal: false,
      operations: [],
      buttons: [
        { id: "zero", type: "number", subClass: "btn-info", value: 0 },
        { id: "one", type: "number", subClass: "btn-info", value: 1 },
        { id: "two", type: "number", subClass: "btn-info", value: 2 },
        { id: "three", type: "number", subClass: "btn-info", value: 3 },
        { id: "four", type: "number", subClass: "btn-info", value: 4 },
        { id: "five", type: "number", subClass: "btn-info", value: 5 },
        { id: "six", type: "number", subClass: "btn-info", value: 6 },
        { id: "seven", type: "number", subClass: "btn-info", value: 7 },
        { id: "eight", type: "number", subClass: "btn-info", value: 8 },
        { id: "nine", type: "number", subClass: "btn-info", value: 9 },
        { id: "equals", type: "operation", subClass: "btn-primary", value: 5 },
        {
          id: "multiply",
          type: "operation",
          subClass: "btn-primary",
          value: 1
        },
        { id: "divide", type: "operation", subClass: "btn-primary", value: 2 },
        { id: "add", type: "operation", subClass: "btn-primary", value: 3 },
        {
          id: "subtract",
          type: "operation",
          subClass: "btn-primary",
          value: 4
        },
        { id: "decimal", type: "function", subClass: "btn-info", value: "." },
        { id: "clear", type: "function", subClass: "btn-danger", value: "C" }
      ]
    };
  }

  addOperation = operation => {
    let newOpers = this.state.operations;
    let newNum = parseFloat(this.state.display);
    if (Number.isNaN(newNum)) {
      newOpers[newOpers.length - 1].operation = operation;
    } else {
      newOpers.push({
        operand: newNum,
        operation: operation
      });
    }
    this.setState({
      operations: newOpers,
      display: operationString[operation],
      hadDecimal: false
    });
  };

  clearEverything = () => {
    this.setState({
      display: "0",
      operations: [],
      hadDecimal: false
    });
    showingResult = false;
  };

  addToDisplay = value => {
    let newDisplay = this.state.display + value;
    newDisplay = newDisplay.replace(/^[/*+\-=]+/, "");
    if (newDisplay[0] === ".") newDisplay = "0.";
    newDisplay = newDisplay.replace(/^(0)([^.])/, "$2");
    this.setState({
      display: newDisplay
    });
  };

  showResult = result => {
    this.setState({
      display: result,
      hadDecimal: false
    });
    showingResult = true;
  };

  buttonPressed = (value, type) => {
    if (showingResult) {
      showingResult = false;
      let newDisplay = type === "operation" ? this.state.display : "0";
      this.setState(
        {
          display: newDisplay,
          operations: [],
          hadDecimal: false
        },
        () => this.buttonPressed(value, type)
      );
    } else {
      switch (type) {
        case "function":
          if (value === "C") this.clearEverything();
          else if (!this.state.hadDecimal && value === ".") {
            this.addToDisplay(".");
            this.setState({
              hadDecimal: true
            });
          }
          break;
        case "operation":
          if (value === 5) {
            this.addOperation(5);
            this.showResult(calculateList(this.state.operations));
          } else this.addOperation(value);
          break;
        case "number":
          this.addToDisplay(value);
          break;
        default:
          break;
      }
    }
  };

  componentDidMount() {
    document.addEventListener("keyup", this.keyPressHandler);
  }
  componentWillUnmount() {
    document.removeEventListener("keyup", this.keyPressHandler);
  }

  renderOperations = () => {
    return this.state.operations.reduce((prev, curr) => {
      return prev + curr.operand + ` ${operationString[curr.operation]} `;
    }, "");
  };

  renderButtons = () => {
    return this.state.buttons.map(e => (
      <Button
        type={e.type}
        handler={this.buttonPressed}
        id={e.id}
        subClass={e.subClass}
        key={e.id}
        value={e.value}
      >
        {e.type === "operation" ? operationString[e.value] : e.value}
      </Button>
    ));
  };

  keyPressHandler = e => {
    this.calculatorReference.current.focus();
    switch (e.key) {
      case "0":
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        this.buttonPressed(Number(e.key), "number");
        break;
      case ".":
        this.buttonPressed(e.key, "function");
        break;
      case "C":
      case "c":
        this.buttonPressed("C", "function");
        break;
      case "Enter":
      case "=":
        this.buttonPressed(5, "operation");
        break;
      case "-":
        this.buttonPressed(4, "operation");
        break;
      case "+":
        this.buttonPressed(3, "operation");
        break;
      case "/":
        this.buttonPressed(2, "operation");
        break;
      case "*":
        this.buttonPressed(1, "operation");
        break;
    }
  };

  render() {
    return (
      <div className="calculator bg-dark" ref={this.calculatorReference}>
        {this.renderButtons()}
        <ResultDisplay>{this.state.display}</ResultDisplay>
        <OperationsDisplay>
          {this.renderOperations()}
          {showingResult ? this.state.display : ""}
        </OperationsDisplay>
      </div>
    );
  }
}

export default Calculator;
