const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000


// Middlewares

app.use(cors())
app.use(express.json())


//dataBase


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bw0ezcs.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        // const foodsCollection = client.db("FoodReviewCollection").collection("foods")
        const database = client.db("FoodReviewCollection");
        const foodsCollection = database.collection("foods");

        app.get('/foods', async (req, res) => {
            const filter = foodsCollection.find()
            const result = await filter.toArray()
            res.send(result)
        })

        app.get('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.findOne(query)
            res.send(result)
        })

        app.post('/foods', async (req, res) => {
            const food = req.body
            console.log(food)
            const result = await foodsCollection.insertOne(food)
            res.send(result)
        })

        app.delete('/foods/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await foodsCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/foods/:id', async (req, res) => {
            const id = req.params.id
            const food = req.body
            const query = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatedFood = {
                $set: {
                    name: food.name,
                    price: food.price,
                    supplier: food.supplier,
                    taste: food.taste,
                    review: food.review,
                    ratting: food.ratting,
                    photo: food.photo
                }
            }
            const result = await foodsCollection.updateOne(query, updatedFood, option)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => console.log(port))