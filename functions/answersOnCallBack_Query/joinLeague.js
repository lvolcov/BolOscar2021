const joinLeague = (async (ctx) => {
    await ctx.telegram.sendMessage(ctx.chat.id, "Qual o nome da Liga que você deseja participar?", { reply_markup: { force_reply: true } })
    await ctx.telegram.sendMessage(ctx.chat.id, "Escreva o nome exato da liga que você deseja ingressar.",
        { parse_mode: 'HTML', reply_markup: { inline_keyboard: [[{ text: "Voltar", callback_data: "leagues deleteLastMessage" }]] } })
})

module.exports = joinLeague