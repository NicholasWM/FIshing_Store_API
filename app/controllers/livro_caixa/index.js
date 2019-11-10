const Sequelize = require('sequelize')
const LivroCaixa = require('../../models/LivroCaixa');
const {Op} = Sequelize;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let mes_atual = {
    [Op.lt]: new Date(`${months[new Date().getMonth() + 1]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth()]} 1 ${new Date().getFullYear()}`).toJSON()
}
let mes_passado = {
    [Op.lt]: new Date(`${months[new Date().getMonth()]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth()-1]} 1 ${new Date().getFullYear()}`).toJSON()
}
let mes_retrasado = {
    [Op.lt]: new Date(`${months[new Date().getMonth() -1]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth()-2]} 1 ${new Date().getFullYear()}`).toJSON()
}
let semana_atual = {
    [Op.lt]: new Date(`${new Date().getDate() +1} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${new Date().getDate() - 7} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON()
}
let semana_passada = {
    [Op.lt]: new Date(`${new Date().getDate() -7} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${new Date().getDate() - 14} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON()
}
module.exports = {
    transacao:async (req, res)=> {
        console.log(req.body)
        const registro = await LivroCaixa.create(req.body)
        res.json(registro)
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
}