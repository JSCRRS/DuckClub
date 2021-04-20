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
            <section className="welcome">
                <div className="welcome-intro">
                    <h1>Duck Club</h1>
                    <p>
                        Soon you can again participate in serious discussions.
                    </p>
                </div>
                <div className="reset-password generalUserForm">
                    <h2>Reset your Password</h2>
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
                    <Link to="/login">Go back to login here</Link>
                </div>
            </section>
        );
    }

    renderStepTwo() {
        return (
            <section className="welcome">
                <div className="welcome-intro">
                    <h1>Duck Club</h1>
                    <p>
                        Soon you can again participate in serious discussions.
                    </p>
                </div>
                <div className="reset-password generalUserForm">
                    <h3>You received an email.</h3>
                    <form
                        className="form step-two"
                        onSubmit={this.onCodeSubmit}
                    >
                        <input
                            type="text"
                            name="code"
                            value=""
                            placeholder="Please enter the code."
                            onChange={this.onInputChange}
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Your new password."
                            onChange={this.onInputChange}
                            required
                        />
                        <button type="submit">Submit</button>
                    </form>
                </div>
            </section>
        );
    }
    renderStepThree() {
        return (
            <section className="welcome">
                <div className="welcome-intro">
                    <h1>Duck Club</h1>
                    <p>"Quack." - Ducky McDuckface</p>
                </div>
                <div className="reset-password generalUserForm">
                    <h2 className="success">Success!</h2>
                    <Link className="reset-link" to="/login">
                        Login with your new Password here
                    </Link>
                </div>
            </section>
        );
    }
}

export default ResetPassword;
