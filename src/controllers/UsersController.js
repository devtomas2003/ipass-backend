const Utilizadores = require('../models/Utilizadores');
const SignAuths = require('../models/SignAuths');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt-nodejs');
const NodeRSA = require('node-rsa');
const jwt = require('jsonwebtoken');

module.exports = {
    async signAuth(req, res){
        const { user, pass } = req.body;
        const bufferPASS = Buffer.from(pass, 'base64');
        const password = bufferPASS.toString('ascii');
        const userAuth = await Utilizadores.findOne({
            where: {
                utilizador: user
            },
            attributes: ["id", "estado", "password", "userLevel"]
        });
        if(userAuth){
            bcrypt.compare(password, userAuth.password, async function(err, result) {
                if(result){
                    if(userAuth.estado === 2){
                        return res.status(401).json({ "status": "account-disable" });
                    }else if(userAuth.estado === 0){
                        const authToken = jwt.sign({ userId: userAuth.id }, process.env.ENCRYPT_TOKEN, { expiresIn: 10800 });
                        res.status(200).json({
                            "status": 0,
                            authToken
                        });
                    }else{
                        const signToken = uuidv4();
                        await SignAuths.create({
                            id: uuidv4(),
                            userId: userAuth.id,
                            textForAuth: signToken
                        });
                        res.status(200).json({
                            "textForAuth": signToken,
                            "status": userAuth.estado
                        });
                    }
                }else{
                    res.status(404).json({
                        "status": "not-valid-credentials"
                    });
                }
            });
        }else{
            res.status(404).json({
                "status": "not-valid-credentials"
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
            await SignAuths.destroy({
                where: {
                    textForAuth: textToBeSign
                }
            });
            const findUser = await Utilizadores.findOne({
                where: {
                    id: findText.userId
                }
            });
            const pubRSA = new NodeRSA(findUser.chavePublica);
            const verified = pubRSA.verify(textToBeSign, textSigned, "utf8", "base64");
            if(verified){
                const authToken = jwt.sign({ userId: findText.userId }, process.env.ENCRYPT_TOKEN);
                res.status(200).json({
                    "status": "authenticated",
                    authToken
                });
            }else{
                res.status(401).json({
                    "status": "invalid-signature"
                });
            }
        }else{
            res.status(404).json({
                "status": "text-notfound"
            });
        }
    },
    async getPEM(req, res){
        const keysPair = new NodeRSA({ b: 4096 });
        const pubKey = keysPair.exportKey('public');
        const priKey = keysPair.exportKey('private');
        res.status(200).json({
            "publica": pubKey.replace(/(\r\n|\n|\r)/gm,""),
            "privado": priKey.replace(/(\r\n|\n|\r)/gm,"")
        });
    },
    async validateSession(req, res){
        res.status(200).json({
            "isValid": true
        });
    },
    async getUserInfo(req, res){
        const userId = req.userId;
        const user = await Utilizadores.findOne({
            where: {
                id: userId
            }
        });
        res.status(200).json({
            "nome": user.nome,
            "ruleID": user.userLevel,
            "estado": user.estado
        });
    },
    async savePublicKey(req, res){
        const userId = req.userId;
        const { publicKey } = req.body;
        await Utilizadores.update({
            chavePublica: publicKey,
            estado: 1
        }, {
            where: {
                id: userId
            }
        });
        res.status(200).json({ "status": "updated" });
    }
};