const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": 1
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": 2
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": 3
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": 4
    }
  ]

app.get('/info', (request, response) => {
	response.send(`<p>Phonebook has info for ${persons.length} people <br> ${new Date()}</p>`)
})

app.get('/api/persons', (request, response) => {
	response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	const person = persons.find(person => person.id === id)
	if (person) {
		response.json(person)
	} else {
		response.status(404).end()
	}
})

app.delete('/api/persons/:id', (request, response) => {
	const id = Number(request.params.id)
	persons = persons.filter(person => person.id !== id)
	response.status(204).end()
})

const generateId = () => {
	const id = Math.floor(Math.random() * 1000000000)
	console.log(id)
	return id
}

app.post('/api/persons', (request, response) => {
	console.log("POST request received")
	const body = request.body

	if (persons.find(person => person.name === body.name)) {
		console.log("non-unigue name")
		return response.status(400).json({
			error: 'name must be unique'
		})
	}

	if (!body.name) {
		console.log("name missing")
		return response.status(400).json({
			error: 'name missing'
		})
	}
	
	if (!body.number) {
		console.log("number missing")
		return response.status(400).json({
			error: 'number missing'
		})
	}

	console.log(body)
	const person = {
		name: body.name,
		number: body.number,
		id: generateId(),
	}
	console.log(person)
	persons = persons.concat(person)
	response.json(person)
})


const PORT = 3001
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})