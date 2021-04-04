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
        this.onCodeSubmit = this.onCodeSubmit.bind(this);
    }
    onSendVerificationSubmit(event) {
        event.preventDefault();

        axios
            .post("/password/reset/start", { email: this.state.email })
            .then(() => {
                this.setState({ step: 2 });
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

    onCodeSubmit(event) {
        event.preventDefault();
        const { email, password, code } = this.state;

        axios
            .post("/password/reset/verify", { email, password, code })
            .then(() => {
                this.setState({ step: 3 });
            })
            .catch((error) => {
                console.log("[ResetPassword.js] onCodeSubmit error:", error);
                this.setState({ error: error.response.data.message });
            });
    }

    render() {
        return (
            <div className="reset-password">
                {this.renderError()}
                {this.renderCurrentStep()}
            </div>
        );
    }

    renderError() {
        if (this.state.error) {
            return <p className="error">{this.state.error}</p>;
        }
        return null;
    }

    renderCurrentStep() {
        switch (this.state.step) {
            case 1:
                return this.renderStepOne();
            case 2:
                return this.renderStepTwo();
            case 3:
                return this.renderStepThree();
        }
    }

    renderStepOne() {
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

    renderStepTwo() {
        return (
            <div className="reset-password">
                <form className="form step-two" onSubmit={this.onCodeSubmit}>
                    <input
                        type="text"
                        name="code"
                        placeholder="Please enter the code you received."
                        onChange={this.onInputChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Please enter a new password."
                        onChange={this.onInputChange}
                        required
                    />
                    <button type="submit">Submit</button>
                </form>
            </div>
        );
    }
    renderStepThree() {
        return (
            <div className="reset-password">
                <p>Reset Password</p>
                <p className="success">Success!</p>
                <Link to="/login">Login with your new Password.</Link>
            </div>
        );
    }
}

export default ResetPassword;
