import React, { Component } from 'react';
import Chart from './components/chart';
import logo from './anatomy.png';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    console.log('in ctor')
    console.log(props)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Content Quality Extension</h1>
        </header>
        <p className="App-intro">
          To get started, just open up any <code>Brainly</code> page, and we'll handle the rest.
          <small>
             &nbsp; (Background tasks will check when a <code>Brainly</code> page is opened and
             automatically reload this extension.)
          </small>
        </p>
        <div className="App-body">
          <Chart data={this.props.response}/>

          <pre>
            Collected:
            {JSON.stringify(this.props.collected, null, 4)}
          </pre>
          <pre>
            Response:
            {JSON.stringify(this.props.response, null, 4)}
          </pre>
        </div>
      </div>
    );
  }
}

export default App;
