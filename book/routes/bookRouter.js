const express = require('express')
const router = express.Router();
const fileMulter = require('../middleware/file')
const {v4: uuid} = require("uuid");
const path = require("path");
const axios = require('axios');
const http = require('http')
// let errm = {
//     errcode: 404,
//     errmsg: 'страница не найдена'
// }
let view =1
class Book {
    constructor(id = uuid(), title = "", description = "", authors = "", favorite = "",
                fileCover = "", fileName = "", fileBook = "") {
        this.id = id
        this.title = title
        this.description = description
        this.authors = authors
        this.favorite = favorite
        this.fileCover = fileCover
        this.fileName = fileName
        this.fileBook = fileBook
    }
}

const stor = {
    books: []
};

[1, 2, 3].map(el => {
    const newBook = new Book(`${el}`, `Book ${el}`, `description ${el}`, `authors ${el}`, `fav ${el}`, `fileCover ${el}`,
        `FileName ${el}`, `file ${el}`);
    stor.books.push(newBook);
});

router.get('/', (req, res) => {
    const {books} = stor
    
    res.render("books/index", {
        title: "All book",
        books: books,
    });
})


router.get('/view/:id', async  (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)

    if (idx === -1) {
        res.redirect('/404');
    } else {
       
       axios.post(`http://counter:1234/counter/add`, {
            id: `${id}`,
          },
          {
            headers: {
                'Content-Type': 'application/json',
            }
        })
          .catch(function (error) {
            console.log(error);
          });

        const {data} = await axios.get(`http://counter:1234/counter/${id}/incr`)
        // .then(res => {
        //    console.log(view);
        //      view = res.data.counter
        //     })
            .catch((error) => {
                console.log(error);
            })
            
        // const url = `http://localhost:1234/counter/1/incr`;
        // http.get(url, (res) => {
        //     let data = '';
        //     res.on('data', chunk => {
        //       data += chunk;
        //     });
        //     res.on('end', () => {
        //         data = JSON.parse(data);
        //         console.log(data);
        //       })
        //     }).on('error', err => {
        //       console.log(err.message);
        //     })
        await res.render("books/view", {
            title: "item | view",
            books: books[idx],
            dataview: data.counter
        });
    
    }
    
    // if (idx !== -1) {
    //     res.json(books[idx])
    // } else {
    //     res.status(404)
    //     res.json(errm)
    // }
})
router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Book | create",
        books: {},
    });
});

// router.post('/create', (req, res) => {
//     const {books} = stor
//     let {id, title, description, authors, favorite, fileCover, fileName} = req.body
//     let fileBook = req.file.path
//     const newBook = new Book(id, title, description, authors, favorite, fileCover, fileName)
//     books.push(newBook)
//     // res.status(201)
//     // res.json(newBook)
//
//     res.redirect('/api/books')
// })

router.post('/create', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    let {id, title, description, authors, favorite, fileCover, fileName} = req.body
    let fileBook
    let newBook
    if (req.file) {
        fileBook = req.file.path
        newBook = new Book(id, title, description, authors, favorite, fileCover, fileName, fileBook)
        books.push(newBook)
    } else {
        fileBook = null
        newBook = new Book(id, title, description, authors, favorite, fileCover, fileName, fileBook)
        books.push(newBook)
    }
    //let fileBook = req.file.path
    //books.push(newBook)
    // res.status(201)
    //res.json(newBook)
    res.redirect(`/api/books`)
})

router.get('/update/:id', (req, res) => {
    const {books} = stor;
    const {id} = req.params;
    const idx = books.findIndex(el => el.id === id);

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render("books/update", {
        title: "Books | update",
        books: books[idx],
    });
});
//put
router.post('/update/:id', fileMulter.single('fileBook'), (req, res) => {
    const {books} = stor
    const {title, description, authors, favorite, fileCover, fileName} = req.body
    const {id} = req.params
    const idx = books.findIndex(el => el.id === id)
    let fileBook
    if (req.file) {
        fileBook = req.file.path
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
    } else {
        fileBook = null
        books[idx] = {
            ...books[idx],
            title,
            description,
            authors,
            favorite,
            fileCover,
            fileName,
            fileBook
        }
    }
    if (idx === -1) {
        res.redirect('/404');
    }
    res.redirect(`/api/books/view/${id}`);
})
// router.delete('/:id', (req, res) => {
//     const {books} = stor
//     const {id} = req.params
//     const idx = books.findIndex(e => e.id === id)
//
//     if (idx !== -1) {
//         books.splice(idx, 1)
//     } else {
//         res.status(404)
//         res.json('404 | страница не найдена')
//     }
// })

router.post('/delete/:id', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)

    if (idx === -1) {
        res.redirect('/404');
    }

    books.splice(idx, 1);
    res.redirect(`/api/books/`);
    // if (idx !== -1) {
    //     books.splice(idx, 1)
    // } else {
    //     res.status(404)
    //     res.json('404 | страница не найдена')
    // }
})

router.get('/:id/download', (req, res) => {
    const {books} = stor
    const {id} = req.params
    const idx = books.findIndex(e => e.id === id)
    if (idx !== -1) {
        let dir = books[idx].fileBook
        console.log(dir)
        if (dir) {
            let img = path.basename(books[idx].fileBook)
            res.download(`${dir}`, `${img}`, err => {
                if (err) {
                    res.status(404).json();
                }
            });

        } else {
            res.redirect('/404');
        }
    }
})
module.exports = router