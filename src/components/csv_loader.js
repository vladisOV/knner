import React, { Component } from "react";
import { FormControl, FormGroup, ControlLabel } from "react-bootstrap";
import _ from "lodash";
import shuffleSeed from "shuffle-seed";

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
    let dataColumns = [];
    let labelColumns = [];
    let converters = {};
    let shuffle = true;
    let splitTest = true;

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

    //TODO extract columns later
    // let labels = this.extractColumns(data, labelColumns);
    // data = this.extractColumns(data, dataColumns);
    // console.log("Labels ", labels);

    data.shift();
    // labels.shift();

    // if (shuffle) {
    //   data = shuffleSeed.shuffle(data, "phrase");
    //   labels = shuffleSeed.shuffle(labels, "phrase");
    // }

    if (splitTest) {
      const trainSize = _.isNumber(splitTest)
        ? splitTest
        : Math.floor(data.length / 2);

      // this.setState({
      //   file: {
      //     features: data.slice(trainSize),
      //     labels: labels.slice(trainSize),
      //     testFeatures: data.slice(0, trainSize),
      //     testLabels: labels.slice(0, trainSize)
      //   }
      // });
    } else {
      // this.setState({
      //   file: {
      //     features: data,
      //     labels
      //   }
      // });
    }
    this.setState({
      file: {
        data: data,
        headers: headers
      }
    });
    this.props.onFileUploaded(this.state.file);
  };

  extractColumns(data, columnNames) {
    const headers = _.first(data);

    const indexes = _.map(columnNames, column => headers.indexOf(column));
    const extracted = _.map(data, row => _.pullAt(row, indexes));

    return extracted;
  }
}

export default CSVLoader;
