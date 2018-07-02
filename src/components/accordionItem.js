import React, { Component } from 'react';

class AccordionItem extends Component {
    constructor(props) {
        super(props);

        if(this.props.type === AccordionItemEnum.answer) {
            let answer = this.props.content;

            let body = (
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

            this.props.content = body;
        } else if (this.props.type === AccordionItemEnum.raw_data) {
            this.props.content = <pre>{JSON.stringify(this.props.content, null, 4)}</pre>;
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
                    {this.props.content}
                </div>
              </div>
            </div>
        );
    }
}

let AccordionItemEnum = Object.freeze({
    raw_data: 1,
    text: 2,
    answer: 3
});

export default AccordionItem;
export {
    AccordionItemEnum
};