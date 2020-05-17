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
	response.send(`<p>Phonebook has info for ${persons.length} people <br> ${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
	Contact.find({}).then(contact =>{
		response.json(contact)
	})
})

app.get('/api/persons/:id', (request, response) => {
	Contact.findById(request.params.id).then(contact => {
		response.json(contact)
	})
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

const generateId = () => {
	const id = Math.floor(Math.random() * 1000000000)
	return id
}

app.post('/api/persons', (request, response) => {
	const body = request.body

	if (persons.find(person => person.name === body.name)) {
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

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
	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}
	persons = persons.concat(person)
	response.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})