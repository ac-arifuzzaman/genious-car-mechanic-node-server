const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 9000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qw3sn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('geniousCor');
        const serviceCollection = database.collection('services');

        // get api
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        });

        // get single api
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('hitting the id', id)
            const query = { _id: ObjectId(id) }
            const service = await serviceCollection.findOne(query);
            res.send(service)
        })

        // POST API
        app.post('/services', async (req, res) => {
            const service = req.body;
            console.log('hit the post', service);

            const result = await serviceCollection.insertOne(service)
            res.json(result)
        });

        // DELETE API
        app.delete('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await serviceCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

// pass: g9ofYyQUuYf8gA4g name: geniouscar

app.get('/', (req, res) => {
    res.send('Running genious server abar')
});

app.listen(port, () => {
    console.log('sun raha hay na tu', port)
})