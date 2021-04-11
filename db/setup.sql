DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS password_reset_codes;


CREATE TABLE users (
    id              SERIAL PRIMARY KEY,
    firstname       VARCHAR(255) NOT NULL,
    lastname        VARCHAR(255) NOT NULL,
    email           VARCHAR(50) NOT NULL UNIQUE,
    password_hash   VARCHAR NOT NULL,
    profile_url     TEXT,
    bio             TEXT,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE password_reset_codes (
    id              SERIAL PRIMARY KEY,
    code            VARCHAR(6) NOT NULL,
    email           VARCHAR(50) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE friendships (
    id              SERIAL PRIMARY KEY,
    sender_id       INT REFERENCES users(id) NOT NULL,
    recipient_id    INT REFERENCES users(id) NOT NULL,
    accepted        BOOLEAN DEFAULT false,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);