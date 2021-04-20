import { Component } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

class LoginForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            .post("/login", this.state)
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
            <section className="welcome">
                <div className="welcome-intro">
                    <h1>Duck Club</h1>
                    <p>
                        Welcome back! Its always nice to have a duck friend
                        around.
                    </p>
                </div>
                <div className="login-form generalUserForm">
                    <h2>Login!</h2>
                    <p className="error">{this.state.error}</p>
                    <form onSubmit={this.onFormSubmit}>
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
                        <button type="submit">Login</button>
                    </form>
                    <Link to="/">Click here to register</Link>
                </div>
            </section>
        );
    }
}

export default LoginForm;
