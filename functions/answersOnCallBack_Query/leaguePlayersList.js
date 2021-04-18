const sqlFunctions = require('../sqlResources/sqlFunctions')
const table = require("table");

const leaguePlayersList = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getLeaguePlayersList(telegramID)
    const listRaw = [['Participante', 'Pontos']]
    info.map((elem, index) => {
        index < 31 ? listRaw.push([String(elem.Nome), String(elem.Pontos)]) : ""
        return 0
    })

    const config = { border: table.getBorderCharacters('ramac'), columns: { 0: { width: 12, wrapWord: true }, 1: { width: 12, wrapWord: true } } }
    const list = String("<pre>" + table.table(listRaw, config) + "</pre>");
    const text = info.length > 31 ? 'Estes são os primeiros 30 participantes:\n\n' : ''
    ctx.telegram.sendMessage(ctx.chat.id, String(`Sua liga possui ${info.length} participante${info.length === 1 ? '' : 's'}.\n\n${text}${list}`), {
        parse_mode: 'HTML',
        reply_markup: { inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar', callback_data: 'manageLeagues' }]] }
    })
})

module.exports = leaguePlayersList