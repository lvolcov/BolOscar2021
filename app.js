//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
require('custom-env').env()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const answers = require('./functions/answers')
const sharp = require('sharp');
var fs = require('fs');
const sqlFunctions = require('./functions/sqlResources/sqlFunctions')
const db = require('./db.json');


bot.start(async (ctx) => {
    answers.start(ctx)
})

bot.on('callback_query', async (ctx) => {
    ctx.deleteMessage()
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1).join(" ")

    previousInfo === "deleteLastMessage" ? ctx.telegram.deleteMessage(ctx.update.callback_query.message.chat.id, ctx.update.callback_query.message.message_id - 1) : ""

    const callbackInfo = (() => {
        const called = ctx.update.callback_query.data.split(" ", 2)
        if (called[0].substring(0, 3) === 'cat' || called[0].substring(0, 3) === 'ind') {
            return called[0].substring(0, 3)
        } else if (called[1] === 'voltaMenuJaVotados') {
            return 'voted'
        } else {
            return called[0]
        }
    })

    answers[callbackInfo()](ctx)

})

bot.use(async (ctx) => {


    let returnSvg = fs.readFileSync('./shareResources/choicesImg_light.svg').toString()
    const telegramID = ctx.update.message.from.id
    const info = await sqlFunctions.getVotes(telegramID)

    let pontos = 0
    Object.keys(info[0]).slice(4).map((elem, index) => {
        const rePoints = new RegExp(String('z' + index + 'abc'), "g");
        const reWord = new RegExp(String(elem + 'blank'), "g");
        if (info[0][elem] !== "0") {
            if (db.categorias[elem].vencedor === db.categorias[elem].indicados[info[0][elem]].nomeResumido) {
                returnSvg = returnSvg.replace(rePoints, String(db.categorias[elem].peso))
                pontos += db.categorias[elem].peso
            } else {
                returnSvg = returnSvg.replace(rePoints, '❌')
            }
            const result = db.categorias[elem].indicados[info[0][elem]].nomeCompleto.length > 20 ? String(db.categorias[elem].indicados[info[0][elem]].nomeCompleto.substring(0, 18) + '...') : db.categorias[elem].indicados[info[0][elem]].nomeCompleto
            returnSvg = returnSvg.replace(reWord, result)

        } else {
            returnSvg = returnSvg.replace(reWord, 'Ainda não votado')
            returnSvg = returnSvg.replace(rePoints, '❌')
        }
        return 0
    })

    returnSvg = returnSvg.replace('pontosTotal', pontos)
    let choicesImg64 = fs.readFileSync('./shareResources/choicesImg64.txt').toString()
    returnSvg = returnSvg.replace('COLAchoicesImg64', choicesImg64)

    let checkCertoErradoImg64 = fs.readFileSync('./shareResources/checkCertoErradoImg64.txt').toString()
    returnSvg = returnSvg.replace('COLAcheckCertoErradoImg64', checkCertoErradoImg64)

    await sharp(Buffer.from(returnSvg), { density: 200 })
        .jpeg()
        .toBuffer()
        .then(async photo => {
            await ctx.telegram.sendPhoto(ctx.chat.id, { source: Buffer.from(photo) })
        })




    ctx.deleteMessage()
    const possibleReplies = {
        "Qual o seu novo nome para o Ranking?": 'newRankingName',
        "Qual será o nome da sua liga?": 'createLeagueName',
        "Qual o nome da Liga que você deseja participar?": 'joinLeagueName',
        "Qual será o novo nome da sua liga?": 'changeLeagueName',
        "Qual liga você deseja sair?": 'leftLeague'
    }
    const replyObject = ctx.update.message.reply_to_message
    if (replyObject === undefined) {
        ''
    } else if (replyObject.from.is_bot && Object.keys(possibleReplies).indexOf(replyObject.text) !== -1) {
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id)
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id + 1)
        answers[possibleReplies[replyObject.text]](ctx)
    }
})

bot.launch()
