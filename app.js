const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB", { useUnifiedTopology: true,  useNewUrlParser: true });

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Article = mongoose.model("Article",articleSchema);

// <------------------------Requests Targeting all Articles ------------------------->

app.route("/articles")

  .get((req,res) => {
    Article.find((err,foundArticles) => {
      if(!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })

  .post((req,res) => {
    const newArticle = new Article({
      title: req.body.title,
      content: req.body.content
    });
    newArticle.save((err) => {
      if(!err) {
        res.send("Successfully sent a new article");
      } else {
        res.send(err);
      }
    });
  })

  .delete((req,res) => {
    Article.deleteMany((err) => {
      if(err) {
        res.send(err);
      } else {
        res.send("Successfully deleted all the articles");
      }
    });
  });

// <------------------------Requests Targeting specific Articles ------------------------->

app.route("/articles/:articleTitle")
  .get((req,res) => {
    Article.findOne({title:req.params.articleTitle},(err, foundArticle) => {
      if(foundArticle) {
        res.send(foundArticle);
      } else {
        res.send("No Article Found.");
      }
    });
  })
  .put((req,res) => {
    Article.update({title:req.params.articleTitle},{title:req.body.title, content:req.body.content},{overwrite:true},(err) => {
      if(!err) {
        res.send("Successfully updated the article.");
      }
    });
  })
  .patch((req,res) => {
    Article.update({title:req.params.articleTitle}, {$set: req.body},(err) => {
      if(!err) {
        res.send("Successfully updated the selected article.");
      }
    });
  })
  .delete((req,res) => {
    Article.deleteOne({title:req.params.articleTitle}, (err) => {
      if(!err) {
        res.send("Successfully deleted the selected article");
      }
    });
  });

app.listen(3000, function() {
  console.log("Server started on port 3000(localhost:3000/articles)");
});
