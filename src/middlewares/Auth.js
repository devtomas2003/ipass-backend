const jwt = require("jsonwebtoken");
const Utilizadores = require('../models/Utilizadores');

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ "status": "token-unexists" });
    }
    const parts = authHeader.split(' ');
    if(!parts.length === 2){
        return res.status(401).json({ "status": "token-error" });
    }
    const [ scheme, token ] = parts;
    if(scheme !== "Bearer"){
        return res.status(401).json({ "status": "token-bad-format" });
    }
    jwt.verify(token, process.env.ENCRYPT_TOKEN, async (err, decoded) => {
        if(err){
            return res.status(401).json({'status': 'token-bad-sign'});
        }else{
            const user = await Utilizadores.findOne({
                where: {
                    id: decoded.userId
                }
            });
            if(user.estado === 2){
                return res.status(401).json({ "status": "account-disable" });
            }else{
                req.userId = decoded.userId;
                return next();
            }
        }
    });
};