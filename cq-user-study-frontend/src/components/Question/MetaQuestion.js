import React, {Component} from "react";
import "./question.css";

export default class MetaQuestion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            familiarity: 1
        };
    }

    onInputChange = (event) => {
        let familiarity = event.target.value;

        this.setState({
            familiarity: familiarity
        });
    }

    render() {
        return (
            <div className="question-wrapper-large">
                <div className="question">
                    <div><b>Question:</b> Camille and her friends enjoy experimenting with different foods. During a camping trip, they decide to fry bacon using nothing more than hot rocks. Camille heats a rock in the campfire for 30 minutes, and then removes it with tongs. She greases the rock and lays the bacon strips directly on it. The bacon turns out great, and the girls enjoy the food. Which two sentences accurately describe the girls’ experience with heat transfer?
                        options:</div>
                    <br/>
                    <div>Heat was transferred from the fire to the rock.</div>
                    <div>The girls cooked the bacon using convection currents.</div>
                    <div>The bacon and the fire were in thermal equilibrium</div>
                    <div>The bacon lost energy to the rocks as they got warmer.</div>
                    <div>The girls used conduction to cook the bacon.</div>
                    <br/>
                    <div><b>There can be multiple answers</b></div>
                </div>
                <div className="meta-question">
                    <p>How familiar are you with this question? Rate from 1 to 5.</p>
                </div>
                <div className="meta-response">
                    <input className="form-control" name="familiarity" type="number"
                           min={1} max={5}
                           value={this.state.familiarity}
                           onChange={this.onInputChange} />
                </div>
            </div>
        )
    }
}