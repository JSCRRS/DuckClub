const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { compare, hash } = require("../password");

const { registerUser, getUserByEmail } = require("../db/db");
const { request } = require("express");

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

/* ------- LOGIN ------- */

app.post("/login", (request, response) => {
    const { email, password } = request.body;

    if (!email || !password) {
        response.statusCode = 400;
        response.json({
            message: "Please check your credentials.",
        });
        return;
    }
    getUserByEmail(email)
        .then((user) => {
            if (!user) {
                response.statusCode = 400; //ohne statusCode wird man zurück zu /welcome geleitet
                response.json({
                    message: "User not found.",
                });

                return;
            }
            compare(password, user.password_hash).then((match) => {
                if (!match) {
                    response.statusCode = 400;
                    response.json({
                        message: "Wrong password.",
                    });
                    return;
                }
                request.session.user_id = user.id;
                response.json({
                    message: "success",
                    user_id: user.id,
                });
            });
        })
        .catch((error) => {
            response.statusCode = 500;
            console.log("[server.js] post/login error:", error);

            response.json({
                message: "Something went wrong.",
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
