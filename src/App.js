import React, { Component } from 'react';
import Chart from './components/Chart/chart';
import Accordion from './components/Accordion/accordion';
import logo from './anatomy.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('in ctor')
    console.log(props)
  }

  componentDidMount() {
    /*eslint-disable no-undef*/
    $(function () {
      $('[data-toggle="tooltip"]').tooltip()
    })
    /*eslint-enable no-undef*/
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Content Quality Extension</h1>
        </header>
        <br />
        <p className="App-intro">
          To get started, just open up any major <code>user-generated content</code> page, and we'll handle the rest.
        </p>
        <div className="App-body">
          <Chart data={this.props.response.all_answers}/>
          <br />

          <div id="content-accordion">
            <Accordion data={this.props.collected.brainly_data} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
