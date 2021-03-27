const sqlFunctions = require('../sqlResources/sqlFunctions')
const table = require("table");
const db = require('../../db.json');

const publicLeagues = (async (ctx) => {
    const info = await sqlFunctions.getPublicLeaguesInfo()

    const message = [['\nLigas', 'Número de Participantes']]

    info.map((elem) => {
        message.push([elem.NomeLiga, elem.Participantes])
    })

    const config = { border: table.getBorderCharacters('ramac'), columns: { 0: { width: 15, wrapWord: true }, 1: { width: 13, alignment: 'center', wrapWord: true } } }
    const messageTable = String("<pre>" + table.table(message, config) + "</pre>");

    await ctx.telegram.sendMessage(ctx.chat.id, String("🌎\n\nLista das Ligas Públicas:\n\n" + messageTable),
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues" }]] } })

})

module.exports = publicLeagues