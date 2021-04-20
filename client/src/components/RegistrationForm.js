import { Component } from "react";
import { Link } from "react-router-dom";

import axios from "./axios";

class RegistrationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstname: "",
            lastname: "",
            email: "",
            password: "",
            error: null,
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();

        axios
            .post("/users", this.state)
            .then(() => {
                this.props.onSuccess();
                this.setState({ error: null });
            })
            .catch((error) => {
                this.setState({ error: error.response.data.message });
            });
    }
    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }
    render() {
        return (
            <div className="registration-form generalUserForm">
                <h2>Sign Up!</h2>

                <p className="error">{this.state.error}</p>
                <form onSubmit={this.onFormSubmit}>
                    <input
                        type="text"
                        name="firstname"
                        placeholder="First Name"
                        onChange={this.onInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastname"
                        placeholder="Last Name"
                        onChange={this.onInputChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={this.onInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        onChange={this.onInputChange}
                        required
                    />
                    <button type="submit">Register</button>
                </form>
                <div className="registration-links">
                    <Link to="/login">Log in here</Link>
                    <Link to="/password-reset">Reset password</Link>
                </div>
            </div>
        );
    }
}

export default RegistrationForm;
