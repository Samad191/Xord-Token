const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://Abdul_Samad:<password>@cluster0.2lfpqmj.mongodb.net/?retryWrites=true&w=majority');

const Schema = mongoose.Schema;
const lastBlockSchema = new Schema ({
  lastBlock: {
    type: String,
    required: true,
  }
})

const lastBlockData = mongoose.model('lastBlock', lastBlockSchema)

const test = () => {
  lastBlock.find()
    .then(res => console.log('res', res));
}



module.exports = {
    test
}

