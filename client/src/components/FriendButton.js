import axios from "./axios";
import { useState, useEffect } from "react";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("Send request");
    const [friendship, setFriendship] = useState(false);
    const [readyForFriendship, setReadyForFriendship] = useState(false);

    useEffect(() => {
        axios
            .get(`/friendships/${id}`)
            .then((response) => {
                console.log(response);
                setFriendship(true);
                setReadyForFriendship(response.data.sender_id === parseInt(id));
                console.log("friendship: ", friendship);
                console.log("readyfor friendship: ", readyForFriendship);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    console.log(
                        "[FriendButton] no friendship status found: ",
                        error
                    );
                    return;
                }
                console.log("something went wrong", error);
            });
    }, [id]);

    useEffect(() => {
        if (!friendship) {
            setButtonText("Send FRIENDSHIP request");
            return;
        }
        if (readyForFriendship) {
            setButtonText("Accept request");
        }
        setButtonText("Cancel your request");
    }, [friendship, readyForFriendship]);

    // another useEffect() depending on the rest of the state is necessary
    // in order to set the button text

    function onClick() {
        console.log("FRIENDSHIP onClick:", friendship);
        if (!friendship) {
            axios.post(`/friendships/${id}`).then((response) => {
                console.log("[FriendButton] post onClick: ", response.data);
                setFriendship(true);
                setReadyForFriendship(false);
            });
            return;
        }

        // based on the current state, make the right POST / PUT / DELETE call
    }

    return <button onClick={onClick}>{buttonText}</button>;
}
