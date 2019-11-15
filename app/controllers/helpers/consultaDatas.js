const Sequelize = require('sequelize')
const { Op } = Sequelize;
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
let mes_atual = {
    [Op.lt]: new Date(`${months[new Date().getMonth() + 1]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth()]} 1 ${new Date().getFullYear()}`).toJSON()
}
let mes_passado = {
    [Op.lt]: new Date(`${months[new Date().getMonth()]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth() - 1]} 1 ${new Date().getFullYear()}`).toJSON()
}
let mes_retrasado = {
    [Op.lt]: new Date(`${months[new Date().getMonth() - 1]} 1 ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${months[new Date().getMonth() - 2]} 1 ${new Date().getFullYear()}`).toJSON()
}
let semana_atual = {
    [Op.lt]: new Date(`${new Date().getDate() + 1} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${new Date().getDate() - 7} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON()
}
let dia_atual = {
    [Op.lt]: new Date(`${new Date().getDate() + 1} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${new Date().getDate()} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON()
}
let semana_passada = {
    [Op.lt]: new Date(`${new Date().getDate() - 7} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON(),
    [Op.gt]: new Date(`${new Date().getDate() - 14} ${months[new Date().getMonth()]} ${new Date().getFullYear()}`).toJSON()
}

module.exports = { mes_atual, mes_passado, mes_retrasado, semana_atual, semana_passada, dia_atual}