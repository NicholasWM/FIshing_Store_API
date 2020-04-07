const Compras = require('../../models/Compras')
const LivroCaixa = require('../../models/LivroCaixa')
const Compras_Produtos = require('../../models/Compras_Produtos')
const api = require('../../service/api')
const MOCK_COMPRA =  {
                    "nome": "Nicholas",
                    "barqueiro":"Fabiano",
                    "pago": 0,
                    "produtos":[
                        {"quantidade": 3, "produto_id": 1},
                    ]}
const MOCK_PAGAMENTO = (modo, valor) => ({valor, modo, tipo_transacao: "entrada"})
describe('Compras',()=>{
    describe('Pagar compra usando diversos meios', ()=>{
        let compra_id = null
        let dadosCaixa = null
        beforeAll(async ()=>{
            const compra = await api.post('/compras', MOCK_COMPRA)
            const livro_caixa = await api.get(`/livro_caixa/resumo/${compra.data.id}/compra`, MOCK_COMPRA)
            const {id} = compra.data
            const {falta} = livro_caixa.data.total
            await api.post(`/compras/${id}/pagar`, MOCK_PAGAMENTO('dinheiro', falta/3))
            await api.post(`/compras/${id}/pagar`, MOCK_PAGAMENTO('credito', falta/3))
            await api.post(`/compras/${id}/pagar`, MOCK_PAGAMENTO('debito', falta/3))
            compra_id = id
            dadosCaixa = await api.get(`/livro_caixa/resumo/${id}/compra`)
        })
        afterAll(async ()=> {
            // await LivroCaixa.destroy({where:{compra_id:compra_id}})
        })
        test('Conta foi paga', async ()=>{
            const dados_compra = await api.get(`/compras/${compra_id}/compra`)
            const pago = dados_compra.data.dados.pago
            expect(pago).toEqual(true)
        })
        test('Transação de Débito registrada', async ()=>{
            expect(dadosCaixa.data.debito.length > 0).toEqual(true)
        })
        test('Transação de Crédito registrada', async ()=>{
            expect(dadosCaixa.data.credito.length > 0).toEqual(true)
        })
        test('Transação de Dinheiro registrada', async ()=>{
            expect(dadosCaixa.data.dinheiro.length > 0).toEqual(true)
        })
    })
    describe('pagar compra com valor superior e receber valor do troco', ()=>{
        let compra_id = null
        let dadosCaixa = null
        let falta = null
        const valor_troco = 50
        beforeAll(async ()=>{
            const compra = await api.post('/compras', MOCK_COMPRA)
            const livro_caixa = await api.get(`/livro_caixa/resumo/${compra.data.id}/compra`, MOCK_COMPRA)
            const {id} = compra.data
            falta = livro_caixa.data.total.falta
            compra_id = id
            dadosCaixa = await api.get(`/livro_caixa/resumo/${id}/compra`)
        })
        test('Retorna troco', async ()=>{
            const {data} = await api.post(`/compras/${compra_id}/pagar`, MOCK_PAGAMENTO('dinheiro', falta+valor_troco))
            expect(valor_troco).toEqual(data.troco)
        })  
        test('Conta foi paga', async ()=>{
            const dados_compra = await api.get(`/compras/${compra_id}/compra`)
            expect(dados_compra.data.dados.pago).toEqual(true)
        })
    })
    describe('Quando inseridos mais produtos em uma conta paga, mudar estado da conta', ()=>{
        let compra_id = null
        let falta = null
        beforeAll(async ()=>{
            const compra = await api.post('/compras', MOCK_COMPRA)
            const livro_caixa = await api.get(`/livro_caixa/resumo/${compra.data.id}/compra`, MOCK_COMPRA)
            const {id} = compra.data
            falta = livro_caixa.data.total.falta
            compra_id = id
        })
        test('Pagar a compra de uma vez', async ()=>{
            const {data} = await api.post(`/compras/${compra_id}/pagar`, MOCK_PAGAMENTO('dinheiro', falta))
            console.log(data)
            expect(data.falta).toEqual(0)
        })
        test('Quando inseridos mais produtos em uma conta paga, mudar estado da conta', async ()=>{
            const dados_compra_antes = await api.get(`/compras/${compra_id}/compra`)
            await api.post(`/compras/${compra_id}/inserir`, MOCK_COMPRA.produtos)
            const dados_compra_depois = await api.get(`/compras/${compra_id}/compra`)
            expect(dados_compra_antes.data.dados.pago).toEqual(true)
            expect(dados_compra_depois.data.dados.pago).toEqual(false)
        }, 5000)
    })
})
