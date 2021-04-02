const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { compare, hash } = require("../password");

const { registerUser } = require("../db/db");

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
    if (request.session.user_id) {
        response.redirect("/");
    }
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.post("/users", (request, response) => {
    hash(request.body.password).then((password_hash) => {
        return registerUser({
            ...request.body,
            password_hash,
        })
            .then((id) => {
                request.session.user_id = id;
                response.json({
                    message: "success",
                    user_id: id,
                });
            })
            .catch((error) => {
                response.statusCode = 500;
                console.log("[server.js] post/users error:", error);
                response.json({
                    message: "This email is already taken.",
                });
            });
    });
});

/* ------- OTHERS ------- */

app.get("*", (request, response) => {
    if (!request.session.user_id) {
        response.redirect("/welcome");
        return;
    }
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/* ------- STARTING SERVER ------- */

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
