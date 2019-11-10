const Produtos = require('../../models/Produtos');
module.exports = {
    inserir_produto: async (req, res) => {
        const { filename } = req.file
        const { nome, preco, categoria } = req.body

        // const { user_id } = req.headers

        // const user = await User.findById(user_id)

        // if (!user) {
        //     return res.status(400).json({ error: 'User does not exists' })
        // }

        const produto = await Produtos.create({
            nome,preco,categoria
            ,imagem:filename
        })
        return res.json({ ok: produto })
    },
    list_all: async (req, res) =>{
        let busca =  await Produtos.findAll()
        return res.json(busca)
    }
}