import { Component } from "react";
import axios from "./axios";

import ProfilePicture from "./ProfilePicture";
import ProfilePictureUploader from "./ProfilePictureUploader";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstName: "",
                lastName: "",
                profile_url: "",
            },
            showModal: true,
        };
        // bind things!
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user", (request, response) => {
                console.log(
                    "[App.js: componentDidMount] axios response.data:",
                    response.data
                );
            })
            .then((data) => {
                console.log(
                    "[App.js: componentDidMount] axios then.data:",
                    data
                );
                /* this.setState({ response.data}); */
            });
        // GET /user
        // .then() set the state with the according response.data
    }

    onProfilePictureClick() {
        console.log("[App] onProfilePictureClick", this);
        this.setState({
            showModal: true,
        });
    }

    onUpload(newProfilePicURL) {
        // set the state accordingly
        // remember to user destructuring:
        this.setState({
            user: {
                ...this.state.user, // what the user was before
                profile_url: newProfilePicURL,
            },
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
                    <span className="logo">Logo</span>
                    <ProfilePicture
                        firstName={this.state.user.firstName}
                        lastName={this.state.user.lastName}
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
