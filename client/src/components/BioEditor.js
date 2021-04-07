import { Component } from "react";
import axios from "./axios";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioText: "",
        };

        this.onBioSubmit = this.onBioSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
    }
    onBioSubmit(event) {
        event.preventDefault();

        const { bioText } = this.state;
        console.log("[BioEditor: onSubmit] bioText: ", bioText);

        axios.put("/user", { bioText }).then((response) => {
            console.log(
                "[BioEditor] axios.put --> response.data:",
                response.data
            );
        });
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            bioText: event.target.value,
        });
    }

    try1() {
        console.log("Try 1: WAHR");
    }

    try2() {
        console.log("Try 2: FALSCH");
    }

    render() {
        const { props } = this;
        console.log("[BioEditor] props:", props);

        props ? this.try1 : this.try2;

        return (
            <div>
                <form className="bioEditor" onSubmit={this.onBioSubmit}>
                    <textarea
                        type="text"
                        onChange={this.onInputChange}
                        biotext={this.bioText}
                        required
                    />
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default BioEditor;
