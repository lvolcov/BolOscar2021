//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
require ('custom-env').env()
const { Telegraf } = require('telegraf')
const getVotes = require('./sqlResources/getVotes')
const newUser = require('./sqlResources/createNewUser')
const postVote = require('./sqlResources/postVote')
const db = require('./db.json');
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(async (ctx) => {
    const telegramID = ctx.update.message.from.id
    const nome = String(ctx.update.message.from.first_name === undefined ? telegramID : ctx.update.message.from.first_name) +" "+ String(ctx.update.message.from.last_name === undefined ? '' : ctx.update.message.from.last_name)
    let info = await getVotes(telegramID)
    if(info.length === 0) {
        newUser(telegramID, nome); 
    }
    menuInicial = [[{text : "Votar", callback_data: "volCategoria"}, {text : "Já votados", callback_data: "voted"}],]
    ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: menuInicial}})
})

bot.on('callback_query', async (ctx) => {
    ctx.deleteMessage()
    const called = ctx.update.callback_query.data
    const typeCalled = called.substring(0,3)
    if (typeCalled === 'cat') {
        const makeResult = Object.keys(db.categorias[called].indicados).map((elem) =>{
            return {text : db.categorias[called].indicados[elem].nomeCompleto, callback_data: db.categorias[called].indicados[elem].nomeResumido}
        })
        const result = geraLista(makeResult)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para as categorias', callback_data: 'volCategoria' }])
        ctx.telegram.sendMessage(ctx.chat.id, 'Categoria ' + db.categorias[called].nomeCompleto + ':', {reply_markup: {inline_keyboard: result}})
    }else if (typeCalled === 'ind'){
        const telegramID = ctx.update.callback_query.from.id
        const categoriaDoIndicado = Object.keys(db.categorias).filter((item) => {
            const filter = Object.keys(db.categorias[item].indicados).filter((ind) => ind === called)
            return filter.length === 0 ? false : true
        }).toString()
        await postVote(telegramID, categoriaDoIndicado, called)
        const info = await getVotes(telegramID)
        const nonVoted = []
        const voted = []
        ctx.answerCbQuery(called, {text : '✅ Pitaco Contabilizado', show_alert : true})
        Object.keys(info[0]).slice(3).map((elem, index) =>{
            if(info[0][elem] === "0"){
                nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }else{
                voted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }
            return 0
        })
        const result = geraLista(nonVoted)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
        ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: result}})
    }else if (called === 'volCategoria'){
        const telegramID = ctx.update.callback_query.from.id
        const info = await getVotes(telegramID)
        const nonVoted = []
        const voted = []
        Object.keys(info[0]).slice(3).map((elem, index) =>{
            if(info[0][elem] === "0"){
                nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }else{
                voted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }
            return 0
        })
        const result = geraLista(nonVoted)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
        ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: result}})
    }else if (called === 'voted'){
        const telegramID = ctx.update.callback_query.from.id
        const info = await getVotes(telegramID)
        const nonVoted = []
        const voted = []
        Object.keys(info[0]).slice(3).map((elem, index) =>{
            if(info[0][elem] === "0"){
                nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }else{
                voted.push([{text : String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: db.categorias[elem].nomeResumido}])
            }
            return 0
        })
        voted.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
        ctx.telegram.sendMessage(ctx.chat.id, "Já votados :", {reply_markup: {inline_keyboard: voted}})  
    }else if (called === 'menuInicial'){
        menuInicial = [[{text : "Votar", callback_data: "volCategoria"}, {text : "Já votados", callback_data: "voted"}],]
        ctx.telegram.sendMessage(ctx.chat.id, "Menu:", {reply_markup: {inline_keyboard: menuInicial}})
    }
    })

bot.use((ctx) => ctx.deleteMessage())

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