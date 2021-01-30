const geraLista = require('../geraLista');
const db = require('../../db.json');

const cat = (ctx) => {
    const called = ctx.update.callback_query.data.split(" ", 2)[0]
    const previousInfo = ctx.update.callback_query.data.split(" ").slice(1).join(" ")
    
    const makeResult = Object.keys(db.categorias[called].indicados).map((elem) =>{
        return {text : db.categorias[called].indicados[elem].nomeCompleto, callback_data: String(db.categorias[called].indicados[elem].nomeResumido + " " + previousInfo)}
    })
    const result = geraLista(makeResult)
    result.push([{ text: '⇦   ⇦   ⇦   Voltar para as categorias', callback_data: String('volCategoria ' + previousInfo)}])
    ctx.telegram.sendMessage(ctx.chat.id, 'Categoria ' + db.categorias[called].nomeCompleto + ':', {reply_markup: {inline_keyboard: result}})
}

module.exports = cat