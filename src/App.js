import React, { Component } from 'react';
import Chart from './components/Chart/chart';
import logo from './anatomy.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('in ctor')
    console.log(props)
  }

  render() {
    let charts = this.props.response.all_answers.map((value, index) => {
      return <Chart index={index+1} answer={value} />
    });

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Content Quality Extension</h1>
        </header>
        <br />
        <p className="App-intro">
          <small>
            To get started, just open up any major <code>user-generated content</code> page, and we'll handle the rest.
          </small>
        </p>
        <div className="App-body">
          <h5 style={{textAlign: 'center'}}>Answer Scores</h5>
          <br />
          {charts}
          <br />
        </div>
      </div>
    );
  }
}

export default App;
