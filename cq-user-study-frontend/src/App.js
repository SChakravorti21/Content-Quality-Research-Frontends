import React, { Component } from 'react';
import './App.css';
import QuestionnaireCarousel from "./components/QuestionnaireCarousel/QuestionnaireCarousel";

class App extends Component {
  render() {
    return (
      <div className="App">
        <QuestionnaireCarousel/>
      </div>
    );
  }
}

export default App;
