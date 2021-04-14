import axios from "./axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

function splitFriendships(friendships = []) {
    const incoming = [];
    const accepted = [];

    friendships.forEach((element) => {
        if (element.accepted === true) {
            accepted.push(element);
        }
        if (element.accepted === false) {
            incoming.push(element);
        }
    });
    return { incoming, accepted };
}

export default function Friends() {
    const [incoming, setIncoming] = useState([]);
    const [accepted, setAccepted] = useState([]);

    useEffect(() => {
        axios.get("/friendships").then((response) => {
            const { incoming, accepted } = splitFriendships(response.data);
            setIncoming(incoming);
            setAccepted(accepted);
        });
    }, []);

    console.log("INCOMING", incoming);
    console.log("ACCEPTED", accepted);

    return (
        <section className="friends">
            <section>
                <h3>These people want to be your friends</h3>
                <ul>
                    {incoming.map((element) => (
                        <li key={element.sender_id}>
                            <Link
                                to={"/user/" + element.sender_id}
                                target="_blank"
                            >
                                <img
                                    src={element.user.profile_url}
                                    alt={element.user.firstname}
                                ></img>
                                {element.user.firstname} {element.user.lastname}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h3>These people are currently your friends</h3>
                <ul>
                    {accepted.map((element) => (
                        <li key={element.recipient_id}>
                            <Link
                                to={"/user/" + element.recipient_id}
                                target="_blank"
                            >
                                <img
                                    src={element.user.profile_url}
                                    alt={element.user.firstname}
                                ></img>
                                {element.user.firstname} {element.user.lastname}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
