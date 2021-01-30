const sqlFunctions = require('../sqlResources/sqlFunctions')
const table = require("table"); 
const db = require('../../db.json');

const votesList = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const info = await sqlFunctions.getVotes(telegramID)
    const voted = [['CATEGORIA', 'PALPITE']]

    Object.keys(info[0]).slice(4).map((elem, index) =>{
        if (info[0][elem] !== "0" ) {
            voted.push([String(db.categorias[elem].nomeMenu), String(db.categorias[elem].indicados[info[0][elem]].nomeCompleto)])
        }
        return 0
    })

    if (voted.length > 1){
        const config = {border: table.getBorderCharacters('ramac'), columns: {0: {width: 12,wrapWord: true},1: {width: 12,wrapWord: true}}}
        const lista = String("<pre>" + table.table(voted, config) + "</pre>"); 
        ctx.telegram.sendMessage(ctx.chat.id, String("Seus Palpites:\n\n"+lista), {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
    } else {
        ctx.telegram.sendMessage(ctx.chat.id, 'Você ainda não deu nenhum palpite.', {reply_markup: {inline_keyboard: [[{text : "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria"}],[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
    }
})

module.exports = votesList