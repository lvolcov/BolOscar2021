const table = require("table"); 
const db = require('../../db.json');

const pointsCat = (ctx) => {
    const info = [['CATEGORIA', 'PONTUAÇÃO']]
    
    Object.keys(db.categorias).map((categoria) =>{
        info.push([db.categorias[categoria].nomeCompleto, db.categorias[categoria].peso])
    })

    const config = {
        border: table.getBorderCharacters('ramac'), 
        columns: {
            0: {width: 12,wrapWord: true},
            1: {width: 12,wrapWord: true, alignment: 'center', width: 10}
        }
    }

    const lista = String("<pre>" + table.table(info, config) + "</pre>"); 
    ctx.telegram.sendMessage(ctx.chat.id, String("Pontuação de cada categoria:\n\n"+lista), {parse_mode: 'HTML', 
        reply_markup: {inline_keyboard: [[{ text: '⇦   ⇦   ⇦   Voltar para mais Informações', callback_data: 'moreInfo' }]]}})
}

module.exports = pointsCat