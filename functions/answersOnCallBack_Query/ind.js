const sqlFunctions = require('../sqlResources/sqlFunctions')
const geraLista = require('../geraLista');
const db = require('../../db.json');

const ind = (async (ctx) => {
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
    const telegramID = ctx.update.callback_query.from.id

    const categoriaDoIndicado = Object.keys(db.categorias).filter((item) => {
        const filter = Object.keys(db.categorias[item].indicados).filter((ind) => ind === called)
        return filter.length === 0 ? false : true
    }).toString()
    await sqlFunctions.postVote(telegramID, categoriaDoIndicado, called)
    const info = await sqlFunctions.getVotes(telegramID)
    const nonVoted = []
    const voted = []
    ctx.answerCbQuery(called, { text: '✅ Pitaco Contabilizado', show_alert: true })

    Object.keys(info[0]).slice(4).map((elem, index) => {
        if (info[0][elem] === "0") {
            nonVoted.push({ text: db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido })
        } else {
            voted.push([{ text: String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " " + previousInfo) }])
        }
        return 0
    })

    const result = previousInfo === "voltaMenuJaVotados" ? voted : geraLista(nonVoted)
    result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])

    nonVoted.length == 0 ? ctx.telegram.sendMessage(ctx.chat.id, "Parabéns, você votou em todas as categorias!", { reply_markup: { inline_keyboard: result } }) : ctx.telegram.sendMessage(ctx.chat.id, "Selecione a categoria para palpitar:", { reply_markup: { inline_keyboard: result } })
})

module.exports = ind