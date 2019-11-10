
const { Model, DataTypes } = require('sequelize');

class User extends Model {
    static init(sequelize) {
        super.init({
            name: DataTypes.STRING,
            email: DataTypes.STRING,
            password: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'Users'
        })
    }
}

module.exports = User



// module.exports = (sequelize, DataTypes) => {
//     const User = sequelize.define('User', {
//         name: DataTypes.STRING,
//         email: DataTypes.STRING,
//         password: DataTypes.STRING,
//     });

//     return User;
// }