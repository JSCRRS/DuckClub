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

    function onBeFriendsClick(id) {
        axios.put(`/friendships/${id}`, { accepted: true }).then(() => {
            const updatedIncoming = incoming.filter(
                (element) => element.user.id !== id
            );

            const acceptedFriendship = incoming.find(
                (element) => element.user.id === id
            );

            setIncoming(updatedIncoming); // soll gemacht werden, wenn der axios-call erfolgreich war!
            setAccepted([...accepted, acceptedFriendship]);
        });
    }

    function onDeleteFriendsClick(id) {
        axios.delete(`/friendships/${id}`).then(() => {
            const updatedFriendList = accepted.filter(
                (element) => element.user.id !== id
            );

            setAccepted(updatedFriendList);
        });
    }

    return (
        <section className="friends">
            <section>
                <h2>These people want to be your friends</h2>
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
                                <span>
                                    {element.user.firstname}{" "}
                                    {element.user.lastname}
                                </span>
                            </Link>

                            <button
                                className="profileButton"
                                onClick={() =>
                                    onBeFriendsClick(element.sender_id)
                                }
                            >
                                Be Friends
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
            <section>
                <h2>These people are currently your friends</h2>
                <ul>
                    {accepted.map((element) => (
                        <li key={element.user.id}>
                            <Link
                                to={"/user/" + element.user.id}
                                target="_blank"
                            >
                                <img
                                    src={element.user.profile_url}
                                    alt={element.user.firstname}
                                ></img>
                                <span>
                                    {element.user.firstname}{" "}
                                    {element.user.lastname}
                                </span>
                            </Link>

                            <button
                                className="profileButton"
                                onClick={() =>
                                    onDeleteFriendsClick(element.user.id)
                                }
                            >
                                Delete Friend
                            </button>
                        </li>
                    ))}
                </ul>
            </section>
        </section>
    );
}
