const { Model, DataTypes } = require('sequelize');

class Compras_Produtos extends Model {
    static init(sequelize) {
        super.init({
            quantidade: DataTypes.FLOAT,
            preco_total: DataTypes.FLOAT,
        }, {
            sequelize,
            tableName: 'Compras_Produtos'
        })
    }
    static associate(models) {
        this.belongsTo(models.Compras, { foreignKey: 'compra_id', as: 'compra' });
        this.belongsTo(models.Produtos, { foreignKey: 'produto_id', as: 'produto' });
    }
}

module.exports = Compras_Produtos