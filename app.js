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
const getLeaguesDetails = require('./sqlResources/getLeaguesDetails')
const getLeaguesList = require('./sqlResources/getLeaguesList')
const createLeague = require('./sqlResources/createLeague')
const getNamesExistingLeagues = require('./sqlResources/getNamesExistingLeagues')
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

    previousInfo === "deleteLastMessage" ? ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id -1) : ""
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
    }else if (called === 'moreInfo' || called === 'salvaNome' || called === 'naoSalvaNome'){
        called === 'naoSalvaNome' ? ctx.answerCbQuery(called, {text : '❌ Nome não salvo', show_alert : true}) : ""
        if (called === 'salvaNome'){
            newName = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
            await changeName(telegramID, newName)
            ctx.answerCbQuery(called, {text : `✅ Nome alterado !`, show_alert : true})
        }
        const moreInfoMenu = [[{text : "Pesos das Categorias", callback_data: "pointsCat"}, {text : "Meus Palpites", callback_data: "votesList"}],
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
        await ctx.telegram.sendMessage(ctx.chat.id, "Qual o seu novo nome para o Ranking?", {reply_markup: {force_reply: true, }})
        await ctx.telegram.sendMessage(ctx.chat.id, changeNameMessage(nome),{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "moreInfo deleteLastMessage"}]]}})
    }else if (called === 'leagues' || called === 'naoCriaLiga' || called === 'criaLiga' || called === 'joinLeagueYes'){ 
        called === 'naoCriaLiga' ? ctx.answerCbQuery(called, {text : '❌ Liga não criada', show_alert : true}) : ""
        if (called === 'criaLiga') {
            await createLeague(previousInfo, telegramID)
            ctx.answerCbQuery(called, {text : "✅ Liga criada !", show_alert : true})
        }
        if (called === 'joinLeagueYes') { //FAZER AINDA
            leagueJoined = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
            await createLeague(previousInfo, telegramID)
            ctx.answerCbQuery(called, {text : `✅ Você agora está participando da Liga ${leagueJoined}!`, show_alert : true})
        }
        const info = await getLeaguesList(telegramID)
        const infoMenu = []
        if (info[0] === undefined) {
            infoMenu.push([{ text: 'Criar uma Liga', callback_data: 'createLeagueGetName'}, { text: 'Entrar em uma liga', callback_data: 'joinLeague'}])
        }else{
            let hasOwnLeague = false
            info.map((elem) =>  elem.TelegramIDDono === elem.TelegramIDParticipante ? hasOwnLeague = true : 0)
            if (hasOwnLeague) {
                infoMenu.push([{ text: 'Gerenciar sua Liga', callback_data: 'manageLeague'}, { text: 'Ver suas Ligas', callback_data: 'checkLeagues'}])  
            } else {
                infoMenu.push([{ text: 'Criar uma Liga', callback_data: 'createLeagueGetName'}, { text: 'Ver suas Ligas', callback_data: 'checkLeagues'}])
            }
            infoMenu.push([{text: 'Entrar em uma Liga', callback_data: 'joinLeague'}, {text: 'Sair de uma Liga', callback_data: 'leftLeague'}])
        }
        infoMenu.push([{ text: '⇦   ⇦   ⇦   Voltar para o menu inicial', callback_data: 'menuInicial'  }])
        ctx.telegram.sendMessage(ctx.chat.id, "Ligas do Bol'Oscar:", {reply_markup: {inline_keyboard: infoMenu}})
    }else if (called === 'createLeagueGetName'){
        await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o nome da sua liga?", {reply_markup: {force_reply: true}})
        await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE CRIAR LIGA",{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
    }else if (called === 'joinLeague'){
        await ctx.telegram.sendMessage(ctx.chat.id, "Qual o nome da Liga que você deseja participar?", {reply_markup: {force_reply: true}})
        await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE INGRESSAR NA LIGA E EXPLICANDO QUE TEM Q ESCREVER O NOME EXATO",{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
    }else if (called === 'leftLeague'){
    }else if (called === 'manageLeague'){
    }else if (called === 'checkLeagues'){
    }

})

bot.use( async (ctx) => {
    const replyObject = ctx.update.message.reply_to_message
    const messageTextUser = ctx.update.message.text
    const telegramID = ctx.update.message.from.id
    if (replyObject === undefined) {
        ctx.deleteMessage()
    }else if (replyObject.from.is_bot){
        ctx.deleteMessage()
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id)
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id+1)
        let validAnswer = validateAnswer(messageTextUser)
        if (replyObject.text === "Qual o seu novo nome para o Ranking?") {
            if (validAnswer === true){
                ctx.telegram.sendMessage(ctx.chat.id, `Novo nome: ${messageTextUser} \n\nSalvar alteração?`, 
                    {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('salvaNome '+ messageTextUser)}, { text: 'Não', callback_data: 'naoSalvaNome'}]]}})
            }else{
                let info = await getVotes(telegramID)
                ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
                    .then((result) => { setTimeout(() => {
                        ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            nome = info[0].Nome
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual o seu novo nome para o Ranking?", {reply_markup: {force_reply: true, }})
                            await ctx.telegram.sendMessage(ctx.chat.id, changeNameMessage(nome),{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "moreInfo deleteLastMessage"}]]}})
                        })
                        .catch(err => console.log(err))
                    }, 3000)})
                    .catch(err => console.log(err))
            }
        }else if (replyObject.text === "Qual será o nome da sua liga?") {
            if (validAnswer === true){
                const validLeagues = await getNamesExistingLeagues()
                const upperValidLeagues = validLeagues.map((elem) => elem.toUpperCase())
                upperValidLeagues.indexOf(messageTextUser.toUpperCase()) !== -1 ? validAnswer = `❌ O nome ${messageTextUser} já está sendo usado! ❌` : ""
            }
            if (validAnswer === true){
                ctx.telegram.sendMessage(ctx.chat.id, `Você está criando uma liga com o nome: ${messageTextUser} \n\nDeseja salvar?`, 
                    {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('criaLiga '+ messageTextUser)}, { text: 'Não', callback_data: 'naoCriaLiga'}]]}})
            }else{
                let info = await getVotes(telegramID)
                ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
                    .then((result) => { setTimeout(() => {
                        ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual será o nome da sua liga?", {reply_markup: {force_reply: true, }})
                            await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE CRIAR LIGA",{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
                        })
                        .catch(err => console.log(err))
                    }, 3000)})
                    .catch(err => console.log(err))
            }
        }else if (replyObject.text === "Qual o nome da Liga que você deseja participar?") {
            let leagueJoined = ''
            if (validAnswer === true){
                const validLeagues = await getNamesExistingLeagues()
                const upperValidLeagues = validLeagues.map((elem) => elem.toUpperCase())
                upperValidLeagues.indexOf(messageTextUser.toUpperCase()) === -1 ? validAnswer = "❌ Liga não encontrada! ❌" : leagueJoined = validLeagues[upperValidLeagues.indexOf(messageTextUser.toUpperCase())]
                const listLeaguesUser = await getLeaguesList(telegramID)
                listLeaguesUser.indexOf(leagueJoined) !== -1 ? validAnswer = "❌ Você já está participando dessa liga! ❌" : ""
            }
            if (validAnswer === true){
                ctx.telegram.sendMessage(ctx.chat.id, `Confirmar a sua entrada na Liga ${leagueJoined}?`, 
                    {reply_markup: {inline_keyboard: [[{ text: 'Sim', callback_data: String('joinLeagueYes '+ leagueJoined)}, { text: 'Não', callback_data: 'leagues'}]]}})
            }else{
                let info = await getVotes(telegramID)
                ctx.telegram.sendMessage(ctx.chat.id, validAnswer)
                    .then((result) => { setTimeout(() => {
                        ctx.telegram.deleteMessage(ctx.chat.id, result.message_id)
                        .then(async (result) => {
                            nome = info[0].Nome
                            await ctx.telegram.sendMessage(ctx.chat.id, "Qual o nome da Liga que você deseja participar?", {reply_markup: {force_reply: true}})
                            await ctx.telegram.sendMessage(ctx.chat.id, "MENSAGEM FALANDO SOBRE INGRESSAR NA LIGA E EXPLICANDO QUE TEM Q ESCREVER O NOME EXATO",{parse_mode: 'HTML', reply_markup: {inline_keyboard: [[{text : "Voltar", callback_data: "leagues deleteLastMessage"}]]}})
                        })
                        .catch(err => console.log(err))
                    }, 3000)})
                    .catch(err => console.log(err))
            }
        }
    }
})

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

function validateAnswer (answer) {
    const format = /[!@#$%^&*()+\=\[\]{};':"\\|,.<>\/?]+/;
    if (answer.length > 16){
        return '❌ Nome muito longo ! ❌'
    }else if (answer.length < 6) {
        return '❌ Nome muito curto ! ❌'
    }else if (format.test(answer)) {
        return '❌ Nome contendo caracteres especiais ❌'
    }else{
        return true
    }
}