-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 29, 2023 at 12:08 PM
-- Server version: 10.4.22-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dt`
--

-- --------------------------------------------------------

--
-- Table structure for table `sanpham`
--

CREATE TABLE `sanpham` (
  `s_ma` int(5) NOT NULL,
  `s_ten` varchar(100) COLLATE utf8_vietnamese_ci DEFAULT NULL,
  `s_hinh` varchar(500) COLLATE utf8_vietnamese_ci NOT NULL,
  `s_mathang` int(5) DEFAULT NULL,
  `s_nhanhieu` int(5) NOT NULL,
  `s_giamua` float NOT NULL,
  `s_gia` int(10) DEFAULT NULL,
  `s_uudai` float NOT NULL,
  `s_soluong` int(5) DEFAULT NULL,
  `s_mota` varchar(500) COLLATE utf8_vietnamese_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_vietnamese_ci;

--
-- Dumping data for table `sanpham`
--

INSERT INTO `sanpham` (`s_ma`, `s_ten`, `s_hinh`, `s_mathang`, `s_nhanhieu`, `s_giamua`, `s_gia`, `s_uudai`, `s_soluong`, `s_mota`) VALUES
(13, 'Iphone 13 pro', 'image-removebg-preview-15.png', 1, 2, 0, 25000000, 10, 10, ''),
(15, 'Macbook pro 13 inch', 'MacBookPro-2020-M1-SpaceGray.jpg', 2, 2, 0, 30000000, 0, 10, ''),
(16, 'Sony a7 iv', 'sony-alpha-a7m4.jpg', 4, 6, 0, 40000000, 0, 5, ''),
(17, 'airpod pro', 'Tai nghe Apple AirPods Pro.png', 3, 2, 0, 3000000, 0, 20, ''),
(18, 'Samsung galaxy s22 ultra', 'samsung_galaxy_s22_ultra_-_black_721a96a9cea54cc3be0ffa7fe2e14b0f.webp', 1, 1, 0, 24000000, 0, 10, ''),
(19, 'samsung s22+', 'image-removebg-preview-7.png', 1, 1, 0, 17000000, 0, 10, ''),
(20, 'Huawei p50', 'huawei-p50-pro-extra.webp', 1, 5, 0, 23000000, 0, 10, 'Huawei chính thức công bố dòng smartphone cao cấp Huawei P50. Chiếc điện thoại giúp khám phá bước tiến mới với hệ thống camera siêu khủng cùng một thiết kế khác biệt hoàn toàn so với thế hệ trước, hứa hẹn sẽ dẫn đầu xu hướng và tạo ra những trải nghiệm đẳng cấp, khác biệt cho người dùng. Thiết kế tinh xảo, nổi bật Tổng thể Huawei P50 mang một dáng vẻ sang trọng và cao cấp với mặt lưng được đánh bóng đến mức hoàn hảo kèm khung viền kim loại tạo cảm giác cứng cáp, chắn chắn.'),
(22, 'Canon m50', 'canon-eos-m50-kit-1545mm-den(2).jpg', 4, 7, 0, 20000000, 0, 7, ''),
(23, 'Acer nitro 5', '2086_laptopaz_acer_eagle_an515_57_1.jpg', 2, 9, 0, 18000000, 0, 7, ''),
(24, 'Airpod 3', 'image-removebg-preview_637702417485579178.png', 3, 2, 0, 29000000, 0, 5, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `sanpham`
--
ALTER TABLE `sanpham`
  ADD PRIMARY KEY (`s_ma`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `sanpham`
--
ALTER TABLE `sanpham`
  MODIFY `s_ma` int(5) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
