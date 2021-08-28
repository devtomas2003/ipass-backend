const { Model, DataTypes } = require('sequelize');

class Utilizadores extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            nome: DataTypes.STRING,
            utilizador: DataTypes.STRING,
            password: DataTypes.STRING,
            chavePublica: DataTypes.TEXT,
            estado: DataTypes.INTEGER,
            userLevel: DataTypes.INTEGER
        }, {
            sequelize,
            tableName: 'utilizadores'
        });
    }
}

module.exports = Utilizadores;