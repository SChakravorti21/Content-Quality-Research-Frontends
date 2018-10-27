import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./questionnaire.css";
import test_data from "./test_data";
import Question from "../Question/Question";
import MetaQuestion from "../Question/MetaQuestion";
import { MESSAGE_KEY } from "../Visualization/VisualizationContainer";

export default class QuestionnaireCarousel extends Component {

    constructor(props) {
        super(props);
    }

    message_broadcast = (message) => {
        localStorage.setItem(MESSAGE_KEY, JSON.stringify(message));
        localStorage.removeItem(MESSAGE_KEY);
    };

    render() {
        const questions = [];
        test_data.forEach((question, index) => {
            questions.push(
                <div key={`meta-${index * 2}`}>
                    <MetaQuestion question={question.question} />
                </div>
            );

            questions.push(
                <div key={`question-${(index * 2) + 1}`}>
                    <Question answers={question.answers} question={question.question}/>
                </div>
            );
        });

        return (
            <Carousel
                onChange={(index) => this.message_broadcast({ index })}
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                useKeyboardArrows
                dynamicHeight
                className="presentation-mode questionnaire-carousel">
                {questions}
            </Carousel>
        );
    }

}