const { Model, DataTypes } = require('sequelize');

class Produtos extends Model {
    static init(sequelize) {
        super.init({
            nome: DataTypes.STRING,
            preco: DataTypes.FLOAT,
            categoria: DataTypes.STRING,
            imagem: DataTypes.STRING,
        }, {
            sequelize,
            tableName: 'Produtos'
        })
    }
    static associate(models) {
        // this.hasMany(models.Estoque, { foreignKey: 'produto_id', as: 'estoque' });
        this.belongsToMany(models.Compras, { foreignKey: 'produto_id', through: 'compras_produtos', as: 'compras' });
    }
}

module.exports = Produtos