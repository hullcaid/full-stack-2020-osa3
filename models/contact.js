const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true})
.then(response => {
	console.log('Database connection established')
})
.catch((error) => {
	console.log('Error establishing database connection: ', error.message)
})

const contactSchema = new mongoose.Schema({
	name: String,
	number: String,
})

contactSchema.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id,
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)