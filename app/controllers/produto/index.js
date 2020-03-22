const Produtos = require('../../models/Produtos');
module.exports = {
    inserir_produto: async (req, res) => {
        console.log("req.file>>>>", req.file)
        const { filename } = req.file
        const { nome, preco, categoria } = req.body

        const produto = await Produtos.create({
            nome,preco,categoria
            ,imagem:filename
        })
        return res.json({
                            id:produto.id,
                            nome:produto.nome,
                            preco:produto.preco,
                            categoria:produto.categoria,
                            imagem:produto.imagem,
                            quantidade:0
                        })
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