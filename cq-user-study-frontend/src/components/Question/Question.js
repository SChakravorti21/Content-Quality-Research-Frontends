import React, { Component } from "react";
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import "./question.css";
import Chart from "./Chart";

const Answer = SortableElement( ({answer}) => (
    <div>
        <p>{answer.text}</p>
        <p>Number of <b>upvotes</b>: {answer.num_upvotes}</p>
    </div>
));

const AnswerList = SortableContainer( ({answers}) => (
   <div className="response">
       {answers.map((answer, index) => (
           <Answer key={`item-${index}`} index={index} answer={answer}/>
       ))}
   </div>
));

export default class Question extends Component {
    constructor(props) {
        super(props);
        this.state = { answers: this.props.answers }
    }

    onSortEnd = ({oldIndex, newIndex}) => {
        this.setState({
            answers: arrayMove(this.state.answers, oldIndex, newIndex)
        });
    };

    render() {
        const charts = this.props.answers.map((answer, index) => (
            <Chart showAnswer={false} index={index+1} answer={answer}/>
        ));

        return (
            <div className="view-wrapper">
                <div className="question-wrapper-small">
                    <div className="question">
                        {this.props.question}
                    </div>
                    <div className="meta-question">
                        <p>
                            Please drag and drop the following answers to rank them
                            <i>(top-most answer is the best, last answer is worst):</i>
                        </p>
                    </div>
                    <AnswerList answers={this.state.answers} onSortEnd={this.onSortEnd} />
                </div>

                <div className="chart-wrapper">
                    {charts}
                </div>
            </div>
        )
    }
}