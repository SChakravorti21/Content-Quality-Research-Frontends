import React, { Component } from 'react';
import {
    XYPlot,
    XAxis,
    YAxis,
    VerticalGridLines,
    HorizontalGridLines,
    VerticalBarSeries,
    DiscreteColorLegend
  } from 'react-vis';

const Chart = (props) => {
    let answers = props.data;

    var credibility_scores = [];
    var clearness_scores = [];
    var completeness_scores = [];
    var correctness_scores = [];

    for(var answer of answers) {
        credibility_scores.push({
            x: answer.user,
            y: answer.inference.credibility
        });

        clearness_scores.push({
            x: answer.user,
            y: answer.inference.clearness
        });

        completeness_scores.push({
            x: answer.user,
            y: answer.inference.completeness
        });

        correctness_scores.push({
            x: answer.user,
            y: answer.inference.correctness
        });
    }

    return (
        <XYPlot
            width={300}
            height={500}
            stackBy="y"
            xType='ordinal'>

            <VerticalGridLines />
            <HorizontalGridLines />
            <XAxis />
            <YAxis />
            
            <VerticalBarSeries color='#fd9740' data={credibility_scores} />
            <VerticalBarSeries color='#1c3375' data={clearness_scores} />
            <VerticalBarSeries color='#7cc7e2' data={completeness_scores} />
            <VerticalBarSeries color='#1f9399' data={correctness_scores} />    
        </XYPlot>
    );
}

export default Chart;

