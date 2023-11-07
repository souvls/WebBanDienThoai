const express = require('express')
const router = express.Router()
const path = require('path')


// ===== Home admin
router.get("/admin", (req,res)=>{
    res.render('admin/index_admin',{x:'Dashboard',desc:'Dashboard'})
});


// ############## Router Product #########################
// ===== add product page
router.get("/admin/add-product", (req,res)=>{
    res.render('admin/index_admin',{x:'add-product',desc:'Thêm sản phẩm mới'})
});
router.get("/admin/list-product", (req,res)=>{
    res.render('admin/index_admin',{x:'list-product',desc:'Danh sách sản phẩm'})
});
router.get("/admin/edit-product", (req,res)=>{
    res.render('admin/index_admin',{x:'edit-product',desc:'Sửa sản phẩm'})
});

module.exports = router;