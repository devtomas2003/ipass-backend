const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).send({ "status": "token-unexists" });
    }
    const parts = authHeader.split(' ');
    if(!parts.length === 2){
        return res.status(401).send({ "status": "token-error" });
    }
    const [ scheme, token ] = parts;
    if(scheme !== "Bearer"){
        return res.status(401).send({ "status": "token-bad-format" });
    }
    jwt.verify(token, "c72c7f79-757b-468c-9f4f-fa1808f3087c", (err, decoded) => {
        if(err){
            return res.status(401).send({'status': 'token-bad-sign'});
        }else{
            req.userId = decoded.userId;
            return next();
        }
    });
};