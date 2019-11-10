
const { Model, DataTypes } = require('sequelize');

class LivroCaixa extends Model {
    static init(sequelize) {
        super.init({
            tipo_transacao: DataTypes.STRING,
            modo: DataTypes.STRING,
            compra_id: DataTypes.INTEGER,
            valor: DataTypes.FLOAT,
        }, {
            sequelize,
            tableName: 'LivroCaixa'
        })
    }
    static associate(models) {
        this.belongsTo(models.Compras, { foreignKey: 'compra_id', as: 'compra' });
    }
}

module.exports = LivroCaixa
