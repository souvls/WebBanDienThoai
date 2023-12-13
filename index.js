const express = require('express')
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();

//call router
const router = require('./routers/router');
const router_auth =require('./routers/router_auth');
const admin_router_dashboard = require("./routers/router_admin_dashboad");
const admin_router_bill = require("./routers/router_admin_bill");
const admin_router_product = require("./routers/router_admin_product");
const admin_router_content = require("./routers/router_admin_content");


//dynamic file
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//static file
app.use(express.static(path.join(__dirname, 'public')));

//use cookie
app.use(cookieParser());

//use post method
app.use(express.urlencoded({extended:false}));

//kiem tra admin
const authAdmin = (req,res,next)=>{
    if(req.cookies.isLogin){
        if(req.cookies.isLogin.role === 1){
            return next();
        }else{
            res.send(`<script>alert('You are not admin!');window.location.href='/login';</script></script>`);
        }
    }else{
        res.send(`<script>alert('Please login with admin acount');window.location.href='/login';</script></script>`);
    }
}

//create server
let port = process.env.PORT;
app.use(router);
app.use(router_auth);
app.use(authAdmin,admin_router_dashboard);
app.use(authAdmin,admin_router_bill)
app.use(authAdmin,admin_router_product);
app.use(authAdmin,admin_router_content);
app.listen(port, () => {
    console.log("run server in port: "+ port);
})
