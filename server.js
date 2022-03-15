const express = require('express');
const bodyParser= require('body-parser')

const app = express();

const mongoUrl = 'mongodb://127.0.0.1:27017'

const MongoClient = require('mongodb').MongoClient


MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars')
    const quotesCollection = db.collection('quotes')

    app.use(bodyParser.urlencoded({ extended: true }))
    app.set('view engine', 'ejs')
    app.use(express.static('public'))
    app.use(bodyParser.json())

    app.listen(4000, function() {
        console.log('listening on 4000')
      })
    
    app.get('/', (req, res) => {
        res.sendFile(__dirname + '/test.html')        
    })
   

    app.get('/hallinta',(req,res) => {        
      // find to array
        db.collection('quotes').find().toArray()
        .then(results => {
            res.render('index.ejs', {quotes: results })
            
        })
        .catch(error => console.error(error))
        
    })

    app.get('/api',(req,res) => {        
      // find to array
        db.collection('quotes').find().toArray()
        .then(results => {
             res.json(results)      
        })
        .catch(error => console.error(error))
        
    })
    
    app.post('/quotes', (req, res) => {
        quotesCollection.insertOne(req.body)        
          .then(result => {
            console.log(result)
            res.redirect('/hallinta')
          })
          .catch(error => console.error(error))
      })   


  })
   .catch(console.error)


