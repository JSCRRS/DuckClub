import axios from "./axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

export default function FindPeople() {
    const defaultImageUrl = "https://via.placeholder.com/150";

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
        <section className="find-people friends">
            <section className="new-friends">
                <h2>Who is new?</h2>
                <ul>
                    {recentUsers.map((recentUser) => (
                        <li key={recentUser.id}>
                            <Link to={"/user/" + recentUser.id} target="_blank">
                                <img
                                    src={
                                        recentUser.profile_url ||
                                        defaultImageUrl
                                    }
                                    alt={recentUser.firstname}
                                ></img>
                                {recentUser.firstname} {recentUser.lastname}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <>
                <section className="find-friends">
                    <h2>Looking for someone in particular?</h2>
                    <p>
                        <input
                            type="text"
                            placeholder="Search for someone"
                            onChange={onChange}
                        />
                    </p>
                </section>
                <section className="find-friends-list">
                    <ul>
                        {searchResults.map((searchResult) => (
                            <li className="list" key={searchResult.id}>
                                <Link
                                    to={"/user/" + searchResult.id}
                                    target="_blank"
                                >
                                    {searchResult.firstname}{" "}
                                    {searchResult.lastname}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </section>
            </>
        </section>
    );
}
