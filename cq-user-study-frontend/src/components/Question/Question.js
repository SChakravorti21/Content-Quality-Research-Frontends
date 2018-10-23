import React, { Component } from "react";
import "./question.css";
import Chart from "./Chart";

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ranks: [1, 2, 3, 4]
        }
    }

    updateRank = (index, event) => {
        const ranks = this.state.ranks.slice();
        ranks[index] = event.target.value;
        this.setState({ ranks });
    };

    render() {
        const options = this.props.answers.map((answer, index) => {
            let features = <p>Number of <b>thanks</b>: {answer.num_thanks},
                number of <b>upvotes</b>: {answer.num_upvotes},
                answer <b>rating</b>: {answer.rating}/5,
                answerer's <b>reputation</b>: {answer.reputation}</p>;

            return (
                <div>
                    <label className="answer-label">
                        <input className="form-control answer-rank" type="number"
                               min={1} max={4} value={this.state.ranks[index]}
                                onChange={(e) => this.updateRank(index, e)}/>
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
                        <p>Please rank the following answers (1 is best, 4 is worst):</p>
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