import { Component } from "react";
import axios from "../../../axios";

class RegistrationForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            error: null,
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }
    onFormSubmit(event) {
        event.preventDefault();

        axios.post("/users", this.state).then((response) => {
            console.log("[Registration Form] onFormSubmit:", this.state);
            this.props.onSuccess();
            console.log(response.data);
            console.log("[RegistrationForm] login response:", response);
        });
    }
    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
        // logging this.state will NOT give you the updated state.
        // to access that right away, you can pass a callback as the second argument of this.setState, e.g.:
        // this.setState(newState, () => console.log(this.state) ));
    }
    render() {
        return (
            <div className="registration-form">
                <form onSubmit={this.onFormSubmit}>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        onChange={this.onInputChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last name"
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
            </div>
        );
    }
}

export default RegistrationForm;
