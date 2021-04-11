import axios from "./axios";
import { useState, useEffect } from "react";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("Send request");
    const [friendship, setFriendship] = useState(false);

    useEffect(() => {
        axios
            .get(`/friendships/${id}`)
            .then((response) => {
                setFriendship(true);
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
    });

    // another useEffect() depending on the rest of the state is necessary
    // in order to set the button text

    function onClick() {
        console.log("click");
        // based on the current state, make the right POST / PUT / DELETE call
    }

    return <button onClick={onClick}>{buttonText}</button>;
}
