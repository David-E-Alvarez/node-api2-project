const express = require("express");
const Posts = require('../data/db.js');

const router = express.Router();

//post to api/posts
router.post('/', (req,res) => {
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }else{
        Posts.insert(req.body)
            .then(post => {
                console.log("post in then: ", post)
                res.status(201).json(post)
            })
            .catch(error => {
                res.status(500).json({error: "There was an error while saving the post to the database"})
            })
    }
    
})


module.exports = router;