require('dotenv').config();
const jwt = require('jsonwebtoken');

function generateToken(username, password){

    const token = jwt.sign(
        {username, password},
        process.env.JWT_SECRET,
        {expiresIn: '8h'}
    );
    return token ;
}

module.exports = { generateToken };

