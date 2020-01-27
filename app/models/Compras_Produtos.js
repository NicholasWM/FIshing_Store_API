const { Model, DataTypes } = require('sequelize');

class Compras_Produtos extends Model {
    static init(sequelize) {
        super.init({
            quantidade: DataTypes.FLOAT,
            preco_total: DataTypes.FLOAT,
        }, {
            sequelize,
            tableName: 'compras_produtos'
        })
    }
    static associate(models) {
        this.belongsTo(models.Compras, { foreignKey: 'compra_id', as: 'compra' });
        this.belongsTo(models.Produtos, { foreignKey: 'produto_id', as: 'produto' });

        // this.hasOne(models.Estoque, { foreignKey: 'estoque_id', targetKey: 'id' });

        this.belongsTo(models.Estoque, { foreignKey: 'estoque_id' });


    }
}

module.exports = Compras_Produtos