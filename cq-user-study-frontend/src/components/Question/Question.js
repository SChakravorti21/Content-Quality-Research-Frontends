import React, { Component } from "react";
import "./question.css";
import Chart from "./Chart";

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = { answerNumber: 0 };
    }

    updateSelectedAnswer = (answerNumber) => {
        this.setState({ answerNumber });
    };

    render() {
        const charts = this.props.answers.map((answer, index) => {
            return (
                <div className="radio">
                    <label className="answer-label">
                        <input type="radio" value={answer.text}
                               checked={this.state.answerNumber === index}
                               onChange={() => this.updateSelectedAnswer(index)} />
                        {answer.text}
                        <Chart showAnswer={false} index={index} answer={answer}/>
                    </label>
                </div>
            )
        });

        return (
            <div className="view-wrapper">
                <div className="question-wrapper-small">
                    <div className="question">
                        <div><b>Question:</b> Camille and her friends enjoy experimenting with different foods. During a camping trip, they decide to fry bacon using nothing more than hot rocks. Camille heats a rock in the campfire for 30 minutes, and then removes it with tongs. She greases the rock and lays the bacon strips directly on it. The bacon turns out great, and the girls enjoy the food. Which two sentences accurately describe the girls’ experience with heat transfer?
                            options:</div>
                        <br/>
                        <div>Heat was transferred from the fire to the rock.</div>
                        <div>The girls cooked the bacon using convection currents.</div>
                        <div>The bacon and the fire were in thermal equilibrium</div>
                        <div>The bacon lost energy to the rocks as they got warmer.</div>
                        <div>The girls used conduction to cook the bacon.</div>
                        <br/>
                        <div><b>There can be multiple answers</b></div>
                    </div>
                    <div className="meta-question">
                        <p>Please pick the best answer of the two:</p>
                    </div>
                    <div className="response">
                        <div className="radio">
                            {charts}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}