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
        return (
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                useKeyboardArrows
                dynamicHeight
                className="presentation-mode questionnaire-carousel">
                <div>
                    <MetaQuestion/>
                </div>
                <div>
                    <Question answers={test_data.answers} />
                </div>
            </Carousel>
        );
    }

}