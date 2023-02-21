//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://wz165:test-123@cluster0.dqufndr.mongodb.net/todolistDB", {useNewUrlParser: true});
//connect server db: mongodb+srv://wz165:test-123@cluster0.dqufndr.mongodb.net/todolistDB
//connect local db: mongodb://localhost:27017/todolistDB

//mongoose schema
const itemsSchema = {
    name: String
}

//mongoose model
const Item = mongoose.model("Item", itemsSchema);

//mongoose document
const item1 = new Item({
  name: "Welcome to your todolist!"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "<-- Hit this to delte an item."
});

const defaultItem = [item1, item2, item3];




app.get("/", function(req, res) {
  //mongoose find()
    Item.find({}, function(err, foundItems){
      console.log(foundItems);
      if (foundItems.length === 0){
        //mongoose insertMany()
        Item.insertMany(defaultItem, function(err, docs) {
          if (err){
            console.log(err);
          } else {
            console.log("Success");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", {listTitle: "Today", newListItems: foundItems});
      }
    });


});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item({
    name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err){
      console.log("deleted successfully");
      res.redirect("/");
    } else {
      console.log(err);
    }
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

