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
    if (request.session.userId) {
        response.send("ALREADY LOGGED IN!");
    }
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/* app.post("/users", (request, response) => {
    request.session.userId = 123;
    response.json({
        message: "success",
    });
}); */

/* app.post("/users-failing", (request, response) => {
    response.statusCode = 402;
    response.json({
        message: "bad request",
    });
}); */

/* ------- OTHERS ------- */

app.get("*", function (request, response) {
    if (!request.session.userId) {
        response.redirect("/welcome");
        return;
    }
    response.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

/* ------- STARTING SERVER ------- */

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
