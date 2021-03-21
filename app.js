//http://49.213.81.43/static/tool/thuocbot/node_modules/telegraf/docs/#/
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.BOT_TOKEN)
const answers = require('./functions/answers')

bot.start(async (ctx) => {
    let i = ctx.update.message.message_id < 100 ? 0 : ctx.update.message.message_id - 100
    while (i < ctx.update.message.message_id) {
        ctx.telegram.deleteMessage(ctx.update.message.chat.id, i)
            .then(i++)
            .catch((err) => {
                const error = err
            });
    }
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
    ctx.deleteMessage()

    console.log(ctx.update.message.message_id)
    const possibleReplies = {
        "Qual o seu novo nome para o Ranking?": 'newRankingName',
        "Qual será o nome da sua liga?": 'createLeagueName',
        "Qual o nome da Liga que você deseja participar?": 'joinLeagueName',
        "Qual será o novo nome da sua liga?": 'changeLeagueName',
        "Qual liga você deseja sair?": 'leftLeague'
    }
    const replyObject = ctx.update.message.reply_to_message
    console.log(replyObject.message_id)
    if (replyObject === undefined) {
        ''
    } else if (replyObject.from.is_bot && Object.keys(possibleReplies).indexOf(replyObject.text) !== -1) {
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id)
        ctx.telegram.deleteMessage(replyObject.chat.id, replyObject.message_id + 1)
        answers[possibleReplies[replyObject.text]](ctx)
    }
})

bot.launch()
