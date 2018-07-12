import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    HorizontalBarSeries,
    GradientDefs
  } from 'react-vis';
import Popper from 'popper.js';

export default class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = this.parseAnswers(this.props.answer)
    }

    render() {
        return (
            <div>
                <p><b>Answer {this.props.index}:</b>{this.props.answer.text}</p>

                <XYPlot
                    margin={{
                        left: 100
                    }}
                    width={350}
                    height={200}
                    yType='ordinal'
                    colorRange={['#E08E45', '#F7EE40', '#BDF7B7', '#E4C5AF']}>

                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis />
                    <YAxis tickLabelAngle={-45}/>
                    
                    <HorizontalBarSeries  animation
                        className="scores"
                        data={this.state.scores}
                        colorType="category"
                        //onValueMouseOver={(data, event) => this.mouseOver('Credibility', data, event)}
                        //onValueMouseOut={this.mouseOut} 
                    /> 
                </XYPlot>

                <br />
            </div>
        )
    }

    mouseOut = () => {
        if(this.tooltip) {
            this.tooltipElement.setAttribute("hidden", "hidden");
            this.tooltip.destroy();
        }
    }

    mouseOver = (type, data, event) => {
        let root = document.querySelector(`.${type}`);
        var tooltipElement = document.querySelector('#popper');
        tooltipElement.removeAttribute("hidden");

        var content = tooltipElement.querySelector('#popper-content');
        content.innerHTML = `${type}: ${data.x}`;
        const tooltip = new Popper(root, tooltipElement, {
            placement: 'top'
        });

        this.tooltip = tooltip;
        this.tooltipElement = tooltipElement;
    }

    parseAnswers = (answer) => {
        let scores = [
            {
                y: 'Credibility',
                x: answer.inference.credibility,
                color: '#E08E45'
            },
            {
                y: 'Clearness',
                x: answer.inference.clearness,
                color: '#F8F4A6'
            },
            {
                y: 'Completeness',
                x: answer.inference.completeness,
                color: '#BDF7B7'
            },
            {
                y: 'Correctness',
                x: answer.inference.correctness,
                color: '#3943B7'
            }
        ]

        return {
            scores: scores
        };
    }
}

