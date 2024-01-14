require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://graydot-task.web.app',
        'https://graydot-task.firebaseapp.com',
    ],

}))
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qiowubl.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const grayDotCollection = client.db('usersDB').collection('grayDot')



async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        // Send a ping to confirm a successful connection

        app.get('/all-users', async (req, res) => {
            const result = await grayDotCollection.find().toArray();
            const usersCount = await grayDotCollection?.estimatedDocumentCount()
            console.log(usersCount);
            // res.sendStatus(usersCount)
            res.send({ result, usersCount })
        })


        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Graydot-Technologies-Task-Server is running')
})

app.listen(port, () => {
    console.log(`Graydot-Technologies-Task-Server is running on the port: ${port}`);
})