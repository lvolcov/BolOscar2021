//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
require ('custom-env').env()
const table = require("table"); 
const { Telegraf } = require('telegraf')
const getVotes = require('./sqlResources/getVotes')
const newUser = require('./sqlResources/createNewUser')
const postVote = require('./sqlResources/postVote')
const changeName = require('./sqlResources/changeName')
const deleteVotes = require('./sqlResources/deleteVotes')
const menuInicialText = require('./textsMenus/menuInicial')
const changeNameMessage = require('./textsMenus/changeNameMessage')
const getLeagues = require('./sqlResources/getLeagues')
const createLeague = require('./sqlResources/createLeague')
const joinLeague = require('./sqlResources/joinLeague')
const db = require('./db.json');
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.hashtag (async (ctx) => {
    const newName = ctx.update.message.text.substring(1)
    const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
    ctx.deleteMessage()

    if (newName.length > 15){
        ctx.telegram.sendMessage(ctx.chat.id, '❌ Nome muito longo ! ❌')
            .then((result) => { setTimeout(() => {
                ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
            }, 3000)})
            .catch(err => console.log(err))
    }else if (format.test(newName)) {
        ctx.telegram.sendMessage(ctx.chat.id, '❌ Nome contendo caracteres especiais ❌')
            .then((result) => { setTimeout(() => {
                ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
            }, 3000)})
            .catch(err => console.log(err))
    }else{
        ctx.telegram.sendMessage(ctx.chat.id, `Novo nome: ${newName} \n\nSalvar alteração?`, 
            {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('salvaNome '+ newName)}, { text: 'Não', callback_data: 'naoSalvaNome'}]]}})
    }

})

bot.start(async (ctx) => {
    const telegramID = ctx.update.message.from.id
    let info = await getVotes(telegramID)
    ctx.deleteMessage()
    menuInicial = []
    const voted = []
    if(info.length === 0) {
        nome = String(ctx.update.message.from.first_name === undefined ? telegramID : ctx.update.message.from.first_name) +" "+ String(ctx.update.message.from.last_name === undefined ? '' : ctx.update.message.from.last_name)
        await newUser(telegramID, nome, nome);
    }else{
        nome = info[0].Nome
        Object.keys(info[0]).slice(4).map((elem, index) =>{
            info[0][elem] !== "0" ? voted.push([{text : String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " voltaMenuJaVotados")}]) : ""
            return 0
        })
    }
    voted.length === 0 ? menuInicial.push([{text : "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria"}]) : menuInicial.push([{text : "Continuar Palpites", callback_data: "volCategoria"}, {text : "Revisar Palpites", callback_data: "voted"}])
    menuInicial.push([{text : "Ligas", callback_data: "leagues"}, {text : "Mais info", callback_data: "moreInfo"}])
    await ctx.reply(menuInicialText(nome.split(" ")[0]))
    await ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", {reply_markup: {inline_keyboard: menuInicial}})
})

bot.on('callback_query', async (ctx) => {
    ctx.deleteMessage()
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ", 2)[1]
    const typeCalled = called.substring(0,3)
    const telegramID = ctx.update.callback_query.from.id

    if (typeCalled === 'cat') { //Recebe a categoria e faz a lista dos indicados dela
        const makeResult = Object.keys(db.categorias[called].indicados).map((elem) =>{
            return {text : db.categorias[called].indicados[elem].nomeCompleto, callback_data: String(db.categorias[called].indicados[elem].nomeResumido + " " + previousInfo)}
        })
        const result = geraLista(makeResult)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para as categorias', callback_data: String('volCategoria ' + previousInfo)}])
        ctx.telegram.sendMessage(ctx.chat.id, 'Categoria ' + db.categorias[called].nomeCompleto + ':', {reply_markup: {inline_keyboard: result}})
    }else if (typeCalled === 'ind'){ //É chamado após um indicado ser pressionado, contabiliza o voto, avisa q contabilizou e mostra o menu das categorias novamente 
        const categoriaDoIndicado = Object.keys(db.categorias).filter((item) => {
            const filter = Object.keys(db.categorias[item].indicados).filter((ind) => ind === called)
            return filter.length === 0 ? false : true
        }).toString()
        await postVote(telegramID, categoriaDoIndicado, called)
        const info = await getVotes(telegramID)
        const nonVoted = []
        const voted = []
        ctx.answerCbQuery(called, {text : '✅ Pitaco Contabilizado', show_alert : true})
        Object.keys(info[0]).slice(4).map((elem, index) =>{
            if(info[0][elem] === "0"){
                nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido})
            }else{
                voted.push([{text : String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " " + previousInfo)}])
            }
            return 0
        })
        const result = previousInfo === "voltaMenuJaVotados" ? voted : geraLista(nonVoted)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial'}])
        ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", {reply_markup: {inline_keyboard: result}})
    }else if (called === 'volCategoria' && previousInfo !== "voltaMenuJaVotados"){
        const info = await getVotes(telegramID)
        const nonVoted = []
        Object.keys(info[0]).slice(4).map((elem, index) =>{
            info[0][elem] === "0" ? nonVoted.push({text : db.categorias[elem].nomeMenu, callback_data: db.categorias[elem].nomeResumido}) : ""
            return 0
        })
        const result = geraLista(nonVoted)
        result.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
        ctx.telegram.sendMessage(ctx.chat.id, "Selecione a categoria:", {reply_markup: {inline_keyboard: result}})
    }else if (called === 'voted' || previousInfo === "voltaMenuJaVotados"){
        const info = await getVotes(telegramID)
        const voted = []
        Object.keys(info[0]).slice(4).map((elem, index) =>{
            info[0][elem] !== "0" ? voted.push([{text : String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " voltaMenuJaVotados")}]) : ""
            return 0
        })
        voted.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }])
        ctx.telegram.sendMessage(ctx.chat.id, "Já votados :", {reply_markup: {inline_keyboard: voted}})  
    }else if (called === 'menuInicial'){
        let info = await getVotes(telegramID)
        menuInicial = []
        const voted = []
    Object.keys(info[0]).slice(4).map((elem, index) =>{
        info[0][elem] !== "0" ? voted.push([{text : String(db.categorias[elem].nomeMenu + ": " + db.categorias[elem].indicados[info[0][elem]].nomeCompleto), callback_data: String(db.categorias[elem].nomeResumido + " voltaMenuJaVotados")}]) : ""
        return 0
    })
    voted.length === 0 ? menuInicial.push([{text : "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria"}]) : menuInicial.push([{text : "Continuar Palpites", callback_data: "volCategoria"}, {text : "Revisar Palpites", callback_data: "voted"}])
    menuInicial.push([{text : "Ligas", callback_data: "leagues"}, {text : "Mais info", callback_data: "moreInfo"}])
    ctx.telegram.sendMessage(ctx.chat.id, "Escolha uma das opções a seguir:", {reply_markup: {inline_keyboard: menuInicial}})
    }else if (called === 'salvaNome'){
        newName = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
        await changeName(telegramID, newName)
        ctx.answerCbQuery(called, {text : `✅ Nome alterado !`, show_alert : true})
    }else if (called === 'naoSalvaNome'){
        ctx.answerCbQuery(called, {text : '❌ Nome não salvo', show_alert : true})
    }else if (called === 'moreInfo'){
        moreInfoMenu = [[{text : "Pesos das Categorias", callback_data: "pointsCat"}, {text : "Meus Palpites", callback_data: "votesList"}],
        [{text : "Alterar nome", callback_data: "changeName"}, {text : "Resetar Palpites", callback_data: "resetVotes"}],
        [{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }]]
        ctx.telegram.sendMessage(ctx.chat.id, "Mais Informações:", {reply_markup: {inline_keyboard: moreInfoMenu}})
    }else if (called === 'votesList'){
        const info = await getVotes(telegramID)
        const voted = [['CATEGORIA', 'PALPITE']]
        Object.keys(info[0]).slice(4).map((elem, index) =>{
            info[0][elem] !== "0" ? voted.push([String(db.categorias[elem].nomeMenu), String(db.categorias[elem].indicados[info[0][elem]].nomeCompleto)]) : ""
            return 0
        })
        if (voted.length > 1){
            const config = {border: table.getBorderCharacters('ramac'), columns: {0: {width: 12,wrapWord: true},1: {width: 12,wrapWord: true}}}
            const lista = String("<pre>" + table.table(voted, config) + "</pre>"); 
            ctx.telegram.sendMessage(ctx.chat.id, String("Seus Palpites:\n\n"+lista), {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
        } else {
            ctx.telegram.sendMessage(ctx.chat.id, 'Você ainda não deu nenhum palpite.', {reply_markup: {inline_keyboard: [[{text : "🎥   Iniciar os Palpites   🎥", callback_data: "volCategoria"}],[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
        }
    }else if (called === 'pointsCat'){
        const info = [['CATEGORIA', 'PONTUAÇÃO']]
        Object.keys(db.categorias).map((categoria) =>{
            info.push([db.categorias[categoria].nomeCompleto, db.categorias[categoria].peso])
        })
        const config = {border: table.getBorderCharacters('ramac'), columns: {0: {width: 12,wrapWord: true},1: {width: 12,wrapWord: true, alignment: 'center', width: 10}}}
        const lista = String("<pre>" + table.table(info, config) + "</pre>"); 
        ctx.telegram.sendMessage(ctx.chat.id, String("Pontuação de cada categoria:\n\n"+lista), {parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
    }else if (called === 'resetVotes'){
        ctx.telegram.sendMessage(ctx.chat.id, "Tem certeza que deseja resetar seus palpites?", 
            {reply_markup: {inline_keyboard: [[{text : "Sim", callback_data: "resetVotesYes"}, {text : "Não", callback_data: "moreInfo"}]]}})
    }else if (called === 'resetVotesYes'){
        let info = await getVotes(telegramID)
        nome = info[0].Nome
        nomeOriginal = info[0].NomeOriginal
        await deleteVotes(telegramID)
        await newUser(telegramID, nomeOriginal, nome)
        ctx.answerCbQuery(called, {text : `✅ Palpites Resetados !`, show_alert : true})
        moreInfoMenu = [[{text : "Pesos das Categorias", callback_data: "pointsCat"}, {text : "Meus Palpites", callback_data: "votesList"}],
        [{text : "Alterar nome", callback_data: "changeName"}, {text : "Resetar Palpites", callback_data: "resetVotes"}],
        [{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial' }]]
        ctx.telegram.sendMessage(ctx.chat.id, "Mais Informações:", {reply_markup: {inline_keyboard: moreInfoMenu}})
    }else if (called === 'changeName'){
        let info = await getVotes(telegramID)
        nome = info[0].Nome
        ctx.telegram.sendMessage(ctx.chat.id, changeNameMessage(nome), {parse_mode: 'HTML', 
            reply_markup: {inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
    }else if (called === 'leagues'){ //FALTA FAZER BOTOES ALTERNATIVOS CASO USUARIO JA TENHA CRIADO UMA LIGA E CASO JA ESTEJA EM UMA LIGA
        const info = await getLeagues(telegramID)
        const infoMenu = []
        if (info[0] === undefined) {
            infoMenu.push([{ text: 'Criar uma Liga', callback_data: 'createLeague'}, { text: 'Entrar em uma liga', callback_data: 'joinLeague'}])
        }else if (info === telegramID) {
        }
        infoMenu.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial'  }])
        ctx.telegram.sendMessage(ctx.chat.id, "Já votados :", {reply_markup: {inline_keyboard: infoMenu}})
    }else if (called === 'createLeague'){

    }else if (called === 'joinLeague'){

    }

})

bot.use((ctx) => ctx.deleteMessage())

bot.launch()

function geraLista (items) {
    const result = []
    let i = 0
    items.sort((a,b) => (a.text.length > b.text.length) ? 1 : ((b.text.length > a.text.length) ? -1 : 0));
    while (i < items.length){
        if (items[i+1] === undefined){
            result.push([items[i]])
        } else if (items[i].text.length > 20 || items[i+1].text.length > 20){
            result.push([items[i]])
            result.push([items[i+1]])
        } else {
            result.push([items[i], items[i+1]])
        }
        i += 2
    }
    return result
}