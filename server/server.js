const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json());

app.use(
    cookieSession({
        secret: "There you are!",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
);

/* ------- REGISTRATION ------- */

app.get("/welcome", (request, response) => {
    /*    if (!request.session.user_id) {
        response.sendFile(path.join(__dirname, "..", "client", "index.html"));
    } */
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));

    /* response.send("ALREADY LOGGED IN!"); */
});

app.get("*", function (request, response) {
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
