import React, { Component } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import "./questionnaire.css";
import Question from "../Question/Question";

export default class QuestionnaireCarousel extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Carousel
                showThumbs={false}
                showStatus={false}
                showIndicators={false}
                useKeyboardArrows
                className="presentation-mode">
                <div>
                    <Question/>
                </div>
                <div>
                    <Question/>
                </div>
                <div>
                    <Question/>
                </div>
                <div>
                    <Question/>
                </div>
            </Carousel>
        );
    }

}