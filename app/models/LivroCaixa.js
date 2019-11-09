module.exports = (sequelize, DataTypes) => {
    const LivroCaixa = sequelize.define('LivroCaixa', {
        categoria: DataTypes.STRING,
        tipo_transacao: DataTypes.STRING,
        modo: DataTypes.STRING,
        numero_pedido: DataTypes.INTEGER,
        valor: DataTypes.FLOAT,
    });

    return LivroCaixa;
}