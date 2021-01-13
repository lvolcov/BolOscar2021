//connect
const mongoose = require('mongoose')
const Palpiteiro = require('./models/palpiteiro')
const uri = 'mongodb+srv://lvolcov:'+ process.env.MONGO_ATLAS_PW +'@boloscar2021.dpgf7.mongodb.net/BolOscar2021?retryWrites=true&w=majority'

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('MongoDB Connected…')
  })
  .catch(err => console.log(err))

//create new reg FUNCIONANDO
const palpiteiro = new Palpiteiro({
    _id: new mongoose.Types.ObjectId(),
    telegramId: '1256',
    name: 'sera q foi lalala'
})
// palpiteiro
//   .save()
//   .then(result =>{
//     console.log(result)
//   })
//   .catch(err=>{
//     console.log(err)
//   })

// find reg FUNCIONANDO
const find = Palpiteiro
  .find({telegramId: '123456'})
  .exec()
  .then(result =>{
    console.log(result)
    change(result._id)
  })
  .catch(err=>{
    console.log(err)
  })

//tentativa de update nao funcionando
function change(id){
  Palpiteiro
    .updateOne({_id: id}, {$set: {name: 'novo nome'}})
}