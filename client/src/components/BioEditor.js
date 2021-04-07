import { Component } from "react";

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
        const { onBioSave } = this.props;

        onBioSave(bioText);
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

        props ? this.try1 : this.try2;

        return (
            <div>
                <form className="bioEditor" onSubmit={this.onBioSubmit}>
                    <textarea
                        onChange={this.onInputChange}
                        defaultValue={this.props.bio}
                        required
                    />
                    <button type="submit">Add</button>
                </form>
            </div>
        );
    }
}

export default BioEditor;
