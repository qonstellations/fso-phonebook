import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

const app = express()

// middlewares
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
app.use(morgan(':method :url :status :res[content-length] :response-time ms :body'))

let persons = [
    { 
        "id": "1",
        "name": "Arto Hellas", 
        "number": "040-123456"
    },
    { 
        "id": "2",
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
    },
    { 
        "id": "3",
        "name": "Dan Abramov", 
        "number": "12-43-234345"
    },
    { 
        "id": "4",
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    return res.status(200).json({
        status: 'ok'
    })
})

app.get('/info', (req, res) => {
    const message = `<p>Phonebook has info for ${persons.length} people <br/><br/>` + Date() + '</p>'
    return res.send(message)
})

app.get('/api/persons', (req, res) => {
    return res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === req.params.id)
    
    if(person){
        return res.json(person)
    }
    else{
        return res.status(404).json({
            error: 'person not found'
        })
    }
})

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body
    
    // since both undefined and empty strings are falsy
    if(!name || !number){
        return res.status(400).json({
            error: 'content is missing'
        })
    }
    
    if(persons.find(person => person.name.toLowerCase() === name.toLowerCase())){
        // return http 409 - conflict
        return res.status(409).json({
            error: 'name must be unique'
        })
    }
    
    const person = {
        // using max possible integer fir least probability of duplicate id
        id: String(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)),
        name: name.trim(),
        number: number.trim()
    }
    persons.push(person)
    
    return res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
    const person = persons.find(person => person.id === req.params.id)
    
    if(person){
        persons = persons.filter(person => person.id !== req.params.id)
        return res.status(204).end()
    }
    else{
        res.statusMessage = 'person not found'
        return res.status(404).end()
    }
})

export default app
