if(process.env.NODE_ENV === 'production'){
    module.exports = {mongoURI: 'mongodb://ondra:zemedelka1@ds223063.mlab.com:23063/library-database'}
} else{
    module.exports = {mongoURI: 'mongodb://localhost/vidjot-dev'}
}