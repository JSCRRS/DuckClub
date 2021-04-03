import { HashRouter, Route, Link } from "react-router-dom";
import RegistrationForm from "./RegistrationForm";
import LoginForm from "./LoginForm";

export default function Welcome() {
    function onSuccess() {
        console.log("[Welcome] onSuccess: Registered!");
        window.location.href = "/";
    }

    return (
        <HashRouter>
            <section className="welcome">
                <h1>Welcome!</h1>
                <p> IMAGE / TITLE HERE!</p>
                <Route exact path="/">
                    <RegistrationForm onSuccess={onSuccess} />
                    <Link to="/login">Click here to Log in!</Link>
                </Route>
                <Route path="/login">
                    <LoginForm onSuccess={onSuccess} />
                    <Link to="/">Click here to register!</Link>
                </Route>
            </section>
        </HashRouter>
    );
}
