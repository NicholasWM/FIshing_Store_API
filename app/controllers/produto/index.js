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
    },
    list_categorias: async (req, res)=>{
        const quantidade_unicos = 0
        const quantidade_estoque = 0
        const produtos =  await Produtos.findAll({
            attributes:['id','nome', 'quantidade', 'categoria', "imagem", "preco"]
        })
        let categorias = []
        produtos.filter(produto => {
            if(!categorias.filter(categoria => {
                //Verifica se a categoria já está registrada
                if (produto.categoria == categoria.categoria){
                    //Atualiza a categoria com o novo produto
                    categoria.produtos.push(produto)
                    categoria.itens_diferentes+=1
                    categoria.total_unidades+=produto.quantidade
                    categoria.valor_em_estoque+=produto.quantidade*produto.preco
                }
                return produto.categoria == categoria.categoria
            }).length){
                return categorias.push({
                    categoria:produto.categoria,
                    produtos:[produto],
                    valor_em_estoque:produto.quantidade*produto.preco,
                    itens_diferentes:1,
                    total_unidades:produto.quantidade
                })
            }
        })
        res.json(categorias)
    }
}