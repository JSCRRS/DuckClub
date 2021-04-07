import { Component } from "react";

class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bioText: "",
            editingMode: false,
        };

        this.onBioSubmit = this.onBioSubmit.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.onEditModeOpen = this.onEditModeOpen.bind(this);
    }
    onBioSubmit(event) {
        event.preventDefault();

        const { bioText } = this.state;
        const { onBioSave } = this.props;

        onBioSave(bioText);
        this.onEditModeClose();
    }

    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
            bioText: event.target.value,
        });
    }

    onEditModeOpen() {
        this.setState({
            editingMode: true,
        });
    }

    onEditModeClose() {
        this.setState({
            editingMode: false,
        });
    }

    render() {
        return (
            <>
                <div className="bioOptions">{this.renderBioOptions()}</div>
                <div className="editBio">{this.renderEditBio()}</div>
            </>
        );
    }

    renderBioOptions() {
        if (this.props.bio) {
            return (
                <>
                    <p>{this.props.bio}</p>
                    <button onClick={this.onEditModeOpen}>Edit Bio</button>
                </>
            );
        }
        return (
            <>
                <p>No personal information yet.</p>
                <button onClick={this.onEditModeOpen}>Add Bio</button>
            </>
        );
    }

    renderEditBio() {
        if (this.state.editingMode) {
            return (
                <>
                    <form className="bioEditor" onSubmit={this.onBioSubmit}>
                        <textarea
                            onChange={this.onInputChange}
                            defaultValue={this.props.bio}
                            required
                        />
                        <button type="submit">Save</button>
                    </form>
                </>
            );
        }
    }
}

export default BioEditor;
