const express = require('express')
const router = express.Router()
const connection = require('../config/conDB');
const path = require('path');
const fs = require('fs');

// ==== START =====  call multer uplaod file
const multer = require('multer')
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/image/content/')// local save file
    },
    filename:function(req,file,cb){
        cb(null,req.body.ct_name+Date.now()+".jpg") //rename file
    }
})
const upload = multer({
    storage:storage
})
// ==== END =====  call multer uplaod file

// ########## Router content ###########

//====== form add content
router.get("/admin/add-content", (req,res)=>{
    res.render('admin/index_admin',{x:'add-content',desc:'Tạo content mới'});
})

// ===== list content
router.get("/admin/list-content",(req,res)=>{
    try{
        connection.query(
            `SELECT * FROM tb_content 
            ORDER BY content_status DESC,content_stt ASC`,
            (err,results)=>{
                if(err) throw err;
                res.render('admin/index_admin',{x:'list-content',desc:'Danh sách content',ct:results});
        })
    }catch(err){
        throw err;
    }
})

// ===== edit content
router.get("/admin/edit-content/:id",(req,res)=>{
    const id = req.params.id;
    try{
        connection.query(
            `SELECT * FROM tb_content 
            WHERE id = ?`,
            [id],
            (err,results)=>{
                if(err) throw err;
                res.render('admin/index_admin',{x:'edit-content',desc:'sửa content',ct:results[0]});
        })
    }catch(err){
        throw err;
    }

})

router.get("/admin/delete-content/:id",(req,res)=>{
    const id = req.params.id;
    try{
        connection.query(
            `SELECT *  FROM tb_content
            WHERE id = ?`,
            [id],
            (err, result) => {
                if (err) throw err;
                const content = result[0];
                // Delete the product image file from the public/image/product folder
                const imagePath = path.join(__dirname, '../public/image/content/', content.content_img);
                fs.unlink(imagePath, (err) => {
                  if (err) throw err;
                  connection.query(
                    `DELETE FROM tb_content WHERE id = ?`,
                    [id],
                    (err,success) => {
                        if (err) throw err;
                        res.send(`<script>alert('Xóa content id: ${id} thành công!'); window.location.href='/admin/list-content';</script>`);
                    }
                  )
                });
                
            }
        )
    }catch(err){
        console.log(err);
    }
})

// ==== insert content
router.post("/admin/content/insert",upload.single("ct_img"),(req,res)=>{
    const {ct_name,ct_desc,checkbox} = req.body;
    const ct_status = checkbox === 'on' ? 1 : 0;
    const now = new Date();
    const ct_date = now.toISOString();
    const ct_img = req.file.filename;
    try{
        connection.query(
            `INSERT INTO tb_content(content_name,content_img,content_desc,content_date,content_status,content_stt) 
            VALUES (?,?,?,?,?,?)`,
            [ct_name,ct_img,ct_desc,ct_date,ct_status,99],
            (err,result)=>{
                if(err) throw err;
                res.send(`<script>alert('tạo content thành công!');window.location.href='/admin/list-content';</script></script>`);
        })
    }catch(err){
        throw err;
    }
})
// =====update content
router.post("/admin/content/update",upload.single("ct_img"),(req,res)=>{
    const {ct_id,ct_name,ct_desc,checkbox,ct_stt} = req.body;
    const ct_status = checkbox === 'on' ? 1 : 0;
    if(!!req.file){
        const ct_img = req.file.filename;
        try{
            connection.query(
                `UPDATE tb_content
                SET content_name = ?,content_img = ?,content_desc = ?,content_status = ?,content_stt = ?
                WHERE id = ?`,
                [ct_name,ct_img,ct_desc,ct_status,ct_stt,ct_id],
                (err,result)=>{
                    if(err) throw err;
                    res.send(`<script>alert('Update content thành công!');window.location.href='/admin/list-content';</script></script>`);
            })
        }catch(err){
            throw err;
        }

    }else{
        try{
            connection.query(
                `UPDATE tb_content
                SET content_name = ?,content_desc = ?,content_status = ?,content_stt = ?
                WHERE id = ?`,
                [ct_name,ct_desc,ct_status,ct_stt,ct_id],
                (err,result)=>{
                    if(err) throw err;
                    res.send(`<script>alert('Update content thành công!');window.location.href='/admin/list-content';</script></script>`);
            })
        }catch(err){
            throw err;
        }
    }
    
})
module.exports = router;
