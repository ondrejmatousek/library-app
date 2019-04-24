const express = require('express');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const flash = require('connect-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();


//Map global promise - get rid of warning
mongoose.Promise = global.Promise;

//DB config

const db = require('./config/database');

//Connect to mongoose

mongoose.connect(db.mongoURI, {

})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));

//Load Idea Model
require('./models/Idea');
const Idea = mongoose.model('ideas');

//handlebars Middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Method override middleware
app.use(methodOverride('_method'));

//express session midleware
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
    
  }))

  app.use(flash());

// Global variables

app.use(function(req, res, next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//index route

app.get('/', (req, res) => {
    res.render('index');
});

// Add (form) Route

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

// Edit Idea Form

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea =>{
        res.render('ideas/edit', {
            idea:idea
        });
    });
});

// Show.handlebars Route

app.get('/ideas/show', (req, res) => {
    Idea.find({})
        .then(ideas => {
            res.render('ideas/show', {
                ideas: ideas
            });
        })
});

// Process form
app.post('/ideas', (req, res) => {
    let errors = [];

    if (!req.body.autor) {
        errors.push({ text: 'Please add a autor' });
    }
    if (!req.body.title) {
        errors.push({ text: 'Please add some title' });
    }
    if (!req.body.pagenum) {
        errors.push({ text: 'Please add number of pages' });
    }
    if (!req.body.publication) {
        errors.push({ text: 'Please add date of publication' });
    }

    if (errors.length > 0) {
        res.render('ideas/add', {
            errors: errors,
            autor: req.body.autor,
            title: req.body.title,
            pagenum: req.body.pagenum,
            publication: req.body.publication
        });
    } else {
        const newUser = {
            autor: req.body.autor,
            title: req.body.title,
            pagenum: req.body.pagenum,
            publication: req.body.publication
        }
        new Idea(newUser)
            .save()
            .then(idea => {
                req.flash('success_msg', 'Záznam byl uložen');
                res.redirect('/ideas/show');
            })
    }
});

//edit form process

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        // new values
        idea.autor = req.body.autor;
        idea.title = req.body.title;
        idea.pagenum = req.body.pagenum;
        idea.publication = req.body.publication;

        idea.save()
        .then(idea =>{
            req.flash('success_msg', 'Změny v záznamu byly úspěšně uloženy');
            res.redirect('/ideas/show');
        })
    });
});

// delete Idea

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id})
    .then(() => {
        req.flash('success_msg', 'Záznam byl odstraněn');
        res.redirect('/ideas/show');
    })
});


const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log('server started on port ' + port);
});

// set static folder
app.use(express.static('public'));

