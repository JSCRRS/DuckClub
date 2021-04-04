const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { compare, hash } = require("../password");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const {
    registerUser,
    getUserByEmail,
    updateUserPassword,
    createPasswordResetCode,
    getPasswordResetCodeByEmailAndCode,
} = require("../db/db");

const app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.json());

app.use(
    express.urlencoded({
        extended: false,
    })
);

app.use((request, response, next) => {
    response.setHeader("x-frame-options", "deny");
    next();
});

app.use(
    cookieSession({
        secret: "There you are!",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    })
);

app.use(csurf());
app.use(function (request, response, next) {
    response.cookie("mytoken", request.csrfToken());
    next();
});

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

/* ------- RESET PASSWORD ------- */

function sendCode({ email, code }) {
    console.log("[social:email] sending email with code", email, code);
}

app.post("/password/reset/start", (request, response) => {
    const { email } = request.body;

    getUserByEmail(email).then((user) => {
        if (!user) {
            response.statusCode = 400;
            response.json({
                message: "Please check again.",
            });
            return;
        }
        const code = cryptoRandomString({ length: 6 });

        createPasswordResetCode({ email, code }).then(() => {
            sendCode({ email, code });
            response.json({
                message: "success",
            });
        });
    });
});

app.post("/password/reset/verify", (request, response) => {
    const { email, code, password } = request.body;

    getPasswordResetCodeByEmailAndCode({
        email,
        code,
    }).then((storedCode) => {
        if (!storedCode) {
            response.statusCode = 400;
            response.json({
                message: "Could not send code.",
            });
            return;
        }
        updateUserPassword({ email, password }).then(() => {
            response.json({
                message: "success",
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
