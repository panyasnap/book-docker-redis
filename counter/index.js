const redis = require("redis");
const express = require("express");


const app = express();
const port = process.env.PORT || 1234;
const client = redis.createClient({url: "redis://redis:6379"});
//const redisClient = require('redis').createClient(6379,'redis');

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);
(async () => {
    client.on("error", (error) => console.error(`Error : ${error}`));
    await client.connect();
})();

app.get('/counter/:id/incr', async (req, res) => {
    const id = req.params

    let counter = await client.get(id.id)
    console.log(counter)
    res.json({counter})
})

app.post('/counter/add', async (req, res) => {

   let count = req.body.id

    try {
        const cnt = await client.incr(count)
        res.json(cnt)
    } catch (e) {
        res.json({err: 'Redis err'});
    }
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});


