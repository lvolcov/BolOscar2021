const joinLeague = (async (ctx) => {
    await ctx.telegram.sendMessage(ctx.chat.id, "Qual o nome da Liga que você deseja participar?", {reply_markup: {force_reply: true}})
    await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE INGRESSAR NA LIGA E EXPLICANDO QUE TEM Q ESCREVER O NOME EXATO",
        {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
})

module.exports = joinLeague