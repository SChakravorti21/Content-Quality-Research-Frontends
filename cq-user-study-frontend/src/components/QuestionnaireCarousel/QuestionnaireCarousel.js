import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./questionnaire.css";
import test_data from "./test_data";
import Question from "../Question/Question";
import MetaQuestion from "../Question/MetaQuestion";

export default class QuestionnaireCarousel extends Component {

    constructor(props) {
        super(props);
        console.log(test_data);
    }

    render() {
        const questions = [];
        test_data.forEach((question, index) => {
            questions.push(
                <div>
                    <MetaQuestion question={question.question}/>
                </div>
            );

            questions.push(
                <div>
                    <Question answers={question.answers} question={question.question}/>
                </div>
            );
        });

        return (
            <Carousel
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