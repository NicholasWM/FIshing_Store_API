const { Model, DataTypes } = require('sequelize');

class Estoque extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            barqueiro: DataTypes.STRING,
            pago: DataTypes.BOOLEAN,
        }, {
            sequelize,
            tableName: 'Estoque'
        })
    }
    static associate(models) {
        this.belongsTo(models.Produtos, { foreignKey: 'produto_id', as: 'produto' });
    }
}

module.exports = Estoque