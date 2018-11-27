import React, { Component } from "react";
import { FormControl, FormGroup, Button } from "react-bootstrap";

class ParamConfigurer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      kVal: "",
      setVal: ""
    };
  }

  onKChange = e => {
    this.setState({ kVal: e.target.value });
  };

  onTrainingSetChange = e => {
    this.setState({ setVal: e.target.value });
  };

  onParamsConfigured = () => {
    this.props.onParamsConfigured(
      parseInt(this.state.kVal),
      parseInt(this.state.setVal)
    );
  };

  render() {
    return (
      <div>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Set K value"
            value={this.state.kVal}
            onChange={this.onKChange}
          />
        </FormGroup>
        <FormGroup>
          <FormControl
            type="text"
            placeholder="Set training set amount"
            value={this.state.setVal}
            onChange={this.onTrainingSetChange}
          />
        </FormGroup>
        <Button bsStyle="primary" onClick={this.onParamsConfigured}>
          Predict
        </Button>
      </div>
    );
  }
}

export default ParamConfigurer;
