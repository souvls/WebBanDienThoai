const express = require('express')
const router = express.Router()
const request = require('request');
const moment = require('moment');
const connection = require('../config/conDB');


router.get("/",(req,res)=>{
    try{
        //get slide
        connection.query(
            `SELECT * FROM tb_content
            WHERE content_status = 1
            ORDER BY content_stt ASC`,
            (err,slideShow)=>{
                if(err) throw err;
                connection.query(
                    `SELECT * FROM sanpham WHERE s_soluong > 0`,
                    (err,products)=>{
                        if(err) throw err;
                        connection.query(
                            `SELECT sp.s_ma,sp.s_ten,sp.s_gia,sp.s_uudai,sp.s_hinh, SUM(ct.so_luong) AS so_luong_ban
                            FROM chitiethoadon AS ct 
                            INNER JOIN hoadon AS hd ON ct.ma_hoa_don = hd.ma_hoa_don 
                            INNER JOIN sanpham AS sp ON ct.ma_san_pham = sp.s_ma 
                            GROUP BY sp.s_ma 
                            ORDER BY so_luong_ban ASC LIMIT 8`,
                            (err,spBanChay)=>{
                                res.render('index',{x:'home',slideShow:slideShow,products:products,spBanChay:spBanChay});
                            }
                        )
                        
                    }
                )
                
            }
        )
    }catch(err){
        throw err;
    }
    
});
router.get("/cart",(req,res)=>{
    res.render('index',{x:'cart'});
})
router.get("/info/:id",(req,res)=>{
    const id = req.params.id
    try{
        connection.query(
            'SELECT * FROM `sanpham` WHERE s_ma = ?',
            [id],
            (err,result) =>{
                if(err) throw err;
                res.render('index',{x:'info',product:result[0]});
            }
        )
    }catch(err){
        throw err;
    }
})

router.get("/search/category/:id",(req,res)=>{
    const id = req.params.id
    try{
        connection.query(
            'SELECT * FROM `sanpham` WHERE s_mathang = ?',
            [id],
            (err,result) =>{
                if(err) throw err;
                res.render('index',{x:'search',products:result});
            }
        )
    }catch(err){
        throw err;
    }
})
router.post("/search",(req,res)=>{
    const search_key = req.body.search_key
    try{
        connection.query(
            `SELECT * FROM sanpham WHERE s_ten Like '%${search_key}%'`,
            (err,result) =>{
                if(err) throw err;
                res.render('index',{x:'search',products:result});
            }
        )
    }catch(err){
        throw err;
    }
})
router.post("/checkVoucher",(req,res)=>{
    const vouchercode = req.body.vouchercode;

    try{
        connection.query(
            'SELECT * FROM `tb_content` WHERE content_name = ? AND content_status = 1',
            [vouchercode],
            (err,result) =>{
                if(err) throw err;
                if(result.length === 1){
                    res.cookie('voucher', {vouchercode:result[0].content_name,discount:result[0].content_discount}, { maxAge: 300000});
                    res.render('index',{x:'cart-voucher',vouchercode:result[0].content_name,discount:result[0].content_discount});
                }else{
                    res.send(`<script>alert('Xin lỗi, mã :${vouchercode} đã hết hạn,hoặc nhập không đúng'); window.location.href='/cart';</script>`);
                }
            }
        )
    }catch(err){
        throw err;
    }
})
router.get("/checkout",(req,res)=>{
    const login = req.cookies.isLogin;
    var cart;
    if(req.cookies.cart){
        cart = JSON.parse(req.cookies.cart) ;
        if(cart.length <= 0){
            res.send(`<script>alert('Bạn chưa chọn sản phẩm nào!'); window.location.href='/cart';</script>`);
        }
    }else{
        res.send(`<script>alert('Bạn chưa chọn sản phẩm nào!'); window.location.href='/cart';</script>`);
    }
    var vouchercode = '';
    var discount = 0;
    var subTotal = 0;
    var toTal = 0;
    for(var i = 0; i < cart.length; i++){
        subTotal += cart[i].count;
    }
    if(req.cookies.voucher){
        vouchercode = req.cookies.voucher.vouchercode;
        discount = req.cookies.voucher.discount;
        toTal = subTotal - (subTotal * discount/100);
    }else{
        toTal = subTotal;
    }
    if(login != null){
        const Username = req.cookies.isLogin.Username
        try{
            connection.query(
                `SELECT *  FROM nguoidung
                WHERE ng_hoTen = ?`,
                [Username],
                (err,result)=>{
                    if(err) throw err;
                    if(result){
                        res.render('index',{x:'checkout',user:result[0],vouchercode:vouchercode,discount:discount,cart:cart,subTotal:subTotal,toTal:toTal});
                    }else{
                        res.render('index',{x:'login'});
                    }
                }
            )
        }catch(err){
            throw err;
        }
    }else{
        res.render('index',{x:'login'});
    }
})
router.get("/paySuccess",async (req,res)=>{
    const {vnp_Amount ,vnp_BankCode, vnp_BankTranNo,vnp_CardType,vnp_OrderInfo,vnp_PayDate,vnp_ResponseCode,vnp_TmnCode,vnp_TransactionNo,vnp_TransactionStatus,vnp_TxnRef,vnp_SecureHash} = req.query;
    const username = req.cookies.isLogin.Username;
    const now = new Date();
    const _date = `${now.getDate()}/${now.getMonth()+1}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
    const cart = JSON.parse(req.cookies.cart) ;
    var vouchercode = '';
    var discount = 0;
    var subTotal = 0;
    var toTal = 0;
    for(var i = 0; i < cart.length; i++){
        subTotal += cart[i].count;
    }
    if(req.cookies.voucher){
        vouchercode = req.cookies.voucher.vouchercode;
        discount = req.cookies.voucher.discount;
        toTal = subTotal - (subTotal * discount/100);
    }else{
        toTal = subTotal;
    }

    try{
        //tao Hoa don
        connection.query(`INSERT INTO hoadon(ngay_lap, khach_hang, tong_tien, ma_uudai,toTal, giao_hang) 
        VALUES (?,?,?,?,?,?)`,
        [_date,username,subTotal,vouchercode,toTal,0],
        (err,hoadon)=>{
            if (err) throw err;
            //tao thong tin thanh toan
            connection.query(
                `INSERT INTO tb_thanhtoan(id_hoadon,vnp_Amount,vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_OrderInfo,vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash) 
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
                [hoadon.insertId, vnp_Amount, vnp_BankCode, vnp_BankTranNo, vnp_CardType, vnp_OrderInfo, vnp_PayDate, vnp_ResponseCode, vnp_TmnCode, vnp_TransactionNo, vnp_TransactionStatus, vnp_TxnRef, vnp_SecureHash],
                (err) => {
                    if (err) throw err;
                }
            )
            for (var i = 0; i < cart.length; i++) {
                connection.query(
                    `INSERT INTO chitiethoadon(ma_hoa_don, ma_san_pham, so_luong) VALUES(?,?,?)`,
                    [hoadon.insertId, cart[i].id, cart[i].qty],
                    (err) => {
                        if (err) throw err;
                    }
                )
            }
            res.render('success',
                            {
                                code:'Cảm ơn Khách hàng',
                                username:username, 
                                Phone:req.cookies.isLogin.Phone,
                                Address:req.cookies.isLogin.Address,
                                id_bill:hoadon.insertId,
                                vnp_BankTranNo:vnp_BankTranNo,
                                vnp_BankCode:vnp_BankCode,
                                _date:_date,
                                cart:cart,
                                discount:discount,
                                subTotal:subTotal,
                                toTal:toTal
                            });            
        })
        
    }catch(err){
        throw err;
    }
    


  //res.send('success');
})


module.exports = router;