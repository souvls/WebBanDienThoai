const express = require('express')
const router = express.Router()
const path = require('path')
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
                        res.render('index',{x:'home',slideShow:slideShow,products:products});
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
router.get("/checkout",(req,res)=>{
    res.render('index',{x:'checkout'});
})
router.get("/info/:id",(req,res)=>{
    const id = req.params.id
    try{
        connection.query(
            'SELECT * FROM `sanpham` WHERE s_ma = ?',
            [id],
            (err,result) =>{
                if(err) throw err;
                console.log(result)
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
                console.log(result.length)
                if(err) throw err;
                res.render('index',{x:'search',products:result});
            }
        )
    }catch(err){
        throw err;
    }
})



module.exports = router;