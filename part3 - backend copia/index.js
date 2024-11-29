const http = require('http')
const express = require('express')
const app = express()
require('dotenv').config()

const morgan = require('morgan')
const cors = require('cors')

app.use(express.static('dist'));
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());


// mongoose - obsoleto perché trasferito in person.js
// const mongoose = require('mongoose')

// const password = 

// const url2 =
//   `mongodb+srv://xroxas28:${password}@cluster0.26mboas.mongodb.net/phoneBookApp?retryWrites=true&w=majority&appName=Cluster0`

// mongoose.set('strictQuery',false)
// mongoose.connect(url2)

// const personSchema = new mongoose.Schema({
//   name: String,
//   number: String,
//   id: Number,
// })

// personSchema.set('toJSON', {
//   transform: (document, returnedObject) => {
//     returnedObject.id = returnedObject._id.toString()
//     delete returnedObject._id
//     delete returnedObject.__v
//   }
// })

// const Person = mongoose.model('Person', personSchema)

const Person = require('./models/person')


// end of mongoose


// Custom token to log request body
morgan.token('body', (req) => JSON.stringify(req.body));

// Using morgan with the custom token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ]

// app.get('/', (request, response) => { // ROOT GET HANDLER
//     response.send('<h1>Hello World!</h1>')
//   })
  
  app.get('/api/persons', (request, response) => { // PERSONS GET HANDLER VALIDO CON MONGOOSE
    Person.find({}).then(persons => {    
      response.json(persons)
    })
  })

  // app.get('/api/persons/:id', (request, response) => { // PERSON BY ID GET HANDLER VECCHIO SENZA MONGOOSE
  //   const id = Number(request.params.id);
  //   const person = Person.find(person => person.id === id);

  //   if (!person){
  //     response.status(404).end()
  //   }
  //   response.json(person);
  // });

  // app.get('/info', (request,response) => { // INFO GET HANDLER VECCHIO SENZA MONGOOSE
  //   const npeople = Number(Person.length)
  //   const currentDate = new Date()
  //   response.send(`
  //     <p>Phone has info for ${npeople} people.</p>
  //     <p>${currentDate}</p>`
  //   )
  // })
  
  // app.delete('/api/persons/:id', (request, response) => { //DELETE HANDLER VECCHIO SENZA MONGOOSE
  //   const id = Number(request.params.id)
  //   Person = Person.filter(person => person.id !== id)
  //   response.status(204).end()
  // })
  // const  generateId = () => {
  //   const maxId = Person.length > 0 
  //     ? Math.max(...Person.map(p => p.id ))
  //     : 0
  
  //     return maxId +1 
  // }  

  // app.post('/api/persons', (request, response) => { // POST HANDLER VECCHIO SENZA MONGOOSE
  //   const body = request.body

  //   if(body.name==="" || body.number==="") {
  //      response.status(400).json({
  //       error: "name or number missing"
  //     })
  //   }else {


  //   const found = persons.some(p => p.name === body.name)

  //   if(found) {
  //     response.status(409).json({
  //       error: 'name must be unique'
  //     })
  //   }else {
    
  //   body.id = generateId()
  //   persons = persons.concat(body)
  //   response.status(201).send(persons)
  //   }
  // }
  // })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id;
    Person.findById(id).then(person => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    }).catch(error => next(error));
  });

  app.get('/info', (request, response) => {
    Person.countDocuments({}).then(count => {
      const currentDate = new Date()
      response.send(`
        <p>Phone has info for ${count} people.</p>
        <p>${currentDate}</p>`
      )
    });
  })
  
  app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end();
      } else {
        response.status(404).send({ error: 'not found' });
      }
    })
    .catch(error => {
      console.error(`Error during DELETE /api/persons/:id with id ${id}:`, error);
      next(error);
    })
});

    
  
  app.post('/api/persons', (request, response) => { // POST HANDLER
    const body = request.body
  
    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "name or number missing"
      })
    }
  
    Person.findOne({ name: body.name }).then(existingPerson => {
      if (existingPerson) {
        return response.status(409).json({
          error: 'name must be unique'
        })
      } else {
        const person = new Person({
          name: body.name,
          number: body.number
        })
  
        person.save().then(savedPerson => {
          response.status(201).json(savedPerson)
        }).catch(error => {
          console.error(error);
          response.status(500).send({ error: 'failed to save person' });
        })
      }
    }).catch(error => next(error))
  })
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' });
  }
  
  
  
  const errorHandler = (error, request, response, next) => {
    console.error('ErrorHandler middleware called:', error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
    if (error.name === 'MongoError' && error.code === 11000) {
      return response.status(409).json({ error: 'duplicate key error' });
    }
    if (error.name === 'SyntaxError') {
      return response.status(400).send({ error: 'bad request' });
    }
    if (error.name === 'TypeError') {
      return response.status(500).send({ error: 'internal server error' });
    }
    if (error.name === 'ReferenceError') {
      return response.status(500).send({ error: 'internal server error' });
    }
    
    console.error('Passing error to default error handler');
    next(error);
  };

    // handler di richieste con endpoint sconosciuto
  app.use(unknownEndpoint)
  
  // questo deve essere l'ultimo middleware caricato, anche tutte le rotte dovrebbero essere registrate prima di questo!
  app.use(errorHandler);
  
  const PORT = process.env.PORT || 3000
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})