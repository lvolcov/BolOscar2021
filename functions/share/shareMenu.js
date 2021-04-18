const shareMenu = (async (ctx) => {
    const menuInicial = []

    menuInicial.push([{ text: "Categorias Principais", callback_data: "mainCategories" }, { text: "Todos os palpites", callback_data: "choicesAll" }],
        [{ text: "Rakings das suas ligas 🏆", callback_data: "chooseLeagueToShare" }],
        [{ text: "Voltar", callback_data: "menuInicial" }])
    ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = shareMenu