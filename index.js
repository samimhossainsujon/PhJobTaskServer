const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DV_USER}:${process.env.DV_PASS}@cluster0.f7u6kbd.mongodb.net/?retryWrites=true&w=majority`;

async function initializeDB() {
    const client = new MongoClient(uri, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        },
    });

    try {
        await client.connect();
        const db = client.db("JobTaskPh");
        const collageCollection = db.collection("Colleges");
        const CollageGalleryCollection = db.collection("CollageGallery");
        const CollageApplyCollection = db.collection("CollageApply");
        const FeedbackCollection = db.collection("Feedback");



        //==================================
        // get post and limit collage fiend
        // =================================

        app.post('/newCollageAdd', async (req, res) => {
            const newCollage = req.body;
            const result = await collageCollection.insertOne(newCollage);
            res.send(result);
        });

        app.get('/newCollageAdd', async (req, res) => {
            const result = await collageCollection.find().toArray();
            res.send(result);
        });

        app.get('/LimitedClassAdd', async (req, res) => {
            const limit = parseInt(req.query.limit) || 3;
            let result = [];

            try {
                result = await collageCollection.find().toArray();
                const limitedData = result.slice(0, limit);
                res.json(limitedData);
            } catch (error) {
                console.error("Error fetching data:", error);
                res.status(500).json({ error: "An error occurred while fetching data" });
            }
        });


        app.get('/newCollageAdd/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await collageCollection.findOne(query);
            res.send(result);

        });


        // ========================================
        // collage img post and get 
        // ========================================


        app.post('/CollageGallery', async (req, res) => {
            const newCollage = req.body;
            const result = await CollageGalleryCollection.insertOne(newCollage);
            res.send(result);
        });

        app.get('/CollageGallery', async (req, res) => {
            const result = await CollageGalleryCollection.find().toArray();
            res.send(result);
        });


        // ===================================================
        // collage apply collation 
        // ===================================================


        app.post('/ApplyCollage', async (req, res) => {
            const ApplyCollage = req.body;
            const result = await CollageApplyCollection.insertOne(ApplyCollage);
            res.send(result);
        });

        app.get('/ApplyCollage', async (req, res) => {
            const result = await CollageApplyCollection.find().toArray();
            res.send(result);
        });


        // =====================================
        //  feedback get and post 
        // ======================================



        app.post('/feedback', async (req, res) => {
            const StudentFeedback = req.body;
            const result = await FeedbackCollection.insertOne(StudentFeedback);
            res.send(result);
        });

        app.get('/feedback', async (req, res) => {
            const result = await FeedbackCollection.find().toArray();
            res.send(result);
        });


        // ============================================
        // 
        // ============================================


        app.get('/newCollageAdd/:text', async (req, res) => {
            const searchText = req.params.text;
            try {
                const result = await collageCollection.find({
                    ToyName: { $regex: searchText, $options: "i" }
                }).toArray();
                res.send(result);
                console.log(result);
            } catch (error) {
                console.log(error);
                res.status(500).send('Internal Server Error');
            }
        });






        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}



// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

initializeDB().catch(console.error);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
