const sqlFunctions = require('../sqlResources/sqlFunctions')

const moreInfo = (async (ctx) => {
    //Closing date set to 26/04/2021 - 00:00 UTC
    const closingTime = new Date(Date.UTC(2021, 3, 26, 00, 00, 0, 0));
    const timeNow = Date.now()

    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
    const telegramID = ctx.update.callback_query.from.id

    called === 'naoSalvaNome' ? ctx.answerCbQuery(called, { text: '❌ Nome não salvo', show_alert: true }) : ""

    if (called === 'salvaNome') {
        await sqlFunctions.changeName(telegramID, previousInfo)
        ctx.answerCbQuery(called, { text: `✅ Nome alterado !`, show_alert: true })
    }
    let moreInfoMenu = []
    if (timeNow < closingTime) {
        moreInfoMenu.push([{ text: "Pesos das Categorias", callback_data: "pointsCat" }, { text: "Meus Palpites", callback_data: "votesList" }],
            [{ text: "Alterar nome", callback_data: "changeName" }, { text: "Resetar Palpites", callback_data: "resetVotes" }],
            [{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
    } else {
        moreInfoMenu.push([{ text: "Pesos das Categorias", callback_data: "pointsCat" }, { text: "Meus Palpites", callback_data: "votesList" }],
            [{ text: "Alterar nome", callback_data: "changeName" }], [{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
    }
    ctx.telegram.sendMessage(ctx.chat.id, "Mais Informações:", { reply_markup: { inline_keyboard: moreInfoMenu } })
})

module.exports = moreInfo