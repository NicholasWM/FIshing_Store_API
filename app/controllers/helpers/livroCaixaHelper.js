const Compras = require('../../models/Compras');
const Compras_Produtos = require('../../models/Compras_Produtos');
const LivroCaixa = require('../../models/LivroCaixa');

const {preco_total_compra_por_id, retorna_valor_já_pago} = require('./compraProduto')

module.exports = {
	resumo_compra_individual: async (compra_id) => {
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
}