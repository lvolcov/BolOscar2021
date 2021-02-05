
const adminMenu = (async (ctx) => {
    const telegramID = ctx.update.callback_query.from.id
    const menuInicial = []

    if (String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_1 || String(telegramID) === process.env.TELEGRAM_ID_ALLOWED_2) {
        menuInicial.push([{ text: "Recalcular Pontos", callback_data: "updatePoints" }])
    }

    menuInicial.push([{ text: "Voltar", callback_data: "menuInicial" }])
    ctx.telegram.sendMessage(ctx.chat.id, "Menu Admin: ", { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = adminMenu