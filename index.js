require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())
morgan.token('body', (request) => {
	const body = JSON.stringify(request.body)
	if (body !== "{}") {
		return body
	}
})

app.use(morgan(':method :url :status: :res[content-leght] - :response-time ms :body'))

app.get('/info', (request, response) => {
	Contact.countDocuments({})
	.then(count => {
		response.send(`<p>Phonebook has info for ${count} people <br> ${new Date()}</p>`)
	})
	
})

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contact =>{
		response.json(contact)
	})
})

app.get('/api/persons/:id', (request, response, next) => {
	Contact.findById(request.params.id).then(contact => {
		response.json(contact)
	})
	.catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
	Contact.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
	const body = request.body
	
	if (!body.name) { 
		return response.status(400).json({
			error: 'name missing'
		})
	}
	
	if (!body.number) {
	 	return response.status(400).json({
	 		error: 'number missing'
	 	})
	}
	
	const contact = new Contact({
		name: body.name,
		number: body.number,
	})
	
	contact.save().then(savedContact => {
		response.json(savedContact)
	})
	.catch(error => next(error))

})

app.put('/api/persons/:id', (request, response, next) => {
	const body = request.body
	const contact = {
		number: body.number, 
	}

	Contact.findByIdAndUpdate(request.params.id, contact, { new: true})
		.then(updatedContact => {
			response.json(updatedContact)
		})
		.catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'Endpoind invalid' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
	console.error(error.message)

	if (error.name === 'CastError') {
		return response.status(400).send({ error: 'id in wrong format' })
	} else if (error.name === 'ValidationError') {
		return response.status(400).json({ error: error.message })
	}
	next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})