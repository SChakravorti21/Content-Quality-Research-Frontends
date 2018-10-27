import React, { Component } from 'react';
import './App.css';
import QuestionnaireCarousel from "./components/QuestionnaireCarousel/QuestionnaireCarousel";
import VisualizationContainer from "./components/Visualization/VisualizationContainer";

class App extends Component {
  constructor(props) {
    super(props);

    const urlParams = new URLSearchParams(window.location.search);
    let showQuestionnaire = urlParams.get('showQuestionnaire');
    showQuestionnaire = showQuestionnaire === 'true';

    this.state = { showQuestionnaire }
  }

  render() {
    const mainElement = this.state.showQuestionnaire
      ? <QuestionnaireCarousel/>
      : <VisualizationContainer/>;

    return (
      <div className="App">
          {mainElement}
      </div>
    );
  }
}

export default App;
