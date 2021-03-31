import ReactDOM from "react-dom";
/* import RegistrationForm from "./components/RegistrationForm";
 */
import Welcome from "./components/Welcome";
const rootElement = document.querySelector("main");

ReactDOM.render(
    <HelloWorld />,

    <Welcome />,

    /* <RegistrationForm />, */ rootElement
);

function HelloWorld() {
    return <div>Anyong!</div>;
}
