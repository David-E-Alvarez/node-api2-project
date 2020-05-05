const express = require('express');

const postsRouter = require('./api/posts-endpoints.js');

const server = express();
server.use(express.json());

server.get('/', (req, res) => res.send('API up and running!'));

server.use('/api/posts', postsRouter);



// using port 9000 for this example
server.listen(9000, () => console.log('API running on port 9000'));