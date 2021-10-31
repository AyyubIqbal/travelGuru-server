const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sc2zp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const database = client.db("travelGuru");
  const serviceCollection = database.collection("services");
  const orderCollection = database.collection('orders');


    // GET API
    app.get('/services', async(req, res)=>{
        const result = await serviceCollection.find({}).toArray();
        res.send(result);
    });

    // get single service 
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service id', id);
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            res.json(service)
        })

    // Add Orders API 
    app.post('/orders', async (req, res) => {
        const order = req.body;
        const result = await orderCollection.insertOne(order);
        res.json(result);
    })

    // post api
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        })

//   client.close();
});


app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, ()=>{
    console.log('Running server on port', port);
})