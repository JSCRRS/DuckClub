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

    return <p>hola</p>;
}
