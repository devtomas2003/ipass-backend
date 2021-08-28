const { Model, DataTypes } = require('sequelize');

class SignAuths extends Model {
    static init(sequelize){
        super.init({
            id: {
                type: DataTypes.STRING,
                primaryKey: true
            },
            userId: DataTypes.STRING,
            textForAuth: DataTypes.STRING
        }, {
            sequelize,
            tableName: 'signAuths'
        });
    }
}

module.exports = SignAuths;