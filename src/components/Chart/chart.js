import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    HorizontalBarSeries
  } from 'react-vis';
import Popper from 'popper.js';

export default class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            credibility_scores: [{
                x: 0,
                y: 0
            }],
            clearness_scores: [{
                x: 0,
                y: 0
            }],
            completeness_scores: [{
                x: 0,
                y: 0
            }],
            correctness_scores: [{
                x: 0,
                y: 0
            }],
            chart_length: 0,
            max_uname_length: 0,
            last_uname_length: 0
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState(this.parseAnswers(this.props.data))
        }, 250);
    }

    render() {
        return (
            <XYPlot
                margin={{
                    left: 10 * this.state.max_uname_length,
                    bottom: 5 * this.state.last_uname_length
                }}
                width={350}
                height={this.state.chart_length * 80 + 5 * this.state.last_uname_length}
                stackBy="x"
                yType='ordinal'>

                <VerticalGridLines />
                <HorizontalGridLines />
                <XAxis />
                <YAxis tickLabelAngle={-45}/>
                
                <HorizontalBarSeries  animation
                    color='#fd9740' 
                    data={this.state.credibility_scores}
                    onValueMouseOver={(data, event) => this.mouseOver('Credibility', data, event)}
                    onValueMouseOut={this.mouseOut} />
                <HorizontalBarSeries  animation
                    color='#1c3375' 
                    data={this.state.clearness_scores}
                    onValueMouseOver={(data, event) => this.mouseOver('Clearness', data, event)}
                    onValueMouseOut={this.mouseOut} />
                <HorizontalBarSeries  animation
                    color='#7cc7e2' 
                    data={this.state.completeness_scores}
                    onValueMouseOver={(data, event) => this.mouseOver('Completeness', data, event)}
                    onValueMouseOut={this.mouseOut} />
                <HorizontalBarSeries animation
                    color='#1f9399' 
                    data={this.state.correctness_scores}
                    onValueMouseOver={(data, event) => this.mouseOver('Correctness', data, event)}
                    onValueMouseOut={this.mouseOut} />    
            </XYPlot>
        )
    }

    mouseOut = () => {
        if(this.tooltip) {
            this.tooltipElement.setAttribute("hidden", "hidden");
            this.tooltip.destroy();
        }
    }

    mouseOver = (type, data, event) => {
        let root = document.querySelectorAll('.rv-xy-plot__grid-lines__line')[data.index + 4];
        var tooltipElement = document.querySelector('#popper');
        tooltipElement.removeAttribute("hidden");

        var content = tooltipElement.querySelector('#popper-content');
        content.innerHTML = `${type}: ${data.x}`;
        const tooltip = new Popper(root, tooltipElement, {
            placement: 'top',
            modifiers: {
                offset: { offset: '0, 25' }
            }
        });

        this.tooltip = tooltip;
        this.tooltipElement = tooltipElement;
    }

    parseAnswers = (answers) => {
        var credibility_scores = [];
        var clearness_scores = [];
        var completeness_scores = [];
        var correctness_scores = [];
        var chart_length = 0;
        var max_uname_length = 0;
        var last_uname_length = 0;

        for(var i = 0; i < answers.length; i++) {
            var answer = answers[i];

            credibility_scores.push({
                y: answer.user,
                x: answer.inference.credibility,
                index: i
            });

            clearness_scores.push({
                y: answer.user,
                x: answer.inference.clearness,
                index: i
            });

            completeness_scores.push({
                y: answer.user,
                x: answer.inference.completeness,
                index: i
            });

            correctness_scores.push({
                y: answer.user,
                x: answer.inference.correctness,
                index: i
            });

            if(answer.user.length > max_uname_length) {
                max_uname_length = answer.user.length;
            }

            if(answer === answers[answers.length - 1]) {
                last_uname_length = answer.user.length;
            }

            chart_length++;
        }

        return {
            credibility_scores: credibility_scores,
            clearness_scores: clearness_scores,
            completeness_scores: completeness_scores,
            correctness_scores: correctness_scores,
            chart_length: chart_length,
            max_uname_length: max_uname_length,
            last_uname_length: last_uname_length
        }
    }
}

