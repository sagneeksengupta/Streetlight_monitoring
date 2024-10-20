const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

const uri = "mongodb://localhost:27017/sensorDB";
const client = new MongoClient(uri);

let sensorCollection;

async function connectToMongo() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");
        const database = client.db("sensorDB");
        const collections = await database.listCollections().toArray();
        if (!collections.find(col => col.name === 'esp')) {
            console.log("Creating time-series collection 'esp'");
            await database.createCollection("esp", {
                timeseries: {
                    timeField: "timestamp",  // Time index for the time-series data
                    metaField: "metadata",   // Optional metadata field
                    granularity: "seconds"   // Granularity of data, adjust as needed
                }
            });
        }

        sensorCollection = database.collection("esp");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}
connectToMongo();


app.post('/data',async (req, res) => {
    console.log('Received data:', req.body);
    sensorData = req.body;
    res.json({ message: 'Data received successfully' });
    const sensorData = {
        timestamp: new Date(),
        sensor1: req.body.sensor1,
        sensor2: req.body.sensor2,
        sensor3: req.body.sensor3
    };
    try {
        await sensorCollection.insertOne(sensorData);
        console.log("Data inserted into MongoDB");
        res.json({ message: 'Data received and stored successfully' });
    } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ message: 'Error storing data' });
    }
});

app.get('/data', (req, res) => {
    res.json(sensorData);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});