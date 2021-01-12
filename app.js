//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
require ('custom-env').env()
const { Telegraf } = require('telegraf')

const bot = new Telegraf(process.env.BOT_TOKEN)


bot.start((ctx) => {
    ctx.reply("comecouuu \n - /help")
})

bot.help((ctx) => {
    ctx.reply("escolhe entre \n -/start \n -/help \n -/menu")
})

bot.command("menu", (ctx) => {
    ctx.telegram.sendMessage(ctx.chat.id, "Menu: ", 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "Filme", callback_data: "selected"},{text: "Diretor", callback_data: "diretor"}],
                [{text: "Dir. Fotografia", callback_data: "selected"},{text: "Dir. Arte", callback_data: "selected"}],
                [{text: "Roteiro Adaptado", callback_data: "selected"},{text: "Roteiro Original", callback_data: "selected"}],
                [{text: "Atriz Principal", callback_data: "selected"},{text: "Ator Principal", callback_data: "selected"}],
                [{text: "Atriz Coadjuvante", callback_data: "selected"},{text: "Ator Coadjuvante", callback_data: "selected"}],
                [{text: "Efeitos Visuais", callback_data: "selected"},{text: "Edição", callback_data: "selected"}],
                [{text: "Animação", callback_data: "selected"},{text: "Estrangeiro", callback_data: "selected"}],
                [{text: "Mixagem de Som", callback_data: "selected"},{text: "Edição de Som", callback_data: "selected"}],
                [{text: "Figurino", callback_data: "selected"},{text: "Maquiagem", callback_data: "selected"}],
                [{text: "Documentário", callback_data: "selected"},{text: "Trilha Sonora", callback_data: "selected"}],
                [{text: "Curta-Metragem", callback_data: "selected"},{text: "Canção Original", callback_data: "selected"}],
                [{text: "Anim. Curta-Metragem", callback_data: "selected"},{text: "Doc. Curta-Metragem", callback_data: "selected"}],
            ]
        }
    })
})


bot.action("menu", (ctx) => {
    ctx.deleteMessage()
    ctx.telegram.sendMessage(ctx.chat.id, "Menu: ", 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "Filme", callback_data: "selected"},{text: "Diretor", callback_data: "diretor"}],
                [{text: "Dir. Fotografia", callback_data: "selected"},{text: "Dir. Arte", callback_data: "selected"}],
                [{text: "Roteiro Adaptado", callback_data: "selected"},{text: "Roteiro Original", callback_data: "selected"}],
                [{text: "Atriz Principal", callback_data: "selected"},{text: "Ator Principal", callback_data: "selected"}],
                [{text: "Atriz Coadjuvante", callback_data: "selected"},{text: "Ator Coadjuvante", callback_data: "selected"}],
                [{text: "Efeitos Visuais", callback_data: "selected"},{text: "Edição", callback_data: "selected"}],
                [{text: "Animação", callback_data: "selected"},{text: "Estrangeiro", callback_data: "selected"}],
                [{text: "Mixagem de Som", callback_data: "selected"},{text: "Edição de Som", callback_data: "selected"}],
                [{text: "Figurino", callback_data: "selected"},{text: "Maquiagem", callback_data: "selected"}],
                [{text: "Documentário", callback_data: "selected"},{text: "Trilha Sonora", callback_data: "selected"}],
                [{text: "Curta-Metragem", callback_data: "selected"},{text: "Canção Original", callback_data: "selected"}],
                [{text: "Anim. Curta-Metragem", callback_data: "selected"},{text: "Doc. Curta-Metragem", callback_data: "selected"}],
            ]
        }
    })
})


bot.on('callback_query', (ctx) => {
    ctx.deleteMessage()
    console.log(ctx.update.callback_query.from)
    ctx.telegram.sendMessage(ctx.chat.id, "Melhor Diretor: ", 
    {
        reply_markup: {
            inline_keyboard: [
                [{text: "Martin Scorsese - O Irlandês", callback_data: "menu"},{text: "Todd Phillips - Coringa", callback_data: "menu"}],
                [{text: "Sam Mendes - 1917", callback_data: "menu"},{text: "Bong Joon Ho - Parasita", callback_data: "menu"}],
                [{text: "Quentin Tarantino - Era uma vez em... Hollywood", callback_data: "menu"}],
            ]
        }
    })
})


// bot.action("diretor", (ctx) => {
//     ctx.deleteMessage()
//     console.log(ctx)
//     ctx.telegram.sendMessage(ctx.chat.id, "Melhor Diretor: ", 
//     {
//         reply_markup: {
//             inline_keyboard: [
//                 [{text: "Martin Scorsese - O Irlandês", callback_data: "menu"},{text: "Todd Phillips - Coringa", callback_data: "menu"}],
//                 [{text: "Sam Mendes - 1917", callback_data: "menu"},{text: "Bong Joon Ho - Parasita", callback_data: "menu"}],
//                 [{text: "Quentin Tarantino - Era uma vez em... Hollywood", callback_data: "menu"}],
//             ]
//         }
//     })
// })


bot.use((ctx) => {
    ctx.reply("voltar \n -/start")

})


bot.launch()