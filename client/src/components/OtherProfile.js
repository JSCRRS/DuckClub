import { Component } from "react";
import axios from "./axios";
import FriendButton from "./Friendbutton";

class OtherProfile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: {
                id: "",
                firstname: "",
                lastname: "",
                bio: "",
                profile_url: "",
            },
        };
    }

    componentDidMount() {
        axios
            .get(`/api/users/${this.props.id}`)
            .then((response) => {
                const {
                    id,
                    firstname,
                    lastname,
                    bio,
                    profile_url,
                } = response.data;
                this.setState({
                    user: {
                        id: id,
                        firstname: firstname,
                        lastname: lastname,
                        bio: bio,
                        profile_url: profile_url,
                    },
                });
            })
            .catch((error) => {
                if (
                    error.response.status >= 400 &&
                    error.response.status < 500
                ) {
                    this.props.history.push("/");
                }
            });
    }

    render() {
        return (
            <>
                <div className="otherProfile">
                    <p>Profile of user: {this.state.user.id}</p>
                    <p>
                        {this.state.user.firstname} {this.state.user.lastname}
                    </p>
                    <p>{this.state.user.bio || "No bio yet"}</p>
                    <img src={this.state.user.profile_url} />
                </div>
                <FriendButton id={this.state.user.id} />
            </>
        );
    }
}

export default OtherProfile;
