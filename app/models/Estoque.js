const { Model, DataTypes } = require('sequelize');

class Estoque extends Model {
    static init(sequelize) {
        super.init({
            modo: DataTypes.STRING,
            preco: DataTypes.FLOAT,
            quantidade: DataTypes.FLOAT,
        }, {
            sequelize,
            tableName: 'Estoque'
        })
    }
    static associate(models) {
        this.belongsTo(models.Produtos, { foreignKey: 'produto_id', as: 'produto' });

        // this.belongsTo(models.Compras_Produtos, { foreignKey: 'compra_produto_id', as: 'compra_produto' });

        // this.hasOne(models.Compras_Produtos, { foreignKey: 'compra_produto_id', targetKey: 'id' });

    }
}

module.exports = Estoque