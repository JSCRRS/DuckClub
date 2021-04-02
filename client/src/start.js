import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import Logo from "./components/Logo";

const rootElement = document.querySelector("main");

const userLoggedIn = window.location.pathname === "/welcome";

ReactDOM.render(userLoggedIn ? <Welcome /> : <Logo />, rootElement);
