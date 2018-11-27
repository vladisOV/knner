import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Select from "react-select";
import _ from "lodash";

let options = [];
let labels = [];

class DataChoser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      headers: [],
      selectedFeatures: [],
      selectedLabels: []
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ headers: newProps.headers });
    options = this.getOptions(newProps.headers);
    labels = this.getOptions(newProps.headers);
  }

  getOptions(headers) {
    return _.map(headers, header => {
      return { value: header, label: header };
    });
  }

  onFeatureChange = selected => {
    this.setState({ selectedFeatures: selected });
    console.log(selected, labels[0]);

    // TODO: remove option etc
    // labels = _.remove(labels, label => {
    //   const filtered = _.filter(selected, select => {
    //     return select.value === label.value;
    //   });
    //   console.log(filtered);
    //   return filtered.length > 0;
    // });
  };

  onLabelChange = selected => {
    this.setState({ selectedLabels: selected });
  };

  onDataChosen = () => {
    const { selectedFeatures, selectedLabels } = this.state;
    this.props.onDataChosen(
      selectedFeatures.map(feature => feature.value),
      selectedLabels.map(lab => lab.value)
    );
  };

  render() {
    return (
      <div>
        Choose your destiny
        <Select
          closeMenuOnSelect={false}
          value={this.state.selectedFeatures}
          isMulti
          onChange={this.onFeatureChange}
          className="basic-multi-select"
          classNamePrefix="select"
          options={options}
        />
        <Select
          closeMenuOnSelect={false}
          value={this.state.selectedLabels}
          isMulti
          onChange={this.onLabelChange}
          className="basic-multi-select"
          classNamePrefix="select"
          options={options}
        />
        <Button bsStyle="primary" onClick={this.onDataChosen}>
          Done
        </Button>
      </div>
    );
  }
}

export default DataChoser;
