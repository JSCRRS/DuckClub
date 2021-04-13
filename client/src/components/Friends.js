import axios from "./axios";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

/* function splitFriendships(friendships = []) {
    const incoming = [];
    const accepted = [];

    friendships.forEach(element => {
        if (element.incoming)
    })

    // Implement it in order to return something like:
    // {
    //    incoming: [...],
    //    accepted: [...],
    // }
    //
    // Initialising two empty arrays and a plain old for loop goes a long way!
} */

/* const response = await axios.get("/friendships");
const { incoming, accepted } = splitFriendships(response.data); */

export default function Friends() {
    const [friendsList, setFriendsList] = useState([]);

    useEffect(() => {
        axios.get("/friendships").then((response) => {
            console.log(response);
        });
    });
}
