const LivroCaixa = require('../../models/LivroCaixa');
const {
    mes_atual,
    mes_passado,
    mes_retrasado,
    semana_atual,
    semana_passada
} = require('../helpers/consultaDatas')
const {resumo_compra_individual} = require('../helpers/livroCaixaHelper')

module.exports = {
    transacao:async (req, res)=> {
		console.log(req.body)
		const registro = await LivroCaixa.create(req.body)
        return res.json(registro)
    },
    apagar_transacao: (req, res) => {
        LivroCaixa.destroy({ where: { id: req.body.id } })
            .then(registro => { res.json(registro) })
    },
    listar_mes_atual: (req, res)=>{
        LivroCaixa.findAll({
            where: { createdAt: mes_atual}
        }).then(resp => res.json(resp))
    },
    listar_mes_passado: (req, res)=>{
        LivroCaixa.findAll({
            where:{createdAt: mes_passado}
        }).then(resp => res.json(resp))
    },
    listar_mes_retrasado: (req, res)=>{
        LivroCaixa.findAll({
            where:{createdAt: mes_retrasado}
        }).then(resp => res.json(resp))
    },
    listar_semana_atual: (req, res)=>{
        LivroCaixa.findAll({
            where: { createdAt: semana_atual }
        }).then(resp => res.json(resp))
    },
    listar_semana_passada: (req, res)=>{
        LivroCaixa.findAll({
            where: { createdAt: semana_passada }
        }).then(resp => res.json(resp))
    },

    resumo_compra_individual: async(req, res) =>{
        const {compra_id} = req.params
        const registros = await resumo_compra_individual(compra_id)

        res.json(registros)
    }
}