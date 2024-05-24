const express = require('express');
const mongodb = require('mongodb');

const db = require('../database/db');

const router = express.Router();

const ObjectId = mongodb.ObjectId;

router.get('/', function (req, res) {

    res.redirect('/main');
});

router.get('/main', async function (req, res) {
    // var page = Math.max(1, req.query.page);
    // const LIMIT = 10;
    // console.log(page);


    let posts = await db
        .getDb()
        .collection('posts')
        .find({}, { title: 1, 'author.name': 1, date: 1 })
        .sort({ _id: -1 })
        .skip(0)
        .limit(5)
        .toArray();

    if(req.query.search) {
        posts = await db
            .getDb()
            .collection('posts')
            .find({ title: {$regex: new RegExp(`${req.query.search}`, "i") } }, { title: 1, 'author.name': 1, date: 1 })
            .toArray();
        console.log(req.query);
        return res.render('main', { posts: posts });
    }
    console.log(posts);
    res.render('main', { posts: posts });
});

router.get('/dbreq/:id', async function(req, res) {

    let posts = await db
        .getDb()
        .collection('posts')
        .find({}, { title: 1, 'author.name': 1, date: 1 })
        .sort({ _id: -1 })
        .skip(Number(req.params.id))
        .limit(5)
        .toArray();

    // return posts;
    res.render('dbreq', { posts: posts});
});

router.get('/create-post', function (req, res) {
    
    res.render('create-post');
});

router.get('/post/:id', async function (req, res) {
    
    let postId = new ObjectId(req.params.id);
    
    const post = await db
        .getDb()
        .collection('posts')
        .findOne({ _id: postId});

    const replies = await db
        .getDb()
        .collection('reply')
        .find({ targetPostId: req.params.id})
        .toArray();
    console.log("replies: " + replies);
    
    res.render('post-detail', { post: post, replies: replies });
})

router.get('/post/:id/identify', function (req, res) {
    const postId = new ObjectId(req.params.id);

    res.render('edit-post-identify', { postId : postId, failed: false });
});

router.get('/post/:id/identify-delete', function (req, res) {
    const postId = new ObjectId(req.params.id);

    res.render('delete-post-identify', { postId : postId, failed: false });
});

router.get('/post/:id/edit', async function (req, res) {
    const postId = new ObjectId(req.params.id);

    const post = await db
        .getDb()
        .collection('posts')
        .find({ _id: postId })
        .toArray();

    res.render('post-edit', { post: post });
});

router.post('/main', async function (req, res) {
    const date = new Date();
    const json_post = {
        title: req.body.title,
        content: req.body.content,
        author: {
            name: req.body.author_name,
            pw: req.body.author_pw
        },
        date: date
    };

    try {
        const result = await db
            .getDb()
            .collection('posts')
            .insertOne(json_post);
    } catch (error) {
        throw { message: `Creating post Failed : ${error}` };
    }

    res.redirect('main');
});

// router.post('/post/:id/delete', async function (req, res) {
//     const postId = new ObjectId(req.params.id);

//     await db
//         .getDb()
//         .collection('posts')
//         .deleteOne({ _id: postId });
    
//     res.redirect('/main');
// });

router.post('/post/:id/identify', async function (req, res) {
    const postId = new ObjectId(req.params.id);

    const result = await db
        .getDb()
        .collection('posts')
        .findOne({ _id: postId, 'author.pw': req.body.pw });

    if(!result) {
        res.render('edit-post-identify', { postId : postId, failed: true });
    } else {
        console.log("Identified!");
        res.redirect(`/post/${postId}/edit`);
    }
});

router.post('/post/:id/identify-delete', async function (req, res) {
    const postId = new ObjectId(req.params.id);

    const result = await db
        .getDb()
        .collection('posts')
        .findOne({ _id: postId, 'author.pw': req.body.pw });

    if(!result) {
        res.render('delete-post-identify', { postId : postId, failed: true });
    } else {
        console.log("Delete Identified!");
        
        await db
        .getDb()
        .collection('posts')
        .deleteOne({ _id: postId });
    
        res.redirect('/main');
    }
});

router.post('/post/:id/edit', async function (req, res) {
    const postId = new ObjectId(req.params.id);

    const result = await db
        .getDb()
        .collection('posts')
        .updateOne(
            { _id: postId },
            { $set: 
                { title: req.body.title,
                content: req.body.content,
                author: { name: req.body.author_name, pw: req.body.author_pw }
                }
            }
        );

    console.log(result);

    res.redirect('/main');
});

router.post('/post/:id/create-reply', async function (req, res) {
    const date = new Date();

    const reply = {
        targetPostId: req.params.id,
        username: req.body.username,
        password: req.body.password,
        content: req.body.content,
        date: date,
        readableDate: date.toLocaleDateString('kr-KR', {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    };

    const result = await db
        .getDb()
        .collection('reply')
        .insertOne(reply);

    res.redirect(`/post/${req.params.id}`);
})

router.post('/post/:id/delete-reply/:uid', async (req, res) => {
    const userId = new ObjectId(req.params.uid);

    const result = await db
        .getDb()
        .collection('reply')
        .deleteOne({ _id: userId });
    
    console.log(result);
    
    res.redirect(`/post/${req.params.id}`);
});

module.exports = router;