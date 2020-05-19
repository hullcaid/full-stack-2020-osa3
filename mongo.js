const mongoose = require('mongoose')

if (!(process.argv.length === 3 || process.argv.length === 5)) {
  console.log('To read saved contacts, provide a password. \nTo add a contact, provide password, contact name(in quotes) and contact number')
  process.exit(1)
}

const password = process.argv[2]
const newName = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://numberuser:${password}@cluster0-zmvlg.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const contactSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Contact = mongoose.model('Contact', contactSchema)

if (newName === undefined) {
  Contact.find({}).then(result => {
    result.forEach(contact => {
      console.log(contact)
    })
    mongoose.connection.close()
  })
} else {
  contact = new Contact({
    name: newName,
    number: newNumber,
  })

  contact.save().then(result => {
    console.log('Contact saved: '+ newName)
    mongoose.connection.close()
  })
}
