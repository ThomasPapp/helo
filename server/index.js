require('dotenv').config();
const express = require('express');
const session = require('express-session');
const { json } = require('body-parser');
const massive = require("massive");
const app = express();

const PORT = process.env.SERVER_PORT || 3001;

const authController = require('./controllers/authController');

app.use(json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false
}));

massive(process.env.CONNECTION_STRING)
.then(db => {
    app.set('db', db);
    console.log("Database connected...")
})
.catch(err => console.log("Failed to connect to database...", err));

// auth endpoints
app.post('/auth/login', authController.login);
app.post('/auth/register', authController.register);
app.get('/auth/logout', authController.logout);
app.get('/auth/user', authController.getUser);

app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));