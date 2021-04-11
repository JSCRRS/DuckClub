import axios from "./axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        axios.get("/users/most-recent").then((response) => {
            setRecentUsers(response.data.latestUsers);
        });
    }, []);

    useEffect(() => {
        if (searchTerm.length <= 2) {
            return;
        }
        axios.get(`/users/search?q=${searchTerm}`).then((response) => {
            /*        if (searchTerm === null) {
                console.log("[FindPeople] no response in searching:");
                return;
            } */
            setSearchResults(response.data.queryResults);
        });
    }, [searchTerm]);

    function onChange(event) {
        setSearchTerm(event.target.value);
    }

    return (
        <section className="find-people">
            <p>Find people</p>
            <section>
                <h3>Who is new?</h3>
                <ul>
                    {recentUsers.map((recentUser) => (
                        <li key={recentUser.id}>
                            <Link to={"/user/" + recentUser.id} target="_blank">
                                <img
                                    src={recentUser.profile_url}
                                    alt={recentUser.firstname}
                                ></img>
                                {recentUser.firstname} {recentUser.lastname}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h3>Looking for someone in particular?</h3>
                <p>
                    <input
                        type="text"
                        placeholder="Search for someone"
                        onChange={onChange}
                    />
                </p>
                <ul>
                    {searchResults.map((searchResult) => (
                        <li key={searchResult.id}>
                            <Link
                                to={"/user/" + searchResult.id}
                                target="_blank"
                            >
                                {searchResult.firstname} {searchResult.lastname}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
