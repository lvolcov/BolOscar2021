const sqlFunctions = require('../sqlResources/sqlFunctions')

const leagues = (async (ctx) => {
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
    const telegramID = ctx.update.callback_query.from.id

    switch (called) {
        case 'naoCriaLiga':
            ctx.answerCbQuery(called, {text : '❌ Liga não criada', show_alert : true});
            break;
        case 'criaLiga':
            await sqlFunctions.createLeague(previousInfo, telegramID);
            ctx.answerCbQuery(called, {text : "✅ Liga criada !", show_alert : true});
            break;
        case 'joinLeagueYes':
            await sqlFunctions.joinLeague(previousInfo, telegramID);
            ctx.answerCbQuery(called, {text : `✅ Você agora está participando da Liga ${previousInfo}!`, show_alert : true});
            break;
    }

    const info = await sqlFunctions.getLeaguesDetails(telegramID)
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
})

module.exports = leagues