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
    };

    render() {
        return (
            <div className="question-wrapper">
                <div className="question">
                    {this.props.question}
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