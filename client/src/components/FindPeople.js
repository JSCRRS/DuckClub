import axios from "./axios";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);

    useEffect(() => {
        axios.get("/users/most-recent").then((response) => {
            setRecentUsers(response.data.latestUsers);
        });
    }, []);

    return (
        <section className="find-people">
            <p>Find people</p>
            <section>
                <h3>Who is new?</h3>
                <ul>
                    {recentUsers.map((recentUser) => (
                        <li key={recentUser.id}>
                            <img
                                src={recentUser.profile_url}
                                alt={recentUser.firstname}
                            ></img>
                            {recentUser.firstname} {recentUser.lastname}
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
