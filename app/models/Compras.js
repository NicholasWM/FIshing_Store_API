const { Model, DataTypes } = require('sequelize');

class Compras extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            barqueiro: DataTypes.STRING,
            pago: DataTypes.BOOLEAN,
        }, {
            sequelize,
            tableName: 'Compras'
        })
    }
    static associate(models) {
        this.hasMany(models.LivroCaixa, { foreignKey: 'compra_id', as: 'registro_livro_caixa' });
        this.belongsToMany(models.Produtos, { foreignKey: 'compra_id', through: 'compras_produtos', as: 'produtos' });
    }
}

module.exports = Compras