const db = require('../models/index');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await db.Users.findOne({
            where: { email }
        });

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }


        if (!email || !password) {
            return res.status(400).json({ error: 'Email / password is required' });
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format, should be using @gmail.com' });
        }

        if (password.length < 8) {
            return res.status(400).json({ error: 'Password minimum 8 character' });
        }

        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({ error: 'Password must contain letters, numbers, and symbols' });
        }

        if (userExists) {
            return res.status(400).json({ error: 'Email is already associated with an account' });
        }

        await db.Users.create({
            username,
            email,
            password: await bcrypt.hash(password, 15),
        });
        return res.status(200).send('Registration successful');
    } catch (err) {
        return res.status(500).send('Error in registering user');
    }
}

const signInUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if (!email) {
            return res.status(400).json({ error: 'Email are required' });
        }

        if (!password) {
            return res.status(400).json({ error: 'Password are required' });
        }

        const user = await db.Users.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }

        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ error: 'Incorrect email or password' });
        }


        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET);

        res.status(200).json({
            id: user.id,
            email: user.email,
            accessToken: token,
        });
    } catch (err) {
        console.log(err)
    }
};

module.exports = { registerUser, signInUser }