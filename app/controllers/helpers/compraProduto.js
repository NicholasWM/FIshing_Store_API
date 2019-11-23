
const Compras_Produtos = require('../../models/Compras_Produtos');
const LivroCaixa = require('../../models/LivroCaixa');
const preco_total_compra_por_id = async (compra_id) => {
    let itens = await Compras_Produtos.findAll({
        where: {
            compra_id
        },
        attributes: ['id', 'quantidade', 'preco_total'],
    })
    return itens.reduce((prevVal, elem) => prevVal + elem.preco_total, 0)
}
async function retorna_valor_já_pago(compra_id) {
    let pago = await LivroCaixa.findAll({ where: { compra_id } })

    let total_pago = 0
    if (pago.length) {
        total_pago = pago.reduce((prevVal, elem) => prevVal + elem.valor, 0)
    }
    return total_pago
}

module.exports = {
    preco_total_compra_por_id,
    retorna_valor_já_pago
}