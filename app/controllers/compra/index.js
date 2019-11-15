const Compras = require('../../models/Compras');
const Estoque = require('../../models/Estoque');
const Produtos = require('../../models/Produtos');
const Compras_Produtos = require('../../models/Compras_Produtos');
const { adiciona_ao_estoque, retira_do_estoque } = require('../helpers/estoqueHelper')
const { dia_atual} = require('../helpers/consultaDatas')

const insere_produtos_na_compra = async (registros, compra_id) =>{
    let results = await registros.map(async (registro) => {
        let produto = await Produtos.findByPk(registro.produto_id)
        if(produto){
            let estoque_id = await retira_do_estoque(produto, registro)
            if(estoque_id){
                let { quantidade, produto_id } = registro
                await Compras_Produtos.create({
                    estoque_id,quantidade, preco_total: produto.preco*quantidade, produto_id, compra_id
                })
            return true
        }}
        return false
    })
    console.log(results);
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
            },
            {
                association: 'compra',
                attributes: ['nome', 'barqueiro', 'createdAt'],
            },
        ]
    })
}

module.exports = {
    inserir_compra: async (req, res) => {
        const { nome, barqueiro, pago, produtos } = req.body
        
        const compra = await Compras.create({
            nome,barqueiro,pago
        })
        // return res.json({ ok: produto })
        await insere_produtos_na_compra(produtos, compra.id)
        return res.json(compra.id)
    },
    list_all: async (req, res) => {
        let busca = await Compras.findAll()
        return res.json(busca)
    },
    adicionar_a_compra: async (req, res) => {
        
        const { compra_id } = req.params;
        const registros = req.body
        res.json(await insere_produtos_na_compra(registros, compra_id))
    },
    listar_pedidos_compra: async(req, res) => {
        const { compra_id } = req.params;
        const compra = await listar_compra_por_id(compra_id)
        
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
    lista_compras_abertas: async (req, res)=>{
        const compras = await Compras.findAll({where:{pago:false}})
        res.json(compras)
    },
    lista_compras_dia: async(req,res)=>{
        const compras = await Compras.findAll({ where: { createAt: dia_atual } })
        res.json(compras)
    } 
}