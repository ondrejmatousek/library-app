const mongoose = require('mongoose');
const Schema = mongoose.Schema;


//Create Schema
const IdeaSchema = new Schema({
    autor:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    pagenum:{
        type: Number,
        required: true
    },
    publication:{
        type: String,
              
    }
});

mongoose.model('ideas', IdeaSchema);