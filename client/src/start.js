import ReactDOM from "react-dom";
import Welcome from "./components/Welcome";
import App from "./components/App";

const rootElement = document.querySelector("main");

const userLoggedIn = window.location.pathname === "/welcome";

ReactDOM.render(userLoggedIn ? <Welcome /> : <App />, rootElement);
