const Estoque = require('../../models/Estoque');
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
    
}