import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 8000;

// STATIC FILES IN 'PUBLIC' FOLDER [JUST USE './']
app.use(express.static('./public'));
// TO HANDLE FORMS
app.use(express.urlencoded({ extended: false}));
// TELL EXPRESS TO EMPLOY EJS TEMPLATE ENGINE FOR DYNAMIC HTML PAGES
app.set('view engine', 'ejs');

// -------------- MONGOOSE DATABASE 
mongoose.connect('mongodb://localhost:27017/wikiDB');

mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
mongoose.connection.once('open', () => {
    console.log('-----> Database connected');
});

// DATABASE SCHEMA
const wikiSchema = new mongoose.Schema({
    title: { type: String, required: true},
    content: { type: String, required: true}
})
// COLLECTION NAME
const Article = new mongoose.model('Article', wikiSchema);

// ------------- ROUTES
app.get('/', (req, res) => {
    res.send('All good.');
})


// ------------- PORT
app.listen(PORT, () => {
    console.log(`Server running on: http:/localhost:${PORT}`);
})