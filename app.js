const express = require('express');
const path = require('path');
const route = require('./routes/community');
const db = require('./database/db');

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// middle_wares
app.use(express.static('public'));
app.use(express.urlencoded({ extended : false }));

app.use(route);

app.use(function(req, res) {
    res.status(404).render('404');
})

app.use(function(err, req, res, next) {
    console.log(err);

    res.status(500).render('500');
})

db.connect().then(function () {
    app.listen(3000);
})