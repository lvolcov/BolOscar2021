const mongoose = require("mongoose");

const palpiteiroSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    telegramId: String,
    name: String,

})

module.exports = mongoose.model('Palpiteiro', palpiteiroSchema)