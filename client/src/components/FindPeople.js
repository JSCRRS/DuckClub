import axios from "./axios";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const [text, setText] = useState("nista");
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        axios.get("/users/most-recent").then((response) => {
            setRecentUsers(response.data);
        });
        // make the axios call to /users/most-recent
        // then setRecentUsers to the response.data
    }, []);

    function onClick() {
        setText("HOLA");
    }

    return (
        <section className="find-people">
            <p>Find people</p>
            <section>
                <h3>Who is new?</h3>
                <ul>{recentUsers}</ul>
            </section>
            <button onClick={onClick}>{text}</button>
        </section>
    );
}
