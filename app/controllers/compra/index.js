const Compras = require('../../models/Compras');
const Compras_Produtos = require('../../models/Compras_Produtos');
module.exports = {
    inserir_compra: async (req, res) => {
        const { nome,barqueiro,pago } = req.body
        
        const compra = await Compras.create({
            nome,barqueiro,pago
        })
        // return res.json({ ok: produto })
        return res.json(compra)
    },
    list_all: async (req, res) => {
        let busca = await Compras.findAll()
        return res.json(busca)
    },
    adicionar_a_compra: async (req, res) => {
        const { compra_id } = req.params;
        const registros = req.body
        
        registros.map(async (registro)=> {
            let { quantidade, preco_total, produto_id } = registro
            // console.log(quantidade, preco_total, produto_id, parseInt(compra_id));
            let compra = await Compras_Produtos.create({
                quantidade, preco_total, produto_id, compra_id: parseInt(compra_id)
            }) 
            return compra  
            
        })
        return res.json(registros)
    },
    listar_pedidos_compra: async(req, res) => {
        const { compra_id } = req.params;
        return res.json({'ok':'ok'})
    }
}