const bcrypt = require('bcryptjs');

async function login(req, res) {
    const db = req.app.get('db');
    const { username } = req.query;
    const { password } = req.body;

    try {
        const results = await db.get_user([ username ]);
        
        if (!results[0]) {
            console.log("not found")
            return res.sendStatus(400);
        }

        const user = results[0];
        
        const matches = await bcrypt.compare(password, user.password);

        if (!matches) {
            console.log("invalid pass")
            return res.sendStatus(400);
        }

        req.session.user = {
            id: user.account_id,
            username: user.username
        }

        res.status(200).json(req.session.user);
    } catch (e) {
        console.log('error while logging in', e);
    }
}

async function register(req, res) {
    const db = req.app.get('db');
    const { username, password } = req.body;

    try {
        const results = await db.get_user([ username ]);
        
        if (results[0]) {
            return res.sendStatus(400);
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const account = await db.register_user([ username, hashedPassword ]);
        const user = account[0];

        req.session.user = {
            id: user.account_id,
            username: user.username
        }

        res.status(201).json(req.session.user);
    } catch (e) {
        console.log("error while registering account", e);
    }
}

function logout(req, res) {
    req.session.destroy();
}

function getUser(req, res) {
    if (!req.session.user) {
        return res.sendStatus(400);
    }

    res.status(200).json(req.session.user);
}

module.exports = {
    login,
    register,
    logout,
    getUser
}