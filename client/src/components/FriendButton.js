import axios from "./axios";
import { useState, useEffect } from "react";

export default function FriendButton({ id }) {
    const [buttonText, setButtonText] = useState("Send request");
    const [friendship, setFriendship] = useState(false);

    useEffect(() => {
        console.log("USE EFFECT 1", friendship); //false

        axios
            .get(`/friendships/${id}`)
            .then(() => {
                setFriendship(true);
            })
            .catch((error) => {
                if (error.response.status === 404) {
                    console.log(
                        "[FriendButton] no friendship status found: ",
                        error
                    );
                    console.log("USE EFFECT axios nach 404: ", friendship); //???
                    return;
                }
                console.log("something went wrong", error);
            });
    }, [id]);

    useEffect(() => {
        console.log("USE EFFECT2 (vor setButtonText): ", friendship); //???

        if (!friendship) {
            setButtonText("Send FRIENDSHIP request");
            return;
        }
        setButtonText("Cancel your request");
    }, []);

    // another useEffect() depending on the rest of the state is necessary
    // in order to set the button text

    function onClick() {
        console.log("FRIENDSHIP onClick:", friendship);
        if (!friendship) {
            axios.post("/friendships").then((response) => {
                console.log("[FriendButton] post onClick: ", response.data);
                //setFriendship(true);
            });
            return;
        }
        // based on the current state, make the right POST / PUT / DELETE call
    }

    return <button onClick={onClick}>{buttonText}</button>;
}
