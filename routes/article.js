const { json } = require('express')
const express = require('express')
const { default: slugify } = require('slugify')
const article = require('../models/article')
const router = express.Router()
const Article = require('../models/article')


// '/article' route

router.get('/new', (req,res)=>{
    res.render("articles/new", { article: new Article() })
})


//replace it with delete method
router.get('/delete/:slug', async (req, res) => {
    await Article.deleteOne({ slug: req.params.slug })
    console.log(`Post '${req.params.slug}' has been deleted!` )
    res.redirect('/')
})

router.put('/:id', async (req,res,next)=>{
    req.article = await Article.findById(req.params.id)
    console.log(req.body)
    next()
},saveUpdateArticle('edit'))

router.get('/edit/:id', async(req, res) => {
    const article = await Article.findById(req.params.id)
    res.render('articles/edit' , { article: article })
})


router.get('/:slug', async (req, res) => {
    const article = await Article.findOne({ slug: req.params.slug })
    if(article!=null)
    {res.render('articles/show', {article:article})}
    else
    {res.redirect("/")}
})


router.post('/', async (req, res,next) => {
    req.article  = new Article()
    next()
},saveUpdateArticle('show'))



function saveUpdateArticle(path)
{
    return async(req,res)=>{
        let article = req.article
            article.title = req.body.title
            article.description = req.body.description
            article.markdown = req.body.markdown
        try {
            article = await article.save()
            res.redirect(`/articles/${article.slug}`)
        } catch (error) {
            console.log(error)
            //error redirection
            res.render(`articles/${path}`, { article: article })
        }
    }
}

module.exports = router