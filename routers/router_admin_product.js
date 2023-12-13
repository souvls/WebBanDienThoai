const express = require('express')
const router = express.Router()
const connection = require('../config/conDB');
const path = require('path');
const fs = require('fs');

// ==== START =====  call multer uplaod file
const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/image/product/')// local save file
    },
    filename:function(req,file,cb){
        cb(null,req.body.pd_name+Date.now()+".jpg") //rename file
    }
})
const upload = multer({
    storage:storage
})
// ==== END =====  call multer uplaod file



// ############## Router Product #########################
// ===== add product page
router.get("/admin/add-product", (req,res)=>{
    try{
        connection.query(`SELECT * FROM mathang`,(err, items)=>{
            if(err) throw err;
            connection.query(`SELECT * FROM nhanhieu`, (err, brands)=>{
                if(err) throw err;
                res.render('admin/index_admin',{x:'add-product',desc:'Thêm sản phẩm mới',product:'',items:items,brands:brands})
            })
        })
    }catch(err){
        console.log(err);
    }
});

// === list product page
router.get("/admin/list-product",(req,res)=>{
    try{
        connection.query(
            `SELECT *  FROM sanpham
            LEFT JOIN mathang ON sanpham.s_mathang = mathang.m_ma 
            LEFT JOIN nhanhieu ON sanpham.s_nhanhieu = nhanhieu.nh_ma
            ORDER BY s_ma DESC`,
            (err, results, firlds) => {
                if (err) {
                    console.log("Error! sql.", err);
                }
                if (results) {
                    res.render('admin/index_admin',{x:'list-product',desc:'Danh sách sản phẩm',products:results})
                }
            }
        )
    }catch(err){
        console.log(err);
    }
});

// ===== edit product page
router.get("/admin/edit-product/:id", (req,res)=>{
    const id = req.params.id;
    try{
        connection.query(
            `SELECT *  FROM sanpham
            LEFT JOIN mathang ON sanpham.s_mathang = mathang.m_ma 
            LEFT JOIN nhanhieu ON sanpham.s_nhanhieu = nhanhieu.nh_ma
            WHERE s_ma = ?`,
            [id],
            (err, product) => {
                if(err) throw err;
                connection.query(`SELECT * FROM mathang`,(err, items)=>{
                    if(err) throw err;
                    connection.query(`SELECT * FROM nhanhieu`, (err, brands)=>{
                        if(err) throw err;
                        res.render('admin/index_admin',{x:'edit-product',desc:'sửa sản phẩm',products:product,items:items,brands:brands})
                    })
                })
            }
        )
    }catch(err){
        console.log(err);
    }

});

// ======= delete Product
router.get("/admin/delete-product/:id", (req,res)=>{
    const id = req.params.id;
    try{
        connection.query(
            `SELECT *  FROM sanpham
            WHERE s_ma = ?`,
            [id],
            (err, result) => {
                if (err) throw err;
                const product = result[0];
                // Delete the product image file from the public/image/product folder
                const imagePath = path.join(__dirname, '../public/image/product/', product.s_hinh);
                fs.unlink(imagePath, (err) => {
                  if (err) throw err;
                  connection.query(
                    `DELETE FROM sanpham WHERE s_ma = ?`,
                    [id],
                    (err,success) => {
                        if (err) throw err;
                        
                    }
                  )
                });
                
            }
        )
    }catch(err){
        console.log(err);
    }
});

// ===== insert product to database 
router.post('/admin/product/insert',upload.single("pd_image"),(req,res)=>{

    // check Img
    var img = 'shop11.svg';
    if(!!req.file){
        img = req.file.filename;
    }
    //============================
    try{
        connection.query(
            `INSERT INTO sanpham(s_ten,s_hinh,s_mathang,s_nhanhieu,s_giamua,s_gia,s_uudai, s_soluong, s_mota) 
            VALUES (?,?,?,?,?,?,?,?,?)`,
            [req.body.pd_name,
                img,req.body.pd_item,
                req.body.pd_brand,
                req.body.pd_price1,
                req.body.pd_price2,
                req.body.pd_discount,
                req.body.pd_num,
                req.body.pd_desc],
            (err, product) => {
                if(err) throw err;
                res.send(`<script>alert('Thêm thành công!'); window.location.href='/admin/add-product';</script>`);
        })
    }catch(err){
        console.log(err);
    }
});

// ===== update product in database 
router.post('/admin/product/update',upload.single("pd_image"),(req,res)=>{
    const {pd_id,pd_name,pd_item,pd_brand,pd_num,pd_price1,pd_price2,pd_discount,pd_desc} = req.body;

    // check Img
    if(!!req.file){
        var img = req.file.filename;
        try{
            connection.query(
                `UPDATE sanpham 
                SET s_ten=?, s_hinh=?,s_mathang=?,s_nhanhieu=?,s_giamua=?,s_gia=?,s_uudai=?,s_soluong=?,s_mota = ?
                WHERE s_ma = ?`,
                [pd_name,img,pd_item,pd_brand,pd_price1,pd_price2,pd_discount,pd_num,pd_desc,pd_id],
                (err, results) => {
                    if(err) throw err;
                    console.log(pd_id,pd_name,pd_item,pd_brand,pd_num,pd_price1,pd_price2,pd_discount,pd_desc);
                    res.send(`<script>alert('Update thành công!');window.location.href='/admin/list-product';</script></script>`);
            })
        }catch(err){
            console.log(err);
        }
    }else{
        try{
            connection.query(
                `UPDATE sanpham 
                SET s_ten=?,s_mathang=?,s_nhanhieu=?,s_giamua=?,s_gia=?,s_uudai=?,s_soluong=?,s_mota = ?
                WHERE s_ma = ?`,
                [pd_name,pd_item,pd_brand,pd_price1,pd_price2,pd_discount,pd_num,pd_desc,pd_id],
                (err, results) => {
                    if(err) throw err;
                    res.send(`<script>alert('Update thành công!');window.location.href='/admin/list-product';</script></script>`);
            })
        }catch(err){
            console.log(err);
        }

    }

});

// ===== search product
router.post("/search",(req,res)=>{
    var {pd_sortby,pd_limit,pd_key} = req.body;
    if(pd_key == ''){
        try{
            connection.query(
                `SELECT *  FROM sanpham
                LEFT JOIN mathang ON sanpham.s_mathang = mathang.m_ma 
                LEFT JOIN nhanhieu ON sanpham.s_nhanhieu = nhanhieu.nh_ma
                ORDER BY ${pd_sortby} DESC LIMIT ${pd_limit}`,
                (err, results) => {
                    if(err) throw err;
                    res.render('admin/index_admin',{x:'list-product',desc:'Kết quả tìm kiểm',products:results});
                }
            )
        }catch(err){
            console.log(err);
        }
    }else{
        console.log(pd_key);
        try{
            connection.query(
                `SELECT *  FROM sanpham
                LEFT JOIN mathang ON sanpham.s_mathang = mathang.m_ma 
                LEFT JOIN nhanhieu ON sanpham.s_nhanhieu = nhanhieu.nh_ma
                WHERE s_ten LIKE '%${pd_key}%' OR mathang.m_name LIKE '%${pd_key}%' OR nhanhieu.nh_name LIKE '%${pd_key}%'
                ORDER BY ${pd_sortby} DESC LIMIT ${pd_limit}`,
                (err, results) => {
                    if(err) throw err;
                    res.render('admin/index_admin',{x:'list-product',desc:'Kết quả tìm kiểm',products:results});
                }
            )
        }catch(err){
            console.log(err);
        }
    }
}) 

module.exports = router;