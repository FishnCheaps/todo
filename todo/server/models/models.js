var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let user = new Schema({
  name : String,
  login : String,
  password : String
});

let task = new Schema({
  name : String,
  description : String,
  creator: {type: Schema.Types.ObjectId, ref: 'user'},
  contributors : [{type: Schema.Types.ObjectId, ref: 'user'}]
});

let block = new Schema({
  name : String,
  order : Number,
  tasks : [task]
});

let board = new Schema({
  name : String,
  owner : {type: Schema.Types.ObjectId, ref: 'user'},
  contributors : [{type: Schema.Types.ObjectId, ref: 'user'}],
  blocks : [block]
});


let MODELS = {
  User : mongoose.model('user', user),
  Board : mongoose.model('board', board)
}

module.exports = MODELS;
