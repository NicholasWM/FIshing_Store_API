const Estoque = require('../../models/Estoque');
async function adiciona_ao_estoque(produto, novo_registro, log_res=false) {
    const { produto_id, quantidade, custo } = novo_registro
    if (!custo) {
        return log_res? res.json({ 'msg': "Custo inexistente" }):false
    }
    await produto.update({ quantidade: produto.quantidade + quantidade })
    await Estoque.create({ produto_id, modo: "entrada", preco: custo, quantidade })
}
async function retira_do_estoque(produto, novo_registro, log_res) {
    const { produto_id, quantidade } = novo_registro
    if (quantidade > produto.quantidade) {
        return log_res ? res.send({ 'msg': "Itens insuficientes no estoque" }): false
    }
    await produto.update({ quantidade: produto.quantidade - quantidade })
    return await Estoque.create({ produto_id, modo:"saida", preco: produto.preco * quantidade, quantidade }).then(estoque => estoque.id)
}

module.exports = {
    adiciona_ao_estoque, retira_do_estoque
}