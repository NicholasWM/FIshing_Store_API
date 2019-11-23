const Estoque = require('../../models/Estoque');
const Produtos = require('../../models/Produtos');
const { adiciona_ao_estoque, retira_do_estoque } = require('../helpers/estoqueHelper')
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
            attributes: ["id", 'modo', 'preco', 'quantidade', "createdAt"],
            include: [{
                association: 'produto',
                attributes: ['id','nome','quantidade']
            }],
            where: { createdAt: mes_atual }
        })
        res.json(estoque)
    },
    listar_semana_atual:async(req, res)=>{
        const estoque= await Estoque.findAll({
            where: { createdAt: semana_atual }
        })
        res.json(estoque)
    },
    listar:async(req, res)=>{
        const estoque= await Estoque.findAll()
        res.json(estoque)
    },
    inserir_registro: async(req, res)=>{
        if(!!!req.body){
            return res.send({'msg':""})
        }
        const {produto_id, modo} = req.body

        const produto = await Produtos.findByPk(produto_id)
        if(!produto){
            return res.send({"msg": "Produto não existe"})
        }

        if (modo.toLowerCase() != "entrada" && modo.toLowerCase() != "saida") {
            return res.send({'msg': "modo inválido!"})
        }

        modo.toLowerCase() == "entrada" ? adiciona_ao_estoque(produto, req.body, 1) : retira_do_estoque(produto, req.body, 1)

        return res.json(produto)
    }
    
}