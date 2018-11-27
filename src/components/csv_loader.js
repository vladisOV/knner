import React, { Component } from "react";
import { FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import _ from "lodash";

class CSVLoader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: {}
    };
    this.fileReader = new FileReader();
  }

  render() {
    return (
      <div>
        <FormGroup>
          <ControlLabel> Upload your CSV data </ControlLabel>
          <FormControl
            type="file"
            onChange={e => this.onFileUpload(e.target.files[0])}
          />
        </FormGroup>
      </div>
    );
  }

  onFileUpload = file => {
    this.fileReader = new FileReader();
    this.fileReader.onloadend = this.readData;
    this.fileReader.readAsText(file);
  };

  readData = e => {
    let data = this.fileReader.result;
    let converters = {};

    data = _.map(data.split("\n"), d => d.split(","));
    data = _.dropRightWhile(data, val => _.isEqual(val, [""]));
    const headers = _.first(data);

    data = _.map(data, (row, index) => {
      if (index === 0) {
        return row;
      }
      return _.map(row, (element, index) => {
        if (converters[headers[index]]) {
          const converted = converters[headers[index]](element);
          return _.isNaN(converted) ? element : converted;
        }

        const result = parseFloat(element.replace('"', ""));
        return _.isNaN(result) ? element : result;
      });
    });

    data.shift();

    this.setState({
      file: {
        data: data,
        headers: headers
      }
    });
    this.props.onFileUploaded(this.state.file);
  };
}

export default CSVLoader;
