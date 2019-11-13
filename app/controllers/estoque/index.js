const Estoque = require('../../models/Estoque');
const Produtos = require('../../models/Produtos');
const {
    mes_atual,
    mes_passado,
    mes_retrasado,
    semana_atual,
    semana_passada
} = require('../helpers/consultaDatas')

module.exports = {
    listar_mes_atual:async(req, res)=>{
        const estoque= await Estoque.findAll({
            where: { createdAt: mes_atual }
        })
        res.json(estoque)
    },
    listar:async(req, res)=>{
        const estoque= await Estoque.findAll()
        res.json(estoque)
    },
    inserir_registro: async(req, res)=>{
        if(!!!req.body){
            return res.status(400).send({'msg':""})
        }
        const {produto_id, modo, quantidade} = req.body

        const produto = await Produtos.findByPk(produto_id)
        if(!produto){
            return res.status(400).send({"msg": "Produto não existe"})
        }

        if (modo.toLowerCase() != "entrada" && modo.toLowerCase() != "saida") {
            return res.status(400).send({'msg': "modo inválido!"})
        }

        modo.toLowerCase() == "entrada" ? adiciona_ao_estoque(produto, quantidade, req.body.custo) : retira_do_estoque(produto, quantidade)

        return res.json(produto)

        async function adiciona_ao_estoque(produto, quantidade, custo) {
            if(!custo){
                return res.json({'msg': "Custo inexistente"})
            }
            await produto.update({ quantidade: produto.quantidade + quantidade })
            await Estoque.create({ produto_id, modo, preco: custo, quantidade })
        }
        async function retira_do_estoque(produto, quantidade) {
            if (quantidade > produto.quantidade) {
                return res.status(400).send({ 'msg': "Itens insuficientes no estoque" })
            }
            await produto.update({ quantidade: produto.quantidade - quantidade })
            await Estoque.create({ produto_id, modo, preco: produto.preco * quantidade, quantidade })
        }

    }
    
}