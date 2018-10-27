import React, { Component } from 'react';
import test_data from '../QuestionnaireCarousel/test_data';
import Chart from "./Chart";

export const MESSAGE_KEY = "update_visualizations";

export default class VisualizationContainer extends Component {
    constructor(props) {
        super(props);
        this.state = { visualizationIndex: 0 };
        window.addEventListener('storage', this.message_receive);
    }

    message_receive = (event) => {
        console.log(event);
        if(event.key !== MESSAGE_KEY)
            return;

        const msgBody = JSON.parse(event.oldValue);
        if(!msgBody)
            return;

        const visualizationIndex = msgBody.index;
        this.setState({ visualizationIndex });
    };

    render() {
        if(this.state.visualizationIndex % 2 !== 1)
            return null;

        const question = test_data[(this.state.visualizationIndex - 1) / 2];
        return question.answers.map((answer, index) =>
            <Chart showAnswer={false} index={index + 1} answer={answer}/>
        );
    }
}