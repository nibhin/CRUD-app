const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');

const path = require('path');
const Player = require('./Player');
const app = express();
const port = process.env.PORT || 5002; // Use environment variable for port

// Use environment variable for MongoDB URI
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://nibhin:nibhin123@cluster0.6ghzh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(mongoURI);

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../client/views/uploads')); // Correct path to uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    }
});

const upload = multer({ storage: storage });

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../client/views')); // Correct views directory

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/views'))); // Serve static files

// Define routes
app.get('/', async (req, res) => {
    try {
        const p = await Player.find();
        res.render('samples', { p }); // Render the correct view
    } catch (error) {
        res.status(500).send("Error fetching player data.");
    }
});

app.post('/save', upload.single('pic'), async (req, res) => {
    try {
        const { playerno, jerseyno, name, age, app, goal, assist, card } = req.body;
        const pic = req.file ? `/uploads/${req.file.filename}` : '';
        const p = new Player({ pic, playerno, jerseyno, name, age, app, goal, assist, card });
        await p.save();
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Error saving player data.");
    }
});

app.post('/delete', async (req, res) => {
    try {
        const { playerno } = req.body;
        await Player.deleteOne({ playerno });
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Error deleting player data.");
    }
});

app.post('/clear', async (req, res) => {
    try {
        await Player.deleteMany({});
        res.redirect('/');
    } catch (error) {
        res.status(500).send("Error clearing player data.");
    }
});

app.listen(port, () => {
    console.log(`Server running on port:${port}`);
});
