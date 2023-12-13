const express = require('express')
const router = express.Router()
const connection = require('../config/conDB');


// ===== Home admin
router.get("/admin",(req,res)=>{
    try {
        connection.query(
            `SELECT count(*) FROM hoadon`,
            (err,soHoaDon)=>{
                if(err) throw err;
                connection.query(
                    'SELECT SUM(so_luong) FROM chitiethoadon',
                    (err,soSanPhamDaBan)=>{
                        if(err) throw err;
                        connection.query(
                            'SELECT SUM(toTal) FROM hoadon',
                            (err,tongThuNhap)=>{
                                if(err) throw err;
                                connection.query(
                                    'SELECT count(*) FROM nguoidung',
                                    (err,soNguoiDung)=>{
                                        if(err) throw err;
                                        connection.query(
                                            `SELECT * FROM hoadon
                                            WHERE status = 0
                                            ORDER BY ngay_lap DESC
                                            LIMIT 5;`,
                                            (err,New_5_Hoadon)=>{
                                                if(err) throw err;
                                                const now = new Date();
                                                const year = now.getFullYear();
                                                connection.query(
                                                    `SELECT DATE_FORMAT(ngay_lap, '%m') as month, SUM(toTal) as toTal_income 
                                                    FROM hoadon
                                                    WHERE ngay_lap LIKE '?%'
                                                    GROUP BY month`,
                                                    [year],
                                                    (err,thongKeBanHang)=>{
                                                        if(err) throw err;
                                                        connection.query(
                                                            `SELECT sp.s_ma,sp.s_ten,sp.s_hinh, SUM(ct.so_luong) AS so_luong_ban
                                                            FROM chitiethoadon AS ct 
                                                            INNER JOIN hoadon AS hd ON ct.ma_hoa_don = hd.ma_hoa_don 
                                                            INNER JOIN sanpham AS sp ON ct.ma_san_pham = sp.s_ma 
                                                            GROUP BY sp.s_ma 
                                                            ORDER BY so_luong_ban ASC LIMIT 5`,
                                                            (err,spBanChay)=>{
                                                                res.render('admin/index_admin',
                                                                    {
                                                                        x: 'Dashboard',
                                                                        desc: 'Dashboard',
                                                                        soHoaDon: soHoaDon[0]['count(*)'],
                                                                        soSanPhamDaBan: soSanPhamDaBan[0]['SUM(so_luong)'],
                                                                        tongThuNhap: tongThuNhap[0]['SUM(toTal)'],
                                                                        soNguoiDung: soNguoiDung[0]['count(*)'],
                                                                        New_5_Hoadon: New_5_Hoadon,
                                                                        thongKeBanHang: thongKeBanHang,
                                                                        spBanChay: spBanChay
                                                                    })
                                                            }
                                                        )
                                                        

                                                    }
                                                )
                                                
                                            }
                                        )
                                    }
                                )
                                

                            }
                        )
                        
                    }
                )
                
            }
        )
    } catch (error) {
        console.log(error);
    }
});

module.exports = router;