const Compras = require('../../models/Compras');
const Produtos = require('../../models/Produtos');
const Compras_Produtos = require('../../models/Compras_Produtos');

const insere_produtos_na_compra = async (registros, compra_id) =>{
    registros.map(async (registro) => {
        let { quantidade, produto_id } = registro
        let { preco } = await Produtos.findByPk(produto_id)
        await Compras_Produtos.create({
            quantidade, preco_total: preco*quantidade, produto_id, compra_id
        })
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

module.exports = {
    inserir_compra: async (req, res) => {
        const { nome, barqueiro, pago, produtos } = req.body
        
        const compra = await Compras.create({
            nome,barqueiro,pago
        })
        // return res.json({ ok: produto })
        insere_produtos_na_compra(produtos, compra.id)
        return res.json(compra.id)
    },
    list_all: async (req, res) => {
        let busca = await Compras.findAll()
        return res.json(busca)
    },
    adicionar_a_compra: async (req, res) => {
        
        const { compra_id } = req.params;
        const registros = req.body
        
        res.json(insere_produtos_na_compra(registros, compra_id))
    },
    listar_pedidos_compra: async(req, res) => {
        const { compra_id } = req.params;
        const compra = await Compras_Produtos.findAll({
            where:{ 
                compra_id
             },
            attributes: ['id','quantidade', 'preco_total'],
            include:[
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
        await Compras_Produtos.destroy({where:{id:item_id}})
        res.status(200).send()
    },
    lista_compras_abertas: async (req, res)=>{
        const compras = await Compras.findAll({where:{pago:false}})
        res.json(compras)

    }
}