require("dotenv").config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.port || 5000;
const expressHbs = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');
const redirectIfAuthenticated = require('./middleware/redirectIfAuthenticated');
const helpers = require('./utils/helpers');

// Sử dụng middleware body-parser để phân tích các yêu cầu có nội dung dưới dạng JSON
app.use(bodyParser.json());

// Đảm bảo rằng bodyParser.urlencoded() được sử dụng nếu bạn cần phân tích dữ liệu từ form POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the /client/assets directory
app.use(express.static(path.join(__dirname, '../client/assets')));

app.engine(
    'hbs',
    expressHbs.engine({
        extname: 'hbs',
        defaultLayout: 'layout',
        layoutsDir: path.join(__dirname, '../client/views/layouts/'),
        partialsDir: path.join(__dirname, '../client/views/partials/'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: helpers,
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client/views'));

// trang chu
app.get("/", redirectIfAuthenticated, (req, res) => {
    res.render("index", { layout: false }); // Chỉ định không sử dụng layout
});
app.use("/", require('./routes/authRoute'));

// login register ...
app.use("/account", require('./routes/accountRoute'));

// homeView when user login success
app.use('/home', require('./routes/homeRoute'));

// user 
app.use("/users", require('./routes/userRoute'));

// project list
app.use("/project", require('./routes/projectRoute'));

// board
app.use('/board', require('./routes/boardRoute'));


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).render('error', { message: 'Server error!' });
});

// app.get('/config', (req, res) => {
//     res.json({ facebookAppId: process.env.FACEBOOK_APP_ID });
//   });

// const serverOptions = {
//     key: fs.readFileSync('./certs/cert.key'),
//     cert: fs.readFileSync('./certs/cert.crt')
//   };
  
// const server = https.createServer(serverOptions, app);

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});