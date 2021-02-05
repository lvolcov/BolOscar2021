const shareMenu = (async (ctx) => {
    const menuInicial = []

    menuInicial.push([{ text: "Imagem 1", callback_data: "choicesAll" }, { text: "Mais info", callback_data: "moreInfo" }],
        [{ text: "Voltar", callback_data: "menuInicial" }])
    ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", { reply_markup: { inline_keyboard: menuInicial } })
})

module.exports = shareMenu