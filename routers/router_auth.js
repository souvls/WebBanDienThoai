const express = require('express');
const encrypt = require('../middleware/encrypt')
const router = express.Router();

const connection = require('../config/conDB');

router.get("/login",(req,res)=>{
    const login = req.cookies.isLogin;
    if(login){
        //console.log(req.cookies.isLogin.Username)
        res.render('index',{x:'cart'});
    }else{
        res.render('index',{x:'login'});
    }
})

router.post("/login",(req,res)=>{
    const {Username ,Password} = req.body;
    try{
        connection.query(
            `SELECT *  FROM nguoidung
            WHERE ng_hoTen = ? OR ng_email = ?`,
            [Username,Username],
            async (err,result)=>{
                if(result.length > 0){
                    const checkPass = await encrypt.check(Password,result[0].ng_matKhau);
                    if(checkPass === true){
                        if(result[0].role === 1){
                            res.cookie('isLogin', {Username:result[0].ng_hoTen,Email:result[0].ng_email,Phone:result[0].ng_Phone,Address:result[0].ng_diaChi,role:1});
                            res.send(`<script>alert('Đăng nhập thành công'); window.location.href='/admin'</script>`);
                        }else{
                            res.cookie('isLogin', {Username:result[0].ng_hoTen,Email:result[0].ng_email,Phone:result[0].ng_Phone,Address:result[0].ng_diaChi,role:0});
                            res.send(`<script>alert('Đăng nhập thành công'); window.location.href='/cart'</script>`);
                        }
                        
                    }else{
                        res.send(`<script>alert('Mật khẩu không đúng!'); window.location.href='/login'</script>`);
                    }
                }else{
                    res.send(`<script>alert('Email không tồn tại!'); window.location.href='/login'</script>`);
                }
            }
        )
    }catch(err){
        console.log(err);
    }
})
router.get("/register",(req,res)=>{
    const login = req.cookies.isLogin;
    if(login){
        //console.log(req.cookies.isLogin.Username)
        res.render('index',{x:'cart'});
    }else{
        res.render('index',{x:'register'});
    }
})
router.post("/register",(req,res)=>{
    const {Fullname ,Email,Password,Phone,Address} = req.body;
    try{
        connection.query(
            `SELECT *  FROM nguoidung
            WHERE ng_hoTen = ? OR ng_email = ?`,
            [Fullname,Email],
            async (err, result) => {
                if(err) throw err;
                if(result.length === 1){
                    res.send(`<script>alert('tên hoặc Email đã tồn tại'); window.location.href='/register'</script>`);
                }else{
                    let Pass = await encrypt.hash(Password);
                    let now = new Date();
                    let dateLogin = now.toISOString();
                    connection.query(
                        `INSERT INTO nguoidung(ng_hoTen, ng_email, ng_matKhau, ng_Phone, ng_diaChi, ng_ngay_DK)
                        VALUES (?,?,?,?,?,?)`,
                        [Fullname,Email,Pass,Phone,Address,dateLogin],
                        (err,login)=>{
                            if(err) throw err;
                            res.cookie('isLogin', {Username:Fullname,Email:Email,Phone:Phone,Address:Address,role:0});
                            res.send(`<script>alert('Đăng ký thành công'); window.location.href='/'</script>`);
                        }
                    )
                }
            }
        )
    }catch(err){
        console.log(err);
    }
})
router.get("/logout",(req,res)=>{
    res.clearCookie('isLogin');
    res.redirect('/');
})
module.exports = router;