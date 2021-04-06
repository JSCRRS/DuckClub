import { Component } from "react";
import axios from "./axios";

import ProfilePicture from "./ProfilePicture";
import ProfilePictureUploader from "./ProfilePictureUploader";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstname: "",
                lastName: "",
                profile_url: "",
            },
            showModal: false,
        };
        // bind things!
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then((response) => {
            console.log("[App componentDidMount] response:", response);
            this.setState({
                user: {
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    profile_url: response.data.profile_url,
                },
            });
        });
    }

    onProfilePictureClick() {
        this.setState({
            showModal: true,
        });
    }

    onUpload(newProfilePicURL) {
        this.setState({
            user: {
                ...this.state.user,
                profile_url: newProfilePicURL,
            },
            showModal: false,
        });
    }

    onModalClose() {
        this.setState({
            showModal: false,
        });
    }

    render() {
        return (
            <section className="app">
                <header>
                    <span className="logo">Hee Hee</span>
                    <ProfilePicture
                        firstname={this.state.user.firstname}
                        lastname={this.state.user.lastname}
                        profile_url={this.state.user.profile_url}
                        onClick={this.onProfilePictureClick}
                    />
                </header>
                <div>{this.renderModal()}</div>
            </section>
        );
    }

    renderModal() {
        if (this.state.showModal) {
            return (
                <ProfilePictureUploader
                    onUpload={this.onUpload}
                    onClose={this.onModalClose}
                />
            );
        }
        return null;
    }
}

export default App;
