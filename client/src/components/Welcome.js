import { HashRouter, Route } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";
import ResetPassword from "./ResetPassword";

export default function Welcome() {
    function onSuccess() {
        console.log("[Welcome] onSuccess: Registered!");
        window.location.href = "/";
    }

    return (
        <HashRouter>
            <section className="welcome">
                <Route exact path="/">
                    <div className="welcome-intro">
                        <h1>Duck Club</h1>
                        <p>
                            Connect with friends around the world who have only
                            one interest: Ducks.
                        </p>
                    </div>
                    <RegistrationForm onSuccess={onSuccess} />
                </Route>
            </section>
            <div className="registration-links">
                <Route path="/login">
                    <LoginForm onSuccess={onSuccess} />
                </Route>

                <Route path="/password-reset">
                    <ResetPassword />
                </Route>
            </div>
        </HashRouter>
    );
}
