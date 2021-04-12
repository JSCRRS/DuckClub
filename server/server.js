const express = require("express");
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { compare, hash } = require("../password");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { s3upload } = require("../s3");
const { uploader } = require("../upload");

const {
    registerUser,
    getUserByEmail,
    updateUserPassword,
    createPasswordResetCode,
    getPasswordResetCodeByEmailAndCode,
    getUserById,
    updateUserProfile,
    updateUserBio,
    getLatestUsers,
    getQueryMatches,
    getFriendship,
    createFriendship,
    updateFriendship,
    deleteFriendship,
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

/* ------- PICTURE UPLOAD ------- */

app.get("/user", (request, response) => {
    const { user_id } = request.session;

    getUserById(user_id).then((user) => {
        if (!user) {
            response.statusCode = 404;
            response.json({
                message: "Could not find user.",
            });
            return;
        }
        const { id, firstname, lastname, email, profile_url, bio } = user;
        response.json({
            id: id,
            firstname: firstname,
            lastname: lastname,
            email: email,
            profile_url: profile_url,
            bio: bio,
        });
    });
});

app.post(
    "/upload_picture",
    uploader.single("file"),
    s3upload,
    (request, response) => {
        const { user_id } = request.session;
        const profilePicURL = `https://s3.amazonaws.com/spicedling/${request.file.filename}`;

        updateUserProfile({ user_id, profilePicURL })
            .then(() => {
                response.json({ profilePicURL });
            })
            .catch((error) => {
                response.statusCode = 500;
                console.log(
                    "[SERVER: post/upload_picture] Could not upload file: ",
                    error
                );
            });
    }
);

/* ------- BIO ------- */

app.put("/user", (request, response) => {
    const { user_id } = request.session;
    const { bioText } = request.body;

    updateUserBio({ user_id, bioText })
        .then(() => {
            response.json({ bioText });
        })
        .catch((error) => {
            response.statusCode = 500;
            console.log("[SERVER: put/user] Could not get bioText: ", error);
        });
});

/* ------- FindPeople Data ------- */

app.get("/users/most-recent", (request, response) => {
    const number = 3;
    getLatestUsers(number)
        .then((latestUsers) => response.json({ latestUsers }))
        .catch((error) => {
            response.statusCode = 500;
            console.log("[SERVER: most-recent] Could not get users: ", error);
        });
});

app.get("/users/search", (request, response) => {
    const { q } = request.query;

    if (!q) {
        response.statusCode = 400;
        response.json({
            message: "q in query needed.",
        });
        return;
    }
    getQueryMatches(q).then((queryResults) => {
        if (!queryResults) {
            response.statusCode = 404;
            response.json({
                message: "Could not find user.",
            });
            return;
        }
        response.json({ queryResults });
    });
});

/* ------- OtherProfile Data ------- */

app.get("/api/users/:user_id", (request, response) => {
    const user_id = request.params.user_id;

    if (request.session.user_id == request.params.user_id) {
        response.statusCode = 400;
        response.json({
            message: "See your profile at '/' for your information.",
        });
        return;
    }

    getUserById(user_id).then((user) => {
        if (!user) {
            response.statusCode = 404;
            response.json({
                message: "Could not find user.",
            });
            return;
        }
        const { id, firstname, lastname, profile_url, bio } = user;
        response.json({
            id: id,
            firstname: firstname,
            lastname: lastname,
            profile_url: profile_url,
            bio: bio,
        });
    });
});

/* ------- FRIENDSHIP BUTTON Data ------- */

app.get("/friendships/:user_id", (request, response) => {
    const first_id = request.session.user_id;
    const second_id = request.params.user_id;

    getFriendship({ first_id, second_id }).then((status) => {
        console.log("[server] getFriendship status:", status);
        if (!status) {
            response.statusCode = 404;
            response.json({
                message: "No status available.",
            });
            return;
        }
        response.json(status);
    });
});

app.post("/friendships/:user_id", (request, response) => {
    const sender_id = request.session.user_id;
    const recipient_id = request.params.user_id;

    console.log("[server] sender, recipient", sender_id, recipient_id);

    getFriendship({ sender_id, recipient_id }).then((status) => {
        console.log("[server] getFriendship status:", status);

        if (status) {
            response.statusCode = 400;
            response.json({
                message: "Already friends.",
            });
            return;
        }
        createFriendship({ sender_id, recipient_id })
            .then((result) => {
                console.log("[server] createFriendship result:", result);
                response.json({
                    result,
                });
            })
            .catch((error) => {
                console.log("[server] createFriendship error:", error);
                response.statusCode = 500;
                response.json({
                    message: "Could not create friendship.",
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
