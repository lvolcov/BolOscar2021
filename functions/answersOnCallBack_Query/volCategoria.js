const sqlFunctions = require('../sqlResources/sqlFunctions')
const db = require('../../db.json');
const geraLista = require('../geraLista');

const volCategoria = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id

    const info = await sqlFunctions.getVotes(telegramID)
    const nonVoted = []
    Object.keys(info[0]).slice(4).map((elem, index) =>{
        info[0][elem] === "0" ? nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido}) : ""
        return 0
    })
    const result = geraLista(nonVoted)
    result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
    ctx.telegram.sendMessage(ctx.chat.id, "Selecione a categoria:", {reply_markup: {inline_keyboard: result}})
})

module.exports = volCategoria