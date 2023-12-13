const express = require('express')
const router = express.Router()
const connection = require('../config/conDB');
const path = require('path');
const fs = require('fs');


router.get("/admin/bill",(req,res)=>{
    try {
        connection.query(
            `SELECT * FROM hoadon WHERE status = 0
             ORDER BY giao_hang DESC`,
            (err,result)=>{
                if(err) throw err;
                res.render('admin/index_admin',{x:'bill',desc:'Danh sách hóa đơn',bills:result})
            }
        )
    } catch (error) {
        
    }
    
})
router.get("/admin/confirm-bill/:id",(req,res)=>{
    const id = req.params.id;
    try {
        connection.query(
            `SELECT * FROM chitiethoadon
            WHERE ma_hoa_don = ?`,
            [id],
            (err,chitiethoadon)=>{
                if(err) throw err;
                for(var i = 0; i < chitiethoadon.length; i++){
                    connection.query(
                        `UPDATE sanpham
                        SET s_soluong = s_soluong - ?
                        WHERE s_ma = ?`,
                        [chitiethoadon[i].so_luong,chitiethoadon[i].ma_san_pham],
                        (err)=>{
                            if(err) throw err;
                            
                        }
                    )
                }
                connection.query(
                    `UPDATE hoadon
                    SET giao_hang = 1
                    WHERE ma_hoa_don  = ?`,
                    [id],
                    (err,result)=>{
                        if(err) throw err;
                        res.redirect("/admin/bill");
                    }
                )
            }
        )
    } catch (error) {
        
    }
})
router.get("/admin/delete-bill/:id",(req,res)=>{
    const id = req.params.id;
    try {
        connection.query(
            `UPDATE hoadon
            SET status = 1
            WHERE ma_hoa_don = ?`,
            [id],
            (err,result)=>{
                if(err) throw err;
                res.redirect("/admin/bill");
            }
        )
    } catch (error) {
        
    }

})

module.exports = router;