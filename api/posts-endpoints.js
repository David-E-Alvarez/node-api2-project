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

//POST to api/posts/:id/comments
router.post('/:id/comments', (req,res) => {
    Posts.findPostComments(req.params.id)
        .then(([comment])=> {
                if(!comment.text){
                    res.status(400).json({errorMessage: "Please provide text for the comment."})
                }else{
                    Posts.findCommentById(comment.id)
                    .then(comment => {
                        Posts.insertComment(comment)
                            .then(comment => {
                                res.status(201).json(comment)
                            })
                            .catch(error => {
                                res.status(500).json({error: "There was an error while saving the comment to the database"})
                            })
                    })
                    .catch()
                }                
            res.status(201).json(comment)
        })
        .catch(error => {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        })
})

//GET api/posts/:id/comments
router.get('/:id/comments', (req,res) => {
    Posts.findCommentById(req.params.id)
        .then(comment => {
            // Posts.findCommentById(something.id)
            //     .then(something => {
            //         console.log('-------->something', something)
            //         res.status(201).json(something)

            //     })
            console.log('---comment-------->', comment)
            res.status(201).json(comment)
        })
        .catch(error => {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        })
})
//console.log('---comment.id-------->',comment.id)

module.exports = router;