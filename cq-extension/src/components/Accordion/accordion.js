import React, { Component } from 'react';
import AccordionItem, { AccordionItemEnum } from '../AccordionItem/accordionItem';
import './accordion.css';

class Accordion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.data.subject);
        return (
            <div id="accordion">
                <div className="card">
                    <div className="card-header" id={`heading-content`}>
                        <h5 className="mb-0">
                        <button className="btn btn-link accordion-link" data-toggle="collapse" data-target={`#collapse-content`} aria-expanded="true" aria-controls={`collapse-content`}>
                            Content
                        </button>
                        </h5>
                    </div>

                    <div id={`collapse-content`} className="collapse" aria-labelledby={`heading-content`} data-parent="#content-accordion">
                        <div className="card-body">
                            <AccordionItem  title="All Answers"
                                            type={AccordionItemEnum.all_answers}
                                            content={this.props.data.all_answers}
                                            position={1} />

                            <AccordionItem  title="Question"
                                        type={AccordionItemEnum.text}
                                        content={this.props.data.question}
                                        position={2} />

                            <AccordionItem  title="Subject"
                                            type={AccordionItemEnum.text}
                                            content={this.props.data.subject}
                                            position={3} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Accordion;