import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import CSVLoader from "./components/csv_loader";
import DataChoser from "./components/data_choser";
import ParamConfigurer from "./components/param_configurer";
import ResultComp from "./components/result_comp";
import "./App.css";
import _ from "lodash";
import shuffleSeed from "shuffle-seed";
const tf = require("@tensorflow/tfjs");

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      headers: [],
      labels: [],
      features: [],
      extractedData: [],
      extractedLabels: [],
      trainData: {}
    };
  }

  getFeatures = file => {
    this.setState({
      data: file.data,
      headers: file.headers
    });
    console.log(this.state);
  };

  extractData = (selectedFeatures, selectedLabels) => {
    console.log("selected features ", selectedFeatures);
    console.log("selected labels ", selectedLabels);
    this.setState(
      {
        labels: selectedLabels,
        features: selectedFeatures
      },
      () => {
        const { data, labels, features } = this.state;
        let extractedLabels = this.extractColumns(data, labels);
        let extractedData = this.extractColumns(data, features);

        // extractedLabels.shift();

        extractedData = shuffleSeed.shuffle(extractedData, "phrase");
        extractedLabels = shuffleSeed.shuffle(extractedLabels, "phrase");

        this.setState({
          extractedData: extractedData,
          extractedLabels: extractedLabels
        });
      }
    );
  };

  extractColumns(data, columnNames) {
    const { headers } = this.state;
    const indexes = _.map(columnNames, column => headers.indexOf(column));
    const extracted = _.map(data, row => _.pullAt(row, indexes));
    return extracted;
  }

  addParams = (k, trainingSetSize) => {
    const { extractedData, extractedLabels } = this.state;

    const trainSize = _.isNumber(trainingSetSize)
      ? trainingSetSize
      : Math.floor(extractedData.length / 2);

    this.setState(
      {
        trainData: {
          trainFeatures: extractedData.slice(trainSize),
          trainLabels: extractedLabels.slice(trainSize),
          testFeatures: extractedData.slice(0, trainSize),
          testLabels: extractedLabels.slice(0, trainSize),
        }
      },
      (k) => {
        this.predict(k);
      }
    );
  };

  predict(k) {
    let {
      trainFeatures,
      trainLabels,
      testFeatures,
      testLabels
    } = this.state.trainData;

    console.log(trainFeatures, trainLabels);

    trainFeatures = tf.tensor(trainFeatures);
    trainLabels = tf.tensor(trainLabels);


    testFeatures.forEach((testPoint, i) => {
      const result = this.knn(
        trainFeatures,
        trainLabels,
        tf.tensor(testPoint),
        1
      );
      const err = (testLabels[i][0] - result) / testLabels[i][0];
      console.log("Guess", result, testLabels[i][0]);
      console.log("Error", err * 100);
    });
  }

  knn(features, labels, prediction, k) {

    const { mean, variance } = tf.moments(features, 0);
    const scaledPrediciton = prediction.sub(mean).div(variance.pow(0.5));
    console.log(features, labels, prediction, "k = ", k);
    return (
      features
        .sub(mean)
        .div(variance.pow(0.5))
        .sub(scaledPrediciton)
        .pow(2)
        .sum(1)
        .pow(0.5)
        .expandDims(1)
        .concat(labels, 1)
        .unstack()
        .sort((a, b) => (a.get(0) > b.get(0) ? 1 : -1))
        .slice(0, k)
        .reduce((acc, pair) => acc + pair.get(1), 0) / k
    );
  }

  render() {
    return (
      <div className="App">
        <Grid>
          <Row className="csv-row">
            <Col md={4} mdOffset={4}>
              <CSVLoader onFileUploaded={this.getFeatures} />
            </Col>
          </Row>
          <Row className="csv-row">
            <Col md={4} mdOffset={4}>
              <DataChoser
                onDataChosen={this.extractData}
                headers={this.state.headers}
              />
            </Col>
          </Row>
          <Row className="csv-row">
            <Col md={4} mdOffset={4}>
              <ParamConfigurer onParamsConfigured={this.addParams} />
            </Col>
          </Row>
          <Row className="csv-row">
            <Col md={4} mdOffset={4}>
              <ResultComp />
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
