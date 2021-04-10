import { Component } from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";

import ProfilePicture from "./ProfilePicture";
import ProfilePictureUploader from "./ProfilePictureUploader";
import Profile from "./Profile";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: {
                firstname: "",
                lastname: "",
                profile_url: "",
                bio: "",
            },
            showModal: false,
        };
        this.onProfilePictureClick = this.onProfilePictureClick.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.onModalClose = this.onModalClose.bind(this);
        this.onBioSave = this.onBioSave.bind(this);
    }

    componentDidMount() {
        axios.get("/user").then((response) => {
            this.setState({
                user: {
                    firstname: response.data.firstname,
                    lastname: response.data.lastname,
                    profile_url: response.data.profile_url,
                    bio: response.data.bio,
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

    onBioSave(bioText) {
        axios.put("/user", { bioText }).then(() => {
            this.setState({
                user: {
                    ...this.state.user,
                    bio: bioText,
                },
            });
        });
    }

    render() {
        //hier könnte man destructuring: const {firstname, etc.} = this.state.user
        // --> dann kann man schreiben: firstname={firstname}
        return (
            <BrowserRouter>
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
                    <div className="profile">
                        <Route path="/" exact>
                            <Profile
                                firstname={this.state.user.firstname}
                                lastname={this.state.user.lastname}
                                profile_url={this.state.user.profile_url}
                                onClick={this.onProfilePictureClick}
                                bio={this.state.user.bio}
                                onBioSave={this.onBioSave}
                            />
                        </Route>

                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    id={props.match.params.id}
                                    key={props.match.url}
                                    history={props.history}
                                />
                            )}
                        />
                    </div>

                    <Route path="/users" render={() => <FindPeople />} />

                    <div>{this.renderModal()}</div>
                </section>
            </BrowserRouter>
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
