const Compras = require('../../models/Compras');
const Estoque = require('../../models/Estoque');
const Produtos = require('../../models/Produtos');
const LivroCaixa = require('../../models/LivroCaixa');
const Compras_Produtos = require('../../models/Compras_Produtos');
const { adiciona_ao_estoque, retira_do_estoque } = require('../helpers/estoqueHelper')
const { preco_total_compra_por_id, retorna_valor_já_pago } = require('../helpers/compraProduto')
const { resumo_compra_individual } = require('../helpers/livroCaixaHelper')
const { dia_atual} = require('../helpers/consultaDatas')

const nota_completa_das_compras = async (compras) => {
    // COMPRAS TEM DE SER UM ARRAY DE OBJETOS RETORNADO PELO BANCO COMPRAS
    console.log("ID: ", JSON.stringify(compras))
    let compras_id = compras.map(compra => compra.id)

    let compras_produtos = await Compras_Produtos.findAll({
        where: {
            compra_id: [...compras_id],

        }
    })
    const response = compras.map((compra, index) => {
        const produtos = compras_produtos.filter(prod => compra.id == prod.compra_id)
        let categorias = []
        produtos.filter(produto => {
            if (!categorias.filter(categoria => {
                if (produto.categoria == categoria.categoria) {
                    categoria.produtos.push(produto)
                }
                return produto.categoria == categoria.categoria
            }).length) {
                return categorias.push({ categoria: produto.categoria, produtos: [produto] })
            }
        })
        return {
            "id": compra.id,
            "nome": compra.nome,
            "barqueiro": compra.barqueiro,
            "pago": compra.pago,
            "createdAt": compra.createdAt,
            "updatedAt": compra.updatedAt,
            "produtos": (() => {

                const result_produtos = compra.produtos.map((produto, index, array) => {
                    let compra = { id: produto.id, nome: produto.nome, categoria: produto.categoria, imagem: produto.imagem, dados: produtos.filter(prod => prod.produto_id == produto.id) }
                    return compra
                })
                let categorias = []
                result_produtos.filter(produto => {
                    if (!categorias.filter(categoria => {
                        if (produto.categoria == categoria.categoria) {
                            categoria.produtos.push(produto)
                        }
                        return produto.categoria == categoria.categoria
                    }).length) {
                        return categorias.push({ categoria: produto.categoria, produtos: [produto] })
                    }
                })
                return categorias
			})(),
            "preco_total": produtos.reduce((prevVal, elem) => prevVal + elem.preco_total, 0)
        }
    })
    return response

}

const insere_produtos_na_compra = async (registros, compra_id) =>{
    // BUG DA COMPRA FECHADA RECEBENDO MAIS PEDIDOS E CONTINUANDO COM STATUS DE PAGA
    let produtos_criados = []
        registros.map(async (registro) => {
            let produto = await Produtos.findByPk(registro.produto_id)
            if(produto){
                let estoque = await retira_do_estoque(produto, registro)
                let estoque_id = estoque.id
                if(estoque_id){
                    let { quantidade, produto_id } = registro
                    await Compras_Produtos.create({
                        estoque_id,quantidade, preco_total: produto.preco*quantidade, produto_id, compra_id
                    })
                return true
            }}
            return false
        })
}

const atualizar_item_compra = async (item_id, quantidade)=>(
    Compras_Produtos.findByPk(item_id, {
        include: [{
                association: 'produto',
                attributes: ['preco']
        }]
    }).then(compra =>
            compra.update({
                quantidade,
                preco_total: quantidade * compra.produto.preco
            })
    )
)

const valida_relacao_item_compra = async(compra_id, item_id) =>{
        try {
            const consulta = await Compras_Produtos.findByPk(item_id, {
                attributes: [],
                include: [{
                    association: 'compra',
                    attributes: ['id']
                }]
            })
            if(consulta.compra.id != compra_id) {
                return { 'msg': "Não existe esse item dentro da compra/pedido" }
            }
        }catch (error) {
            return { 'msg': "id da compra invalido" }
        }
        return false
}

const listar_compra_por_id = async(compra_id)=>{
    return await Compras_Produtos.findAll({
        where: {
            compra_id
        },
        attributes: ['id', 'quantidade', 'preco_total'],
        include: [
            {
                association: 'produto',
                attributes: ['nome', 'preco', 'categoria', 'imagem'],
            }
        ]
    })
}
const lista_compras_abertas = async (req, res) => {
    let compras = await Compras.findAll({
		where: { pago: false },
		order:[['id', 'DESC']],
        include: [{
            association: 'produtos',
            attributes: ['nome', "id", "categoria", 'imagem']
        }],
    })
    let compras_com_produtos = await nota_completa_das_compras(compras)
    res.json(compras_com_produtos)
}

module.exports = {
    lista_compras_abertas,
    inserir_compra: async (req, res) => {
        const { nome, barqueiro, pago, produtos } = req.body
        let compra = await Compras.create({
            nome,barqueiro,pago
        })
        await insere_produtos_na_compra(produtos, compra.id)
        let lista_compras = 0
        setTimeout(async ()=> {
            lista_compras = await Compras.findOne({
                where: { id: compra.id },
                include: [{
                    association: 'produtos',
                    attributes: ['nome', "id", "categoria"]
                }],
            })
            const compra_montada = await nota_completa_das_compras([lista_compras])
            res.json(...compra_montada)
        },1000)
        console.log(JSON.stringify(compra));
        // console.log("produtos_registrados ",produtos_registrados );

        // return res.json({compra, produtos_registrados})
    },
    list_all: async (req, res) => {
        let compras = await Compras.findAll({
			include: [{
				association: 'produtos',
				attributes: ['nome', "id", "categoria", 'imagem']
			}],
			order:[['id', 'DESC']],

		})
		let compras_com_produtos = await nota_completa_das_compras(compras)
		res.json(compras_com_produtos)
    },
    adicionar_a_compra: async (req, res) => {

        const { compra_id } = req.params;
        const registros = req.body
        // Atualizar estado da conta
        const compra = await Compras.findByPk(compra_id)
        compra.update({pago: 0})
        return res.json(await insere_produtos_na_compra(registros, compra_id))
    },
    listar_pedidos_compra: async(req, res) => {
        const { compra_id } = req.params;
        const itens = await listar_compra_por_id(compra_id)
        const dados_compra = await Compras.findByPk(compra_id)
        let compra = {
            dados:dados_compra,
            itens: itens,
            total: itens.reduce((prevVal, elem) => prevVal + elem.preco_total, 0 )
        }


        return res.json(compra)
    },
    atualizar_item_compra:async(req, res) =>{
        const {compra_id, item_id} = req.params
        const {quantidade} = req.body
        const validacao = await valida_relacao_item_compra(compra_id, item_id)
        !!validacao?res.json(validacao):null
        await atualizar_item_compra(item_id, quantidade),
        res.status(200).send()

    },
    apagar_compra:async (req,res)=>{
        const {compra_id} = req.params
        try {
            await Compras.destroy({where:{id:compra_id}})
            res.status(200).send()
        } catch (error) {

        }
    },
    apagar_item_compra: async(req,res)=>{
        const { compra_id, item_id } = req.params
        const validacao = await valida_relacao_item_compra(compra_id, item_id)
        !!validacao ? res.json(validacao) : null
        compra_produto = await Compras_Produtos.findByPk(item_id)
        await Estoque.destroy({where:{id:compra_produto.estoque_id}})
        produto = await Produtos.findByPk(compra_produto.produto_id)
        produto.update({quantidade: produto.quantidade+compra_produto.quantidade})
        await Compras_Produtos.destroy({where:{id:compra_produto.id}})
        res.json(produto)
        // Apagar estoque
        // Retornar quantidade ao Produto
        // Apagar Compra Produto

        // res.status(200).send()
    },
    lista_compras_dia: async(req,res)=>{
        const compras = await Compras.findAll({ where: { createdAt: dia_atual } })
        res.json(compras)
    },
    pagar: async (req, res)=>{
        const {valor, modo, tipo_transacao} = req.body
        const {compra_id} = req.params
        const compra = await Compras.findByPk(compra_id)
        // ->> O estado da Conta
        // ->> Oque foi pago X preco total X oque vai ser pago


        // Calcula valor total da conta e quanto foi pago
        const total_pago = await retorna_valor_já_pago(compra_id)
        const total = await preco_total_compra_por_id(compra_id)

        // Registra quanto falta para ser pago
        let falta = total - total_pago
        // Verifica se a conta está paga
        if(compra.pago || falta == 0){compra.update({pago: 1});return res.json({"msg": "Conta já está paga!"})}

        let troco = 0
        // Verifica se o valor que está sendo pago é menor ou igual ao que falta
        if (valor < falta){
            //Atualiza o valor q falta para ser pago
            falta = falta - valor
            // Registra entrada no caixa
            await LivroCaixa.create({ valor, modo, tipo_transacao , compra_id })
        }else{
            troco = valor - falta
            await LivroCaixa.create({ valor: (troco > 0) ? falta : valor, modo, tipo_transacao , compra_id })
            falta = 0
        }
        if(falta == 0) compra.update({pago: 1})

        if(troco) return res.json({troco })
        return res.json({'falta':falta })

    },
    testeSocket: async (req, res)=>{

        await req.io.emit('testando', req.body.msg);

        return res.json({'msg':1})
    }
}