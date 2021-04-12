import axios from "./axios";
import { useState, useEffect } from "react";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("Send request");
    const [friendship, setFriendship] = useState(false);
    const [incoming, setIncoming] = useState(false);
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        axios
            .get(`/friendships/${id}`)
            .then((response) => {
                setFriendship(true);
                setIncoming(response.data.sender_id === parseInt(id));
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
        if (incoming) {
            setButtonText("Accept request");
            return;
        }
        if (accepted) {
            setButtonText("Unfriend");
            return;
        }
        setButtonText("Cancel your request");
    }, [friendship, incoming, accepted]);

    // another useEffect() depending on the rest of the state is necessary
    // in order to set the button text

    function onClick() {
        if (!friendship) {
            axios.post(`/friendships/${id}`).then((response) => {
                console.log("[FriendButton] post onClick: ", response.data);
                setFriendship(true);
                setIncoming(false);
                setAccepted(false);
            });
            return;
        }
        if (!accepted) {
            console.log("[FriendButton] onClick accepted]", accepted);

            axios
                .put(`/friendships/${id}`, { accepted: true })
                .then((response) => {
                    console.log("[FriendButton] onClick put: ", response);
                    setFriendship(true);
                    setIncoming(false);
                    setAccepted(response.data.accepted);
                });
            return;
        }

        // based on the current state, make the right POST / PUT / DELETE call
    }

    return <button onClick={onClick}>{buttonText}</button>;
}
