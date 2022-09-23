const express = require('express')
const router = express.Router();


class User {
    constructor(id = 1, mail = '') {
        this.id = id
        this.mail = mail
    }
}

const stor_user = {
    users: []
}


router.post('/login', (req, res) => {
    const {users} = stor_user
    const {id, mail} = req.body
    const newUser = new User(users.length, mail)
    users.push(newUser)
    res.status(201)
    res.json(newUser)
})


module.exports = router