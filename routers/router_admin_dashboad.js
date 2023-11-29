const express = require('express')
const router = express.Router()
const connection = require('../config/conDB');


// ===== Home admin
router.get("/admin", (req,res)=>{
    res.render('admin/index_admin',{x:'Dashboard',desc:'Dashboard'})
});

module.exports = router;