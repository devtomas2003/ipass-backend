const Utilizadores = require('../models/Utilizadores');
const SignAuths = require('../models/SignAuths');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');

module.exports = {
    async signAuthenticate(req, res){
        const { user, pass } = req.body;
        const userAuth = await Utilizadores.findOne({
            where: {
                utilizador: user
            },
            attributes: ["id", "estado", "password"]
        });
        if(userAuth){
            bcrypt.compare(pass, userAuth.password, async function(err, result) {
                if(result){
                    if(userAuth.estado === 0){
                        res.status(200).json({
                            "status": 0
                        });
                    }else{
                        const signToken = uuidv4();
                        await SignAuths.create({
                            id: uuidv4(),
                            userId: userAuth.id,
                            textForAuth: signToken
                        });
                        res.status(200).json({
                            "id": userAuth.id,
                            "textForAuth": signToken,
                            "status": userAuth.estado
                        });
                    }
                }else{
                    res.status(200).json({
                        "status": "not-auth"
                    });
                }
            });
        }else{
            res.status(200).json({
                "status": "not-auth"
            });
        }
    },
    async addUser(req, res){
        const { nome, utilizador, password } = req.body;
        await Utilizadores.create({
            id: uuidv4(),
            nome,
            utilizador,
            password,
            estado: 0,
            userLevel: 0
        });
        res.status(201).json({
            "status": "Utilizador criado com sucesso!"
        });
    },
    async authenticate(req, res){
        const { textToBeSign, textSigned } = req.body;
        const findText = await SignAuths.findOne({
            where: {
                textForAuth: textToBeSign
            }
        });
        if(findText){
            const findUser = await Utilizadores.findOne({
                where: {
                    id: findText.userId
                }
            });
            const verifier = crypto.createVerify("RSA-SHA256");
            verifier.update(textToBeSign);
            const isVerified = verifier.verify(findUser.chavePublica, textSigned, "base64");
            res.status(200).json({
                "status": isVerified
            });
        }else{
            res.status(200).json({
                "status": "text-notfound"
            });
        }
    },
    async getPEM(req, res){
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
            modulusLength: 4096,
            publicKeyEncoding: {
              type: 'spki',
              format: 'pem'
            },
            privateKeyEncoding: {
              type: 'pkcs8',
              format: 'pem'
            }
        });
        res.status(200).json({
            "publica": publicKey.replace(/(\r\n|\n|\r)/gm,""),
            "privado": privateKey.replace(/(\r\n|\n|\r)/gm,"")
        });
    }
};