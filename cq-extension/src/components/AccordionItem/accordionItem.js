import React, { Component } from 'react';
import './accordionItem.css';

class AccordionItem extends Component {
    constructor(props) {
        super(props);
        var body = null;

        if(this.props.type === AccordionItemEnum.answer) {
            let answer = this.props.content;

            body = (
                <div>
                    <b>Answerer: </b> {answer.user}
                    <br />
                    <b>Answer: </b> {answer.text}
                    <br />
                    <b>Answerer's Reputation: </b> {answer.reputation}
                    <br />
                    <b>Rating: </b> {answer.rating} with {answer.num_upvotes} votes.
                    <br />
                    <b>Thanks Given: </b> {answer.num_thanks}
                </div>
            );
        } else if(this.props.type === AccordionItemEnum.all_answers) {
            let answers = this.props.content;
            var index = 0;
            body = [];

            for(var answer of answers) {
                body.push(
                    <div key={++index}>
                        <p className="compact-text"><b>Answerer: </b> {answer.user}</p>
                        <p className="compact-text"><b>Answer: </b> {answer.text}</p>
                        <p className="compact-text"><b>Answerer's Reputation: </b> {answer.reputation}</p>
                        <p className="compact-text"><b>Rating: </b> {answer.rating} with {answer.num_upvotes} votes.</p>
                        <p className="compact-text"><b>Thanks Given: </b> {answer.num_thanks}</p>
                        <br />
                    </div>
                );
            }
        } else {
            body = this.props.content;
        }

        this.state = {
            content: body
        }
    }

    render() {
        var position = this.props.position;

        return (
            <div className="card">
              <div className="card-header" id={`heading-${position}`}>
                <h5 className="mb-0">
                  <button className="btn btn-link accordion-link" data-toggle="collapse" data-target={`#collapse-${position}`} aria-expanded="true" aria-controls={`collapse-${position}`}>
                    {this.props.title}
                  </button>
                </h5>
              </div>

              <div id={`collapse-${position}`} className="collapse" aria-labelledby={`heading-${position}`} data-parent="#accordion">
                <div className="card-body">
                    {this.state.content}
                </div>
              </div>
            </div>
        );
    }
}

let AccordionItemEnum = Object.freeze({
    text: 1,
    all_answers: 2
});

export default AccordionItem;
export {
    AccordionItemEnum
};