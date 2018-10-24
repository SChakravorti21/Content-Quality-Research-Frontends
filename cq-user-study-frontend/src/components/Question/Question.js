import React, { Component } from "react";
import {
    SortableContainer,
    SortableElement,
    SortableHandle,
    arrayMove
} from 'react-sortable-hoc';
import "./question.css";
import Chart from "./Chart";

const DragHandle = SortableHandle(() => <div className="drag-handle"></div>);

const Answer = SortableElement( ({answer, answerIndex}) => (
    <div className="answer-option">
        <DragHandle />
        <div>
            <p><b>Answer {answer.index}:</b> {answer.text}</p>
            <p><i>Number of upvotes: {answer.num_upvotes}</i></p>
        </div>
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
        this.props.answers.forEach((answer, index) => answer.index = index + 1);
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
                            in descending order:
                        </p>
                    </div>
                    <AnswerList answers={this.state.answers}
                                onSortEnd={this.onSortEnd} useDragHandle={true} />
                </div>

                <div className="chart-wrapper">
                    {charts}
                </div>
            </div>
        )
    }
}