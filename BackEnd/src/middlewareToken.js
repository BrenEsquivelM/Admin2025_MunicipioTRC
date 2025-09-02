require('dotenv').config();
const jwt = require('jsonwebtoken');

async function checkToken(req, res, next){
    //const authHeader = req.authHeader['authotization'];
    //const token = authHeader && authHeader.split(' ')[1];
    
    const token = await req.cookies.token;
    //console.log(token)

    /*jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('Token invalido o finalizado');
            return res.status(403).json({ error: 'Token invalido o expirado'});
        }
        req.user = user;
        next();
    })*/

    if(!token){
        return res.status(401).json({ error: 'Token requerido'});
    }

    try{
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    }catch (err){
        res.status(403).json({ error: 'Token invalido o expirado'});
    }
}

module.exports = checkToken;