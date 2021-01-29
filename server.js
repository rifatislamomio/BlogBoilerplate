const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000
const articleRoute = require('./routes/article')
const Article = require('./models/article')
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: false }))
const uri = "mongodb+srv://omio:ahC9ZmECVuRERsUk@cluster0.gwqpc.mongodb.net/blog?retryWrites=true&w=majority";
app.use(methodOverride('_method')) //for overriding methods and [to use PUT and DELETE method]


mongoose.connect(uri,
{useNewUrlParser:true , useUnifiedTopology:true, useCreateIndex :true})
app.set('view engine','ejs')

app.get('/', async(req, res) => {
    
    let data = await Article.find().sort({createdAt:'desc'})
    res.render('articles/index', { articles: data})
})

app.use('/articles', articleRoute)

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`)
})