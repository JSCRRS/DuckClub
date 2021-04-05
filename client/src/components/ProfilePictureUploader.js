import { Component } from "react";
import axios from "./axios";

class ProfilePictureUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
        };

        this.onSubmit = this.onSubmit.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    onSubmit(event) {
        event.preventDefault();

        console.log("[ProfilePictureUploader: onSubmit] event: ", event);

        const formData = new FormData();
        formData.append("file", this.state.file);

        axios
            .post("/upload_picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                console.log(
                    "[ProfilePictureUploader: post/upload_profile] response.data:",
                    response.data
                );
                this.props.onUpload(response.data.profilePicURL);
            });
    }
    onChange(event) {
        this.setState({ file: event.target.files[0] });
    }

    render() {
        return (
            <div className="profile-picture-uploader modal">
                <div className="modal-content form">
                    <form onSubmit={this.onSubmit}>
                        <input
                            type="file"
                            name="file"
                            required
                            onChange={this.onChange}
                            /*onChange={this.state.file}
                             */
                        />
                        <button className="uploadButton " type="submit">
                            Upload!
                        </button>
                    </form>
                    <button
                        className="closeButton"
                        onClick={this.props.onClose}
                    >
                        X
                    </button>
                </div>
            </div>
        );
    }
}

export default ProfilePictureUploader;
