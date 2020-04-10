const Estoque = require('../../models/Estoque');
async function adiciona_ao_estoque(produto, novo_registro, log_res=false) {
    const { produto_id, quantidade, custo } = novo_registro
    if (!Number(custo)) {
        return log_res? { 'msg': "Custo inexistente" }:false
    }
    await produto.update({ quantidade: Number(produto.quantidade) + Number(quantidade) })
    return await Estoque.create({ produto_id, modo: "entrada", preco: custo, quantidade })
    
}
async function retira_do_estoque(produto, novo_registro, log_res=false) {
    const { produto_id, quantidade } = novo_registro
    if (Number(quantidade) > Number(produto.quantidade)) {
        return log_res ? { 'msg': "Itens insuficientes no estoque" }: false
    }
    await produto.update({ quantidade: Number(produto.quantidade) - Number(quantidade) })
    return await Estoque.create({ produto_id, modo:"saida", preco: produto.preco * quantidade, quantidade }).then(estoque => estoque)
}

module.exports = {
    adiciona_ao_estoque, retira_do_estoque
}