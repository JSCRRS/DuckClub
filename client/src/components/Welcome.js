import RegistrationForm from "./RegistrationForm";

export default function Welcome() {
    function onSuccess() {
        console.log("[Welcome] onSuccess: Registered!");
    }

    return (
        <section className="welcome">
            <h1>Welcome!</h1>
            <p> IMAGE / TITLE HERE!</p>
            <RegistrationForm onSuccess={onSuccess} />
            <p>
                If you are a member, login <a href="login">here!</a>
            </p>
        </section>
    );
}
