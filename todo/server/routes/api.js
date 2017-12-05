const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

var MODELS = require('../models/models');

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

const sendResponse = (content,message,res) => {
  response.status = 200;
  response.message = message;
  response.data = content;
  res.status(200).json(response)
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

//get user
router.get('/user/:name', (req, res) => {
  let userName = req.param('name');
  let response = {
    user : {},
    ownBoards : {},
    contributingInBoards : {}
  };
  MODELS.User.findOne({'login' : userName}).exec((err,user) => {
    if (err)
      sendError(err,user);
    if(user==null)
      sendError('user not found',res);
    response.user = user;
    MODELS.Board.find({'owner': user._id}).select('_id name').exec((err,boards) => {
      if (err)
        sendError(err,boards);
      response.ownBoards = boards;
      MODELS.Board.find({'contributors': user._id}).select('_id name').exec((err,boards) => {
        if (err)
          sendError(err,boards);
        response.contributingInBoards = boards;
        sendResponse(response,"User found",res);
      });
    });
  });
});

//create user
router.post('/user/new/',(req,res)=>{
  let userName = req.body.name;
  let login = req.body.login;
  let password = req.body.password;

  MODELS.User.findOne({'login' : login}).exec((err,user) => {
    if (err)
      sendError(err,user);
        console.log(user);
    if (user!=null)
      {
        sendError('this login is already in use',res);
        return;
      }
    let newUser = MODELS.User({
      name : userName,
      login : login,
      password : password
    });
    newUser.save((err,nuser) => {
      if (err)
        sendError(err,nuser);
    }).then(sendResponse({},"Created",res));
  });
});


router.post('/user/delete/',(req,res)=>{
  let login = req.body.login;
  let password = req.body.password;

  MODELS.User.findOne({'login' : login}).exec((err,user) => {
    if (err)
      sendError(err,user);
        console.log(user);
    if (user==null)
      {
        sendError('user do not exist',res);
        return;
      }
    MODELS.User.findOne({'login' : login, 'password' : password}).remove().exec((err,user) => {
      if (err)
        sendError(err,user);
      sendResponse(user,"Deleted",res)

    });
    });
  });
//create board
router.post('/board/new/',(req,res)=>{
  let userName = req.body.name;
  let password = req.body.password;
  let boardName = req.body.boardName;

  //console.log(JSON.stringify(req.body));
  MODELS.User.findOne({'login' : userName}).exec((err,user) => {
    if (err)
      sendError(err,user);
        console.log(user);
    if (user==null)
      {
        sendError('user not found',res);
        return;
      }
    MODELS.Board.findOne({'owner.login': userName, 'name': boardName}).exec((err,board) => {
      if (err)
        sendError(err,board);
      if(board!=null)
        {
          sendError('you allready have board with this name',res);
          return;
        }
      let newBoard=MODELS.Board({
        name: boardName,
        owner: user._id,
        contributors: [],
        blocks: []
      });

      newBoard.save((err,nboard) => {
        if (err)
          sendError(err,nboard);
      }).then(sendResponse({},"Created",res));
    });
  });

})

module.exports = router;













// {
//   "name": "test board",
//   "contributors": [{"name" : "user 1"}, {"name" : "user 2"}],
//   "owner": {"name": "user 2"},
//   "blocks": [{"name" : "new tasks",tasks}]
// }
