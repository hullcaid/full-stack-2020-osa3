const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
.then(response => {
	console.log('Database connection established')
})
.catch((error) => {
	console.log('Error establishing database connection: ', error.message)
})

const contactSchema = new mongoose.Schema({
	name: {
		type: String,
		unique: true
	},
	number: String,
})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id,
		delete returnedObject.__v
	}
})

contactSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Contact', contactSchema)