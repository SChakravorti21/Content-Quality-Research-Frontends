import React, { Component } from 'react';
import AccordionItem, { AccordionItemEnum } from './accordionItem';

class Accordion extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="accordion">
                <AccordionItem  title="Question"
                                type={AccordionItemEnum.text}
                                content={this.props.data.question}
                                position={1} />
                <AccordionItem  title="Top Answer"
                                type={AccordionItemEnum.answer}
                                content={this.props.data.top_answer}
                                position={2} />
                <AccordionItem  title="Subject"
                                type={AccordionItemEnum.text}
                                content={this.props.data.subject}
                                position={3} />
                <AccordionItem  title="Raw Data"
                                type={AccordionItemEnum.raw_data}
                                content={this.props.data}
                                position={4} />
            </div>
        );
    }
}

export default Accordion;