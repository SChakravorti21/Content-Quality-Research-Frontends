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
        const options = this.props.answers.map((answer, index) => {
            let features = <p>Number of <b>thanks</b>: {answer.num_thanks},
                number of <b>upvotes</b>: {answer.num_upvotes},
                answer <b>rating</b>: {answer.rating}/5,
                answerer's <b>reputation</b>: {answer.reputation}</p>;

            return (
                <div className="radio">
                    <label className="answer-label">
                        <input type="radio"
                               checked={this.state.answerNumber === index}
                               onChange={() => this.updateSelectedAnswer(index)} />
                        <div>
                            {answer.text}
                            {features}
                        </div>
                    </label>
                </div>
            )
        });

        const charts = this.props.answers.map((answer, index) => {
            return <Chart showAnswer={false} index={index+1} answer={answer}/>;
        });

        return (
            <div className="view-wrapper">
                <div className="question-wrapper-small">
                    <div className="question">
                        {this.props.question}
                    </div>
                    <div className="meta-question">
                        <p>Please pick the best answer of the two:</p>
                    </div>
                    <div className="response">
                        <div className="radio">
                            {options}
                        </div>
                    </div>
                </div>

                <div className="chart-wrapper">
                    {charts}
                </div>
            </div>
        )
    }
}