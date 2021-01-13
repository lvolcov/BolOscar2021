//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
require ('custom-env').env()
const { Telegraf } = require('telegraf')
const db = require('./db.json');
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start((ctx) => {ctx.reply("comecouuu \n - /menu")})

bot.help((ctx) => {ctx.reply("escolhe entre \n -/start \n -/help \n -/menu")})

bot.command("menu", (ctx) => {
    ctx.deleteMessage()
    const makeResult = Object.keys(db.categorias).map((elem, index) =>{
        return {text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido}
    })
    const result = geraLista(makeResult)
    ctx.telegram.sendMessage(ctx.chat.id, "Menu:", 
    {reply_markup: {inline_keyboard: result}
    })
})


bot.action("menu", (ctx) => {
    ctx.deleteMessage()
    const makeResult = Object.keys(db.categorias).map((elem) =>{
        return {text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido}
    })
    const result = geraLista(makeResult)
    ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: result}})
})

bot.on('callback_query', (ctx) => {
    const called = ctx.update.callback_query.data
    const typeCalled = called.substring(0,3)
    ctx.deleteMessage()
    if (typeCalled === 'cat') {
        const makeResult = Object.keys(db.categorias[called].indicados).map((elem) =>{
            return {text : db.categorias[called].indicados[elem].nomeCompleto, callback_data: db.categorias[called].indicados[elem].nomeResumido}
        })
        const result = geraLista(makeResult)
        ctx.telegram.sendMessage(ctx.chat.id, 'Categoria ' + db.categorias[called].nomeCompleto + ':', {reply_markup: {inline_keyboard: result}})
    }
    else{
        ///
        /// INCLUIR CONTAGEM DOS VOTOS
        ///
        ctx.answerCbQuery(called, {text : '✅ Voto Contabilizado', show_alert : false})
        const makeResult = Object.keys(db.categorias).map((elem) =>{
            return {text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido}
        })
        const result = geraLista(makeResult)
        ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: result}})
    }
    })

bot.use((ctx) => {ctx.reply("voltar \n -/start")})

bot.launch()

function geraLista (items) {
    const result = []
    let i = 0
    while (i < items.length){
        items[i+1] === undefined ? result.push([items[i]]) : result.push([items[i], items[i+1]])
        i += 2
    }
    return result
}