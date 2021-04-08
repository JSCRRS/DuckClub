import { Component } from "react";
import axios from "./axios";

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
        axios.get(`/user/${this.props.id}`).then((response) => {
            console.log(
                "[OtherProfile] componentDidMount - response.data: ",
                response.data
            );
            const { id, firstname, lastname, bio, profile_url } = response.data;
            this.setState({
                user: {
                    id: id,
                    firstname: firstname,
                    lastname: lastname,
                    bio: bio,
                    profile_url: profile_url,
                },
            });
        });
    }

    render() {
        console.log("[OtherProfile] componentDidMount - id: ", this.props.id);

        console.log(
            "[OtherProfile] componentDidMount - this.state:",
            this.state
        );

        return (
            <>
                <p>Profile of user: {this.state.user.id}</p>
                <p>
                    {this.state.user.firstname} {this.state.user.lastname}
                </p>
                <p>{this.state.user.bio}</p>
                <img src={this.state.user.profile_url} />
            </>
        );
    }
}

export default OtherProfile;

/* console.log("[OtherProfile] componentDidMount - props.id:", this.props.id);
this.setState({
    user: {
        id: this.props.id,
        firstname: "John",
        lastname: "Doe",
        bio: "Some bio text",
        profile_url:
            "https://upload.wikimedia.org/wikipedia/commons/b/b1/Joe_Exotic_%28Santa_Rose_County_Jail%29.png",
    },
}); */
