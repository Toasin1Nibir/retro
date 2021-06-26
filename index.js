const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5000
const ObjectId = require('mongodb').ObjectId
require("dotenv").config()

console.log(process.env.DB_USER)
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u3b1e.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('conectuin error ',err)
  const eventcollection = client.db("blog").collection("blogger");
  const admintcollection = client.db("blog").collection("admin");
  console.log('database conected')

  app.get('/blog',(req, res)=>{
    eventcollection.find()
    .toArray((error , items)=>{
      res.send(items)
    })
  })
  app.get('/', (req, res) => {
    res.send("hello from db it's working working")
})
  app.get('/admin',(req, res)=>{
    admintcollection.find()
    .toArray((error , items)=>{
      res.send(items)
    })
  })
 app.post('/addadmin',(req,res)=>{
   const email = req.body.email;
   admintcollection.find({email:email.email})
   .toArray((error,admin)=>{
     
      res.send(admin.length>0)
     
   
   })
 })

  app.post('/addblog',(req, res)=>{
    const newBlog = req.body;
    console.log('adding new blog',newBlog)

    eventcollection.insertOne(newBlog)
    .then(result =>{
      console.log('res count',result.insertedCount)
      res.send(result.insertedCount > 0)
    })
})
app.delete('/delete/:id',(req, res) =>{
   
  eventcollection.deleteOne({_id: ObjectId(req.params.id)})
  .then(result=>{
    res.send(result.deletedCount>0)
  })
})
});
app.listen(port )