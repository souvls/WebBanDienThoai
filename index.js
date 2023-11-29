const express = require('express')
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

//call router
const router = require('./routers/router');
const admin_router_dashboard = require("./routers/router_admin_dashboad");
const admin_router_product = require("./routers/router_admin_product");
const admin_router_content = require("./routers/router_admin_content");

//call cookie
const cookieParser = require("cookie-parser");

//dynamic file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static file
app.use(express.static(path.join(__dirname, 'public')));

//use cookie
app.use(cookieParser());

//use post method
app.use(express.urlencoded({extended:false}));


//create server
let port = process.env.PORT;
app.use(router);
app.use(admin_router_dashboard);
app.use(admin_router_product);
app.use(admin_router_content);
app.listen(port, () => {
    console.log("run server in port: "+ port);
})
