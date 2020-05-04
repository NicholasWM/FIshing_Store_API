const LivroCaixa = require('../../models/LivroCaixa');
const Compras_Produtos = require('../../models/Compras_Produtos');
const Compras = require('../../models/Compras');
const {
    mes_atual,
    mes_passado,
    mes_retrasado,
    semana_atual,
    semana_passada
} = require('../helpers/consultaDatas')
const { preco_total_compra_por_id, retorna_valor_já_pago } = require('../helpers/compraProduto')

const resumo_compra_individual = async (compra_id) => {
    // Busca dados da compra

    const compra = await Compras.findAll({where:{"id":compra_id}})
    // Busca todos os Compras_Produtos com o ID da compra
    const compras_produtos = await Compras_Produtos.findAll({where:{"id":compra_id}})
    // Buscar todos os registros do LivroCaixa com o ID da compra
    const caixa = await LivroCaixa.findAll({ where: { compra_id, "tipo_transacao": "entrada"}})
    // Separa pagamentos por modo de pagamento
    const meios = ['debito', 'credito', 'deposito', 'dinheiro']
    const vetor = {}
    meios.map(meio => {
        vetor[meio] = caixa.map(registro =>
            registro.modo.toLowerCase() == meio.toLowerCase() ? registro : null).filter((value) => value != null)
    })
    // Mostra o quanto foi pago e quanto falta
    const preco_total = await preco_total_compra_por_id(compra_id)
    const pago = await retorna_valor_já_pago(compra_id)
    vetor.total = {
        preco_total, pago, falta: preco_total-pago
    }
    vetor.dados = compra
    return vetor
}
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