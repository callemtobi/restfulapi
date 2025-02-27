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
app.route('/articles')
    .get((req, res) => {
        Article.find({})
        .then((data) => {
            console.log('----------> Data found!');
            res.send(data);
        })
        .catch((err) => {console.log('----------> Get Error: ' + err)})

    })
    .post((req, res) => {
        // Create article
        let userData = {
            title: req.body.title,
            content: req.body.content
        };

        Article.insertOne(userData)
        .then(() => {console.log('----------> Success! Created.'); res.send('Created!')})
        .catch((err) => {console.log('----------> Post Error: ' + err); res.send('Error!')})
    })
    // .delete() -> delete all articles

app.route('/articles/:title')
    .get((req, res) => {                // ----------- GET Request
        // Get user with Title
        Article.findOne({title: req.params.title})
        .then((data) => {
            if (!data) {
                console.log('----------> Not found!')
                res.send('Not found!')
            } else {
                res.send(data)
            }
        })
        .catch((err) => console.log('----------> Get Specific Error: ' + err))
    })
    .put((req, res) => {               // ----------- PATCH Request
        // Update article Completely
        Article.findOneAndUpdate({title: req.params.title}, {title: req.body.title, content: req.body.content})
        .then((data) => {
            if (!data) {
                console.log('----------> Not found!')
                res.send('Not found!')
            } else {
                console.log('----------> Success! Created.'); 
                res.send('Updated!');
            }
        })
        .catch((err) => {console.log('----------> Put Error: ' + err); res.send('Error!')})
    })
    .delete((req, res) => {         // ----------- DELETE Request
        // Delete specific article
        Article.findOne({title: req.params.title})
        .then((data) => {
            if(!data) {
                console.log('----------> Not found!'); res.send('Not found!')
            } 
            console.log('----------> Success! Deleted.'); 
            res.send('Deleted!');
        })
        .catch((err) => {console.log('----------> Delete Error: ' + err); res.send('Error!')})
    })

// ------------- PORT
app.listen(PORT, () => {
    console.log(`Server running on: http:/localhost:${PORT}`);
})