import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            email: "",
            code: "",
            password: "",
            error: null,
        };

        this.onInputChange = this.onInputChange.bind(this);
        this.onSendVerificationSubmit = this.onSendVerificationSubmit.bind(
            this
        );
    }
    onSendVerificationSubmit(event) {
        event.preventDefault();

        axios
            .post("/password/reset/start", { email: this.state.email })
            .then(() => {
                this.setState({ step: 2 });
                console.log(
                    "[ResetPassword.js] this.state.step: ",
                    this.state.step
                );
            })
            .catch((error) => {
                this.setState({ error: error.response });
            });
    }
    onInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value,
        });
    }

    render() {
        return (
            <div className="reset-password">
                <form
                    className="form step-one"
                    onSubmit={this.onSendVerificationSubmit}
                >
                    <input
                        type="email"
                        name="email"
                        placeholder="Please type your email"
                        onChange={this.onInputChange}
                        required
                    />
                    <button type="submit">Send verification code</button>
                </form>
            </div>
        );
    }
}

export default ResetPassword;
