import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    HorizontalBarSeries,
  } from 'react-vis';
import Popper from 'popper.js';

export default class Chart extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scores: this.parseAnswers(this.props.answer),
        };

        this.chartWrapper = React.createRef();
    }

    componentDidMount() {
        let wrapper = this.chartWrapper.current;
        let bars = wrapper.querySelectorAll('rect');
        this.bars = [].slice.call(bars);
    }

    render() {
        // previous colors '#E08E45', '#F7EE40', '#BDF7B7', '#E4C5AF'

        return (
            <div
                ref={this.chartWrapper}
                onMouseOver={this.mouseOver}
                onMouseOut={this.mouseOut} >

                <p><b>Answer {this.props.index}:</b> {this.props.answer.content} </p>

                <XYPlot
                    margin={{
                        left: 100
                    }}
                    width={350}
                    height={200}
                    yType='ordinal'
                    xDomain={[0, 105]}
                    colorRange={['#000000']} >

                    <VerticalGridLines />
                    <HorizontalGridLines />
                    <XAxis tickValues={[0, 20, 40, 60, 80, 100]} />
                    <YAxis tickLabelAngle={-45}/>
                    
                    <HorizontalBarSeries  
                        animation
                        className="scores"
                        data={this.state.scores}
                        colorType="category" />
                </XYPlot>

                <br />
            </div>
        )
    }

    mouseOut = (event) => {
        if(event.target && event.target.tagName !== 'rect')
            return;
        
        if(this.tooltip) {
            this.tooltipElement.setAttribute("hidden", "hidden");
            this.tooltip.destroy();
        }
    }

    mouseOver = (event) => {
        let root = event.target;        
        if(root && root.tagName !== 'rect')
            return;

        let tooltipElement = document.querySelector('#popper');
        tooltipElement.removeAttribute("hidden");

        let content = tooltipElement.querySelector('#popper-content');
        let score = this.getPartialScore(root);
        content.innerHTML = this.constructTooltipMessage(score);

        const tooltip = new Popper(root, tooltipElement, {
            placement: 'top'
        });

        this.tooltip = tooltip;
        this.tooltipElement = tooltipElement;
    }

    getPartialScore = (element) => {
        for(let index = 0; index < this.bars.length; index++) {
            if(this.bars[index].outerHTML === element.outerHTML)
                return this.state.scores[index];
        }

        return null;
    }

    constructTooltipMessage = (score) => {
        let message = '';
        switch(score.y) {
            case 'Overall':
                message = 'The average of the four main scores';
                break;
            case 'Correctness':
                message = 'Whether the content is free from error and can be regarded as true';
                break;
            case 'Completeness':
                message = 'Whether the content is not missing any necessary or relevant information';
                break;
            case 'Clearness':
                message = 'Whether the content is stated directly, and not confusing';
                break;
            case 'Credibility':
                message = 'Whether the content provided is by a genuine source';
                break;
        }

        return `<small>
                    ${score.y}: ${score.x}
                    <br />
                    ${message}
                </small>`;
    }

    parseAnswers = (answer) => {
        let scores = [
            {
                y: 'Credibility',
                x: Math.round(answer.inference.credibility),
                color: '#000000' // '#E08E45'
            },
            {
                y: 'Clearness',
                x: Math.round(answer.inference.clearness),
                color: '#000000' // '#F8F4A6'
            },
            {
                y: 'Completeness',
                x: Math.round(answer.inference.completeness),
                color: '#000000' // '#BDF7B7'
            },
            {
                y: 'Correctness',
                x: Math.round(answer.inference.correctness),
                color: '#000000' // '#3943B7'
            },
            {
                y: 'Overall',
                x: Math.round(answer.inference.overall),
                color: '#000000' // '#F8F4A6'
            }
        ]

        return scores;
    }
}

