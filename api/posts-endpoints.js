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
//GET api/posts
router.get('/', (req,res) => {
    Posts.find()
        .then(posts => {
            res.status(201).json(posts)
        })
        .catch(error => {
           res.status(500).json({error: "The posts information could not be retrieved."}) 
        })
})

//PUT to api/posts/:id
router.put('/:id', (req,res) => {
    let id = req.params.id;
    let updated_post = req.body;
    if(!req.body.title || !req.body.contents){
        res.status(400).json({errorMessage: "Please provide title and contents for the post."})
    }else{
        Posts.findById(id)
        .then(post => {
            console.log('----->', post.length)
            if(post.length == 0){
                res.status(404).json({message: "The post with the specified ID does not exist."})
            }else{
                Posts.update(id, updated_post)
                    .then(post => {
                        res.status(200).json(post)
                    })
                    .catch(error => {
                        res.status(500).json(error)
                    })
            }
            
        })
    }
})

//DELETE api/posts/:id
router.delete('/:id', (req,res) => {
    const id = req.params.id;
    Posts.findById(id)
        .then(post => {
            Posts.remove(id)
                .then(post => {
                    res.status(201).json(post)
                })
                .catch(error => {
                    res.status(500).json({errorMessage: "The post could not be removed", error})
                })
        })
        .catch(error => {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        })
})


//GET api/posts/:id
router.get('/:id',(req,res) => {
   Posts.findById(req.params.id)
    .then(post => {
        // console.log("----post.length---->", post.length)
        if(post.length == 0 || post.length == null){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else{
            Posts.findPostComments(req.params.id)
                .then(post_comment => {
                    // console.log('-sdfg----->', post_comment)
                    if(post_comment.length == 0 || post_comment.length == null){
                        res.status(404).json({message: "no comment for this post"})
                    }else{
                        res.status(201).json(post_comment)
                    }
                    
                })
                .catch(error => {
                    res.status(500).json({ error: "The post information could not be retrieved." })
                })
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

//POST to api/posts/:id/comments
router.post('/:id/comments', (req,res) => {
    let body = req.body;
    Posts.findById(req.params.id)
    .then(post => {
        // console.log("----post.length---->", post.length)
        if(post.length == 0 || post.length == null){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else{
            // console.log('------------->', req.body)
            if(!req.body.text){
                res.status(400).json({ errorMessage: "Please provide text for the comment." })
            }else{
                console.log("req.body", req.body.text)
                body.post_id = req.params.id;
                Posts.insertComment(body)
                    .then(something => {
                        console.log('------------>',something)
                        res.status(201).json(something)
                    })
                    .catch(error => {
                       res.status(500).json(error)
                    })
            }
        }
    })
    .catch(error => {
        res.status(500).json(error)
    })
})

//GET api/posts/:id/comments
router.get('/:id/comments', (req,res) => {       
    Posts.findById(req.params.id)
    .then(post => {
        // console.log("----post.length---->", post.length)
        if(post.length == 0 || post.length == null){
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }else{
            Posts.findPostComments(req.params.id)
                .then(post_comment => {
                    // console.log('-------------->', post_comment)
                    res.status(201).json(post_comment)
                })
                .catch(error => {
                    res.status(500).json({ error: "The comments information could not be retrieved." })
                })
        }   
    })
})
//console.log('---comment.id-------->',comment.id)

module.exports = router;