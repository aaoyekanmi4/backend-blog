const express = require('express');
const path = require('path');
const ejs = require('ejs')
const BlogPost = require('./models/BlogPost.js')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = new express();


mongoose.connect('mongodb://localhost/my_database',
{
  useNewUrlParser:true,
  useUnifiedTopology:true
})
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static('public'))

app.set('view engine', 'ejs')




app.get('/', async (req,res) => {
  const blogposts = await BlogPost.find({})
  res.render('index', {
    blogposts
  })
})

app.post('/', async (req,res) => {
  const searchTerm = req.body.search;
  const blogposts = await BlogPost.find({title:new RegExp(searchTerm, "i")})
  res.render('index', {
    blogposts
  })

})

app.get('/about', (req,res) => {
  // res.sendFile(path.resolve(__dirname, 'pages/about.html'))
  res.render('about')
})

app.get('/contact', (req,res) => {
  // res.sendFile(path.resolve(__dirname, 'pages/contact.html'))
  res.render('contact')
})

app.get('/post/:id', async (req,res) => {
  const blogpost = await BlogPost.findById(req.params.id)
  res.render('post', {
    blogpost
  })
})

app.get('/post/new', (req,res) => {
  res.render('create')
})

app.post('/posts/store', async (req,res)=> {
  await BlogPost.create(req.body)
    res.redirect('/') 
})
app.listen(4000, () => {
  console.log('Server listening on port 4000')
})