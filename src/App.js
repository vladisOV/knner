import React, { Component } from "react";
import { Grid, Row, Col } from "react-bootstrap";
import CSVLoader from "./components/csv_loader";
import DataChoser from "./components/data_choser";
import ParamConfigurer from "./components/param_configurer";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
      headers: [],
      labels: [],
      features: []
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
    this.setState({
      labels: selectedLabels,
      features: selectedFeatures
    });
  };

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
            <Row className="csv-row">
              <Col md={4} mdOffset={4}>
                <ParamConfigurer />
              </Col>
            </Row>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default App;
