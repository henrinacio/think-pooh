import React, { Component } from "react";
import axios from "axios";

export default class Random extends Component {
  constructor() {
    super();
    this.state = {
      random: "",
    };
  }

  componentDidMount() {
    axios
      .get("/getRandom")
      .then((response) => {
        this.setState({ random: response.data.random_joke });
      })
      .catch((e) => {
        console.log(e.response.data);
      });
  }

  componentWillUnmount() {}

  render() {
    return (
      <>
        <h1>{this.state.random}</h1>
      </>
    );
  }
}
