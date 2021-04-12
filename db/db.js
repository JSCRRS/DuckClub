const { hash } = require("../password");
const spicedPg = require("spiced-pg");

const database = process.env.DB || "socialNetwork";

function getDatabaseURL() {
    if (process.env.DATABASE_URL) {
        return process.env.DATABASE_URL;
    }
    const { username, password } = require("../secrets.json");
    return `postgres:${username}:${password}@localhost:5432/${database}`;
}

const db = spicedPg(getDatabaseURL());

function registerUser({ firstname, lastname, email, password_hash }) {
    return db
        .query(
            `INSERT INTO users (firstname, lastname, email, password_hash) 
            VALUES ($1, $2, $3, $4) RETURNING id`,
            [firstname, lastname, email, password_hash]
        )
        .then((result) => result.rows[0].id);
}

function getUserByEmail(email) {
    return db
        .query("SELECT * FROM users WHERE email = $1", [email])
        .then((result) => result.rows[0]);
}

function updateUserPassword({ email, password }) {
    return hash(password).then((password_hash) => {
        db.query(
            `UPDATE users SET password_hash = $1 
        WHERE email = $2`,
            [password_hash, email]
        );
    });
}

function createPasswordResetCode({ email, code }) {
    return db
        .query(
            `INSERT INTO password_reset_codes (email, code) 
            VALUES ($1, $2)`,
            [email, code]
        )
        .then((result) => result.rows[0]);
}

function getPasswordResetCodeByEmailAndCode({ email, code }) {
    return db
        .query(
            `SELECT * FROM password_reset_codes
            WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
            AND email = $1
            AND code = $2`,
            [email, code]
        )
        .then((result) => result.rows[0]);
}

/* ------- PICTURE UPLOAD ------- */

function getUserById(id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [id])
        .then((result) => result.rows[0]);
}

function updateUserProfile({ user_id, profilePicURL }) {
    return db.query(`UPDATE users SET profile_url = $1 WHERE id = $2`, [
        profilePicURL,
        user_id,
    ]);
}

/* ------- BIO UPDATE ------- */

function updateUserBio({ user_id, bioText }) {
    return db.query(`UPDATE users SET bio = $1 WHERE id = $2`, [
        bioText,
        user_id,
    ]);
}

/* ------- GET LATEST USERS ------- */

function getLatestUsers(number) {
    return db
        .query(
            `SELECT id, firstname, lastname, profile_url 
            FROM users ORDER BY id DESC LIMIT $1`,
            [number || 4]
        )
        .then((result) => result.rows);
}

/* ------- GET Query USERS ------- */

function getQueryMatches(q) {
    return db
        .query(
            `SELECT id, firstname, lastname FROM users 
            WHERE firstname ILIKE $1 OR lastname ILIKE $1`,
            [q + "%"]
        )
        .then((results) => results.rows);
}

/* ------- FRIENDSHIP BUTTON ------- */

function getFriendship({ first_id, second_id }) {
    return db
        .query(
            `SELECT * FROM friendships WHERE 
        sender_id = $1 AND recipient_id = $2 
        OR 
        sender_id = $2 AND recipient_id = $1`,
            [first_id, second_id]
        )
        .then((results) => {
            return results.rows[0];
        });
}

function createFriendship({ sender_id, recipient_id }) {
    console.log(
        "[db] createFriendship sender_id, recipient_id:",
        sender_id,
        recipient_id
    );
    return db
        .query(
            `INSERT INTO friendships (sender_id, recipient_id)
            VALUES ($1, $2) RETURNING *`,
            [sender_id, recipient_id]
        )
        .then((result) => {
            return result.rows[0];
        });
}

function updateFriendship({ sender_id, recipient_id, accepted }) {
    console.log(
        "[db] updateFriendship sender_id, recipient_id, acceptet: ",
        sender_id,
        recipient_id,
        accepted
    );

    return db
        .query(
            `UPDATE friendships SET accepted = $1 
        WHERE sender_id = $2 AND recipient_id = $3 
        RETURNING *`,
            [accepted, sender_id, recipient_id]
        )
        .then((result) => {
            console.log(
                "[db] updateFriendship result.rows[0]: ",
                result.rows[0]
            );
            return result.rows[0];
        });
}

function deleteFriendship({ first_id, second_id }) {
    console.log(
        "[db] deleteFriendship sender_id, recipient_id: ",
        first_id,
        second_id
    );

    return db.query(
        `
        DELETE FROM friendships 
        WHERE sender_id = $1 AND recipient_id = $2
        OR sender_id = $2 AND recipient_id = $1`,
        [first_id, second_id]
    );
}

module.exports = {
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
};
