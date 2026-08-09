-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 09, 2026 at 10:51 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.3.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `covetecom`
--

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

CREATE TABLE `account` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `type` varchar(191) NOT NULL,
  `provider` varchar(191) NOT NULL,
  `providerAccountId` varchar(191) NOT NULL,
  `refresh_token` text DEFAULT NULL,
  `access_token` text DEFAULT NULL,
  `expires_at` int(11) DEFAULT NULL,
  `token_type` varchar(191) DEFAULT NULL,
  `scope` varchar(191) DEFAULT NULL,
  `id_token` text DEFAULT NULL,
  `session_state` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `brand`
--

CREATE TABLE `brand` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `status` enum('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `brand`
--

INSERT INTO `brand` (`id`, `name`, `slug`, `image`, `status`, `createdAt`, `updatedAt`) VALUES
('cmrxwu8rv0000vqlkcqfc4h5i', 'Keithston', 'keithston', '/uploads/brands/832f7676-9831-45e3-ac7f-401bcab111e9.webp', 'ACTIVE', '2026-07-23 19:34:35.756', '2026-07-23 19:34:51.628'),
('cmrxwuvpt0001vqlk8tb5p4x3', 'Electrical Charge', 'electrical-charge', '/uploads/brands/f7305141-6678-4805-a031-218ac42c29a6.webp', 'ACTIVE', '2026-07-23 19:35:05.490', '2026-07-23 19:35:05.490'),
('cmrxwv54q0002vqlkkwcdrobl', 'Global Tech', 'global-tech', '/uploads/brands/2b6fea18-987d-43e6-9c1f-64b4057f3de6.webp', 'ACTIVE', '2026-07-23 19:35:17.690', '2026-07-23 19:35:17.690'),
('cmrxwvfde0003vqlkx98zdjiv', 'UrbanEdge1', 'urbanedge1', '/uploads/brands/49ea2c91-94be-4161-9ae7-0b473c6f1f79.webp', 'ACTIVE', '2026-07-23 19:35:30.963', '2026-07-23 19:57:18.464');

-- --------------------------------------------------------

--
-- Table structure for table `category`
--

CREATE TABLE `category` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `image` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `category`
--

INSERT INTO `category` (`id`, `name`, `slug`, `image`, `createdAt`, `updatedAt`) VALUES
('cms3s6fkz0000vqlcr9rrhx3e', 'Fashion', 'fashion', '/uploads/categories/54fa8946-d5f7-42b5-bc50-19b2816a98d2.webp', '2026-07-27 22:10:43.427', '2026-07-27 22:10:43.427'),
('cms3s6qhs0001vqlc7mcf3zvk', 'Mobiles', 'mobiles', '/uploads/categories/95bd260d-1140-430b-9223-4f20cde82a2c.webp', '2026-07-27 22:10:57.568', '2026-07-27 22:10:57.568'),
('cms3s6zpk0002vqlc1ud9p8zh', 'Electronics', 'electronics', '/uploads/categories/fa50272d-c5db-4a30-a26a-2cb820a9e887.webp', '2026-07-27 22:11:09.512', '2026-07-27 22:11:09.512'),
('cms3s7bjd0003vqlcq7gge6zj', 'Beauty', 'beauty', '/uploads/categories/9ab5033e-4158-4c70-a0cd-fa1674275f2f.webp', '2026-07-27 22:11:24.842', '2026-07-27 22:11:24.842'),
('cms3s7kr90004vqlca7cltcgz', 'Home Items', 'home-items', '/uploads/categories/1fe0054a-5ba9-4212-96f1-25b2d7df4d8f.webp', '2026-07-27 22:11:36.789', '2026-07-27 22:11:36.789'),
('cms3s7sca0005vqlc755k97bz', 'Furniture', 'furniture', '/uploads/categories/11b286f0-fd5f-45a0-b689-f12e502b00db.webp', '2026-07-27 22:11:46.618', '2026-07-27 22:11:46.618'),
('cms3s7zhk0006vqlcjn53mpq0', 'Sports', 'sports', '/uploads/categories/715a2893-ae34-4254-b729-27eb40eaa2f2.webp', '2026-07-27 22:11:55.880', '2026-07-27 22:11:55.880');

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `id` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `vendorId` varchar(191) NOT NULL,
  `productId` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `lastMessageAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`id`, `customerId`, `vendorId`, `productId`, `createdAt`, `lastMessageAt`) VALUES
('cmskz00240001vqy0upglrqfr', 'cmrwcwo180000vqssjgi0l3b0', 'cmrwd2i300003vqss6q5158km', 'cmsarp7pz0005vqj4g6f0dxcj', '2026-08-08 22:53:45.677', '2026-08-08 22:57:12.168'),
('cmskz59we000dvqy03po1cja8', 'cmrwcwo180000vqssjgi0l3b0', 'cms0q2ezf0002vqnor6iixfhp', 'cmsarxzfj0009vqj4d1aoo8nh', '2026-08-08 22:57:51.711', '2026-08-08 22:58:03.363');

-- --------------------------------------------------------

--
-- Table structure for table `coupon`
--

CREATE TABLE `coupon` (
  `id` varchar(191) NOT NULL,
  `vendorId` varchar(191) NOT NULL,
  `code` varchar(191) NOT NULL,
  `title` varchar(191) NOT NULL,
  `type` enum('PERCENTAGE','FIXED','FREE_SHIPPING') NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `scope` enum('STORE_WIDE','SPECIFIC_PRODUCTS') NOT NULL DEFAULT 'STORE_WIDE',
  `minSpend` decimal(10,2) DEFAULT NULL,
  `maxDiscount` decimal(10,2) DEFAULT NULL,
  `usageLimit` int(11) DEFAULT NULL,
  `usageLimitPerUser` int(11) DEFAULT NULL,
  `usedCount` int(11) NOT NULL DEFAULT 0,
  `startsAt` datetime(3) NOT NULL,
  `expiresAt` datetime(3) NOT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `coupon`
--

INSERT INTO `coupon` (`id`, `vendorId`, `code`, `title`, `type`, `value`, `scope`, `minSpend`, `maxDiscount`, `usageLimit`, `usageLimitPerUser`, `usedCount`, `startsAt`, `expiresAt`, `isActive`, `createdAt`, `updatedAt`) VALUES
('cms98zgu70001vqrweosimami', 'cms0wv2u10002vqhgr3gc2c6u', 'DEMO25', '25 Percent Off', 'PERCENTAGE', 25.00, 'STORE_WIDE', NULL, NULL, 100, NULL, 12, '2026-07-29 18:00:02.813', '2026-08-30 18:00:02.813', 1, '2026-07-31 18:00:02.815', '2026-07-31 18:00:02.815'),
('cms98zgua0003vqrwzhql9e1t', 'cms0wv2u10002vqhgr3gc2c6u', 'DEMOSOON', 'Launch Fixed Deal', 'FIXED', 5.00, 'STORE_WIDE', NULL, NULL, NULL, NULL, 0, '2026-08-03 18:00:02.817', '2026-08-20 18:00:02.817', 1, '2026-07-31 18:00:02.818', '2026-07-31 18:00:02.818'),
('cms99rime0001vqd84qu1hmj6', 'cmrwd2i300003vqss6q5158km', 'HAPPY26', 'Hot Sale', 'FIXED', 20.00, 'STORE_WIDE', 2.00, NULL, NULL, 1, 0, '2026-08-01 00:00:00.000', '2026-08-31 23:59:59.999', 1, '2026-07-31 18:21:51.494', '2026-08-02 21:09:44.693');

-- --------------------------------------------------------

--
-- Table structure for table `couponproduct`
--

CREATE TABLE `couponproduct` (
  `couponId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `message`
--

CREATE TABLE `message` (
  `id` varchar(191) NOT NULL,
  `conversationId` varchar(191) NOT NULL,
  `senderRole` enum('CUSTOMER','VENDOR') NOT NULL,
  `text` text DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `readAt` datetime(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `message`
--

INSERT INTO `message` (`id`, `conversationId`, `senderRole`, `text`, `image`, `createdAt`, `readAt`) VALUES
('cmskz10z60003vqy06aw1wugs', 'cmskz00240001vqy0upglrqfr', 'CUSTOMER', 'HI Nayamee', NULL, '2026-08-08 22:54:33.522', '2026-08-08 22:54:53.631'),
('cmskz2b520005vqy0402s5tm7', 'cmskz00240001vqy0upglrqfr', 'VENDOR', 'HI how i can help you?', NULL, '2026-08-08 22:55:33.351', '2026-08-08 22:55:41.338'),
('cmskz38ju0007vqy0iht4fnea', 'cmskz00240001vqy0upglrqfr', 'CUSTOMER', NULL, '/uploads/chat/b0250252-f6ba-4b78-8100-cf243779834c.jpg', '2026-08-08 22:56:16.651', '2026-08-08 22:56:21.666'),
('cmskz3qqx0009vqy0yjcc257b', 'cmskz00240001vqy0upglrqfr', 'VENDOR', 'Yes nice pic', NULL, '2026-08-08 22:56:40.233', '2026-08-08 22:56:46.412'),
('cmskz4fe2000bvqy0lpqe7ptr', 'cmskz00240001vqy0upglrqfr', 'CUSTOMER', 'I want to know about apple 16', NULL, '2026-08-08 22:57:12.170', '2026-08-08 22:57:18.091'),
('cmskz5iw6000fvqy033xczpyo', 'cmskz59we000dvqy03po1cja8', 'CUSTOMER', 'HI Arabika', NULL, '2026-08-08 22:58:03.366', '2026-08-08 22:58:23.778');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `id` varchar(191) NOT NULL,
  `orderNumber` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `shipName` varchar(191) NOT NULL,
  `shipEmail` varchar(191) NOT NULL,
  `shipPhone` varchar(191) NOT NULL,
  `shipCountry` varchar(191) NOT NULL,
  `shipCity` varchar(191) NOT NULL,
  `shipZip` varchar(191) NOT NULL,
  `shipAddress` text NOT NULL,
  `billName` varchar(191) DEFAULT NULL,
  `billEmail` varchar(191) DEFAULT NULL,
  `billPhone` varchar(191) DEFAULT NULL,
  `billCountry` varchar(191) DEFAULT NULL,
  `billCity` varchar(191) DEFAULT NULL,
  `billZip` varchar(191) DEFAULT NULL,
  `billAddress` text DEFAULT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `tax` decimal(10,2) NOT NULL DEFAULT 0.00,
  `shipping` decimal(10,2) NOT NULL DEFAULT 0.00,
  `grandTotal` decimal(10,2) NOT NULL,
  `shippingMethod` varchar(191) DEFAULT NULL,
  `paymentMethod` enum('COD','STRIPE') NOT NULL DEFAULT 'COD',
  `paymentStatus` enum('UNPAID','PAID','REFUNDED') NOT NULL DEFAULT 'UNPAID',
  `status` enum('PENDING','CONFIRMED','PACKAGING','OUT_FOR_DELIVERY','DELIVERED','CANCELED','RETURNED','FAILED_TO_DELIVER') NOT NULL DEFAULT 'PENDING',
  `note` text DEFAULT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `hiddenAt` datetime(3) DEFAULT NULL,
  `stripePaymentIntentId` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`id`, `orderNumber`, `customerId`, `shipName`, `shipEmail`, `shipPhone`, `shipCountry`, `shipCity`, `shipZip`, `shipAddress`, `billName`, `billEmail`, `billPhone`, `billCountry`, `billCity`, `billZip`, `billAddress`, `subtotal`, `discount`, `tax`, `shipping`, `grandTotal`, `shippingMethod`, `paymentMethod`, `paymentStatus`, `status`, `note`, `createdAt`, `updatedAt`, `hiddenAt`, `stripePaymentIntentId`) VALUES
('cmsccrlc20001vqygwvrm4p2i', 'CVT-RRUPHN', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi User', 'user@gmail.com', '343434', 'United States', 'New York', '3243434', 'Adreess usa road:3434', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 470.00, 0.00, 70.50, 0.00, 540.50, 'standard', 'COD', 'PAID', 'PENDING', NULL, '2026-08-02 22:09:12.387', '2026-08-05 20:29:04.345', NULL, NULL),
('cmsi1ahq40001vq8oj00bl5qp', 'CVT-SEVZDF', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'New Yourk', '343434', 'Dilli 2h32 32/32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 460.00, 0.00, 69.00, 0.00, 529.00, 'standard', 'COD', 'UNPAID', 'PENDING', NULL, '2026-08-06 21:34:35.814', '2026-08-06 21:34:35.814', NULL, NULL),
('cmsm8sai10001vqesjjmtoq9w', 'CVT-K42RD3', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'New York', '3434', 'New York DC Ho32/4', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 200.00, 0.00, 30.00, 0.00, 230.00, 'standard', 'STRIPE', 'UNPAID', 'PENDING', NULL, '2026-08-09 20:15:28.297', '2026-08-09 20:15:28.840', NULL, 'pi_3U2d82GAwoXiNtjJ0SyBfXtv'),
('cmsm9k6yp0001vqh8ui2iygx0', 'CVT-UDYVVZ', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'New York', '2323', 'New York dc l3d/34', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 200.00, 0.00, 30.00, 0.00, 230.00, 'standard', 'STRIPE', 'PAID', 'PENDING', NULL, '2026-08-09 20:37:10.082', '2026-08-09 21:04:48.286', NULL, 'pi_3U2dT2GAwoXiNtjJ149usD4I'),
('cmsmayjqm0001vq3smpgo7jx9', 'CVT-FZATXN', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'New York', '2323', 'New York 3434', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 940.00, 0.00, 141.00, 0.00, 1081.00, 'standard', 'STRIPE', 'PAID', 'PENDING', NULL, '2026-08-09 21:16:19.439', '2026-08-09 21:28:19.837', NULL, 'pi_3U2e4vGAwoXiNtjJ1UsE5mr7'),
('cmsmc3jxo0001vq6gbw1s4meg', 'CVT-EKHNJR', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'New York', '3434', 'New York dfdsfsd23 32', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 940.00, 0.00, 141.00, 0.00, 1081.00, 'standard', 'STRIPE', 'PAID', 'PENDING', NULL, '2026-08-09 21:48:12.589', '2026-08-09 21:48:14.672', NULL, 'pi_3U2eZmGAwoXiNtjJ1dMy1yZn'),
('cmsmduai00002vqgkqvofz6u0', 'CVT-JBLDMP', 'cmsmdt9rl0000vqgkdy3midy9', 'test', 'test@gmail.com', '3434343443', 'United States', 'dsfdsf', '2323', 'sdfsdaf', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 470.00, 0.00, 70.50, 0.00, 540.50, 'standard', 'STRIPE', 'PAID', 'PENDING', NULL, '2026-08-09 22:36:59.688', '2026-08-09 22:37:01.809', NULL, 'pi_3U2fKzGAwoXiNtjJ0YYzLfIL'),
('cmsme7m9x0001vq6w3630ipsx', 'CVT-Q7JZBH', 'cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '434343434', 'United States', 'Dili', '3434', 'dilli h2 32h', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1410.00, 0.00, 211.50, 0.00, 1621.50, 'standard', 'STRIPE', 'PAID', 'PENDING', NULL, '2026-08-09 22:47:21.477', '2026-08-09 22:47:24.079', NULL, 'pi_3U2fV1GAwoXiNtjJ0zUQr56R');

-- --------------------------------------------------------

--
-- Table structure for table `orderitem`
--

CREATE TABLE `orderitem` (
  `id` varchar(191) NOT NULL,
  `subOrderId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `variationId` varchar(191) DEFAULT NULL,
  `productName` varchar(191) NOT NULL,
  `variantLabel` varchar(191) DEFAULT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `qty` int(11) NOT NULL,
  `lineTotal` decimal(10,2) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orderitem`
--

INSERT INTO `orderitem` (`id`, `subOrderId`, `productId`, `variationId`, `productName`, `variantLabel`, `unitPrice`, `qty`, `lineTotal`, `createdAt`) VALUES
('cmsccrlc30005vqygu3ccrfhd', 'cmsccrlc20003vqygiqk7eqcn', 'cmsarp7pz0005vqj4g6f0dxcj', NULL, 'Apple iPhone 16 (Pink, 128 GB)', NULL, 470.00, 1, 470.00, '2026-08-02 22:09:12.387'),
('cmsi1ahq50005vq8o4skbn2w8', 'cmsi1ahq40003vq8o8mlgayrc', 'cmsarxzfj0009vqj4d1aoo8nh', 'cmsarxzfj000avqj4480yxtka', 'Ghar Soaps Magic Face wash', 'Size: 100ml', 230.00, 2, 460.00, '2026-08-06 21:34:35.814'),
('cmsm8sai10005vqesndhvi9zn', 'cmsm8sai10003vqes9zvuq9bu', 'cmsarmyem0001vqj4nm32h9fv', 'cmsarmyem0002vqj4yxm9n1f5', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', 'Color: blue', 200.00, 1, 200.00, '2026-08-09 20:15:28.297'),
('cmsm9k6yq0005vqh8zmemozfb', 'cmsm9k6yp0003vqh8fo31o08b', 'cmsarmyem0001vqj4nm32h9fv', 'cmsarmyem0003vqj47h2g8yiq', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', 'Color: red', 200.00, 1, 200.00, '2026-08-09 20:37:10.082'),
('cmsmayjqn0005vq3s6jibe7fu', 'cmsmayjqm0003vq3sxam70znx', 'cmsarp7pz0005vqj4g6f0dxcj', NULL, 'Apple iPhone 16 (Pink, 128 GB)', NULL, 470.00, 2, 940.00, '2026-08-09 21:16:19.439'),
('cmsmc3jxp0005vq6gape3fanf', 'cmsmc3jxo0003vq6gy0i6ja6d', 'cmsarp7pz0005vqj4g6f0dxcj', NULL, 'Apple iPhone 16 (Pink, 128 GB)', NULL, 470.00, 2, 940.00, '2026-08-09 21:48:12.589'),
('cmsmduai00006vqgkv5zeimxp', 'cmsmduai00004vqgkik2dkjvk', 'cmsarp7pz0005vqj4g6f0dxcj', NULL, 'Apple iPhone 16 (Pink, 128 GB)', NULL, 470.00, 1, 470.00, '2026-08-09 22:36:59.688'),
('cmsme7m9x0005vq6whbdysxtv', 'cmsme7m9x0003vq6wqfb9gn0l', 'cmsarp7pz0005vqj4g6f0dxcj', NULL, 'Apple iPhone 16 (Pink, 128 GB)', NULL, 470.00, 3, 1410.00, '2026-08-09 22:47:21.477');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` varchar(191) NOT NULL,
  `vendorId` varchar(191) NOT NULL,
  `brandId` varchar(191) DEFAULT NULL,
  `categoryId` varchar(191) NOT NULL,
  `subCategoryId` varchar(191) DEFAULT NULL,
  `subSubCategoryId` varchar(191) DEFAULT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `shortDescription` text DEFAULT NULL,
  `description` text NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `compareAtPrice` decimal(10,2) DEFAULT NULL,
  `discount` decimal(10,2) DEFAULT NULL,
  `discountType` enum('AMOUNT','PERCENT') NOT NULL DEFAULT 'AMOUNT',
  `taxRate` decimal(5,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `thumbnail` varchar(191) DEFAULT NULL,
  `gallery` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`gallery`)),
  `metaTitle` varchar(191) DEFAULT NULL,
  `metaDescription` text DEFAULT NULL,
  `approvalStatus` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `isActive` tinyint(1) NOT NULL DEFAULT 1,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `isFeatured` tinyint(1) NOT NULL DEFAULT 0,
  `isPopular` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`id`, `vendorId`, `brandId`, `categoryId`, `subCategoryId`, `subSubCategoryId`, `name`, `slug`, `sku`, `shortDescription`, `description`, `price`, `compareAtPrice`, `discount`, `discountType`, `taxRate`, `stock`, `thumbnail`, `gallery`, `metaTitle`, `metaDescription`, `approvalStatus`, `isActive`, `createdAt`, `updatedAt`, `isFeatured`, `isPopular`) VALUES
('cms3ubg8m003nvqlcucocsyg3', 'cmrwd2i300003vqss6q5158km', 'cmrxwv54q0002vqlkkwcdrobl', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8q520008vqlckgikj5i5', 'cms3sdoez001avqlc96jy8rle', 'NKS TEX Men Graphic Print Round Neck', 'nks-tex-men-graphic-print-round-neck', 'T2323', 'NKS TEX Men Graphic Print Round Neck Pure Cotton Black T-Shirt', 'Black T-shirt made from high quality cotton fabric, this T-shirt ensures a soft feel on the skin while providing excellent breathability for all day wear.it perfect for casual outings, college wear, or daily use.', 120.00, 125.00, 20.00, 'AMOUNT', NULL, 0, '/uploads/products/906298e2-f31e-4a82-982e-e02495582204.webp', '[\"/uploads/products/4ed424c2-1782-43fe-aba9-94a69a82d64c.webp\",\"/uploads/products/722b145c-0ecc-496b-be3a-f59851dd09d7.webp\",\"/uploads/products/c33334a8-571a-411f-b819-e5b0a499db34.webp\"]', 'NKS TEX Men Graphic Print Round Neck', 'Black T-shirt made from high quality cotton fabric, this T-shirt ensures a soft feel on the skin while providing excellent breathability for all day wear.it perfect for casual outings, college wear, or daily use.', 'APPROVED', 1, '2026-07-27 23:10:36.790', '2026-08-01 21:47:12.943', 1, 0),
('cms3utcsn0001vqx89lnachts', 'cmrwd2i300003vqss6q5158km', 'cmrxwv54q0002vqlkkwcdrobl', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s97m4000cvqlcwhbcv8lh', 'cms3sfcis001mvqlcd6srapgi', 'Devastri Women Fit and Flare Orange', 'devastri-women-fit-and-flare-orange', 'K333', 'Devastri Women Fit and Flare Orange Midi/Calf Length Dress', 'This women’s cotton printed fit & flare midi dress is designed for everyday comfort and BJ9effortless style. Crafted from soft and breathable cotton fabric, this dress offers a relaxed yet flattering fit that suits all body types. The elegant printed design and midi length make it perfect for daily wear, office use, casual outings, and summer styling. Easy to maintain and comfortable for long hours, this dress is a must-have addition to every modern woman’s wardrobe.::Premium quality', 120.00, 125.00, 10.00, 'AMOUNT', NULL, 0, '/uploads/products/397f06b1-90e1-4f50-8342-74b85225c020.webp', '[\"/uploads/products/1e02499f-8401-453c-b831-374a287d3349.webp\",\"/uploads/products/632987f0-7543-4e49-a4d3-a0b92280342b.webp\"]', 'Devastri Women Fit and Flare Orange', 'Devastri Women Fit and Flare Orange Devastri Women Fit and Flare Orange', 'APPROVED', 1, '2026-07-27 23:24:32.135', '2026-08-04 20:03:04.484', 1, 0),
('cmsarmyem0001vqj4nm32h9fv', 'cmrwd2i300003vqss6q5158km', 'cmrxwuvpt0001vqlk8tb5p4x3', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9vdz000ivqlc77ayu8mt', 'cms3shpag0020vqlc9cfuxui2', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', 'vivo-t5x-5g-cyber-green-256-gb-8-gb-ram', 'v344', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', '8 GB RAM | 256 GB ROM \r\nDimensity 7400-Turbo | Octa Core Processor | 2.6 GHz Clock Speed\r\n50MP + 2MP Rear Camera\r\n32MP Front Camera\r\n6.76 inch\r\n7200 mAh Battery', 200.00, NULL, 20.00, 'AMOUNT', NULL, 0, '/uploads/products/93493042-18b4-423e-b071-9d0c786fa06c.webp', '[\"/uploads/products/c4b5bf8d-7ca4-4c06-84fa-9c455770ce9c.webp\",\"/uploads/products/0aa53dc5-961d-44e3-8cad-1ceca01c07a4.webp\"]', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', 'vivo T5x 5G (Cyber Green, 256 GB) (8 GB RAM)', 'APPROVED', 1, '2026-08-01 19:29:57.916', '2026-08-01 19:46:08.919', 0, 0),
('cmsarp7pz0005vqj4g6f0dxcj', 'cmrwd2i300003vqss6q5158km', 'cmrxwuvpt0001vqlk8tb5p4x3', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9ob2000gvqlcc2q9n38t', 'cms3shf7u001yvqlcii1cdzzd', 'Apple iPhone 16 (Pink, 128 GB)', 'apple-iphone-16-pink-128-gb', 'I3434', 'Apple iPhone 16 (Pink, 128 GB)', '128 GB ROM\r\nStore upto 3000 photos\r\nA18 Chip, 6 Core Processor | Hexa Core\r\nSuperfast Multitasking. Extensive Gaming\r\n48MP + 12MP Rear Camera\r\nDSLR Like Pictures & Great Zoom\r\n12MP Front Camera\r\nHigh-Res Selfies Even in Low Light\r\n6.1 inch All Screen OLED Display\r\nCinematic Display. Sharpest Colours', 500.00, NULL, 30.00, 'AMOUNT', NULL, 41, '/uploads/products/ab7014c6-f662-4219-b43d-5bfcf8e83c2e.webp', '[\"/uploads/products/353f5a25-2b65-41ce-80a1-db39efd7faef.webp\",\"/uploads/products/a7ae3263-1ec4-4bb8-a4ae-2efec0bb6956.webp\"]', 'Apple iPhone 16 (Pink, 128 GB)', 'Apple iPhone 16 (Pink, 128 GB)', 'APPROVED', 1, '2026-08-01 19:31:43.319', '2026-08-09 22:47:21.474', 0, 0),
('cmsarue0b0007vqj4f79hznew', 'cms0q2ezf0002vqnor6iixfhp', 'cmrxwv54q0002vqlkkwcdrobl', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sba7d000svqlcwatnlcgz', 'cms3sn3qj002mvqlcs34nwy2t', 'PERSONAL TOUCH SKINCARE Melakey', 'personal-touch-skincare-melakey', 'B3434', 'PERSONAL TOUCH SKINCARE Melakey - For Hyper Pigmentation & Melasma Face Cream (20 g)', 'Melakey Radiance Cream is made for busy millennials who want clear, even-toned skin without the hassle. A powerful yet gentle night cream that targets hyperpigmentation, melasma, dark spots, dullness, and uneven skin tone — including neck darkening — while you sleep. At the core is a dual-acid brightening system: 5% Tranexamic Acid blocks pigmentation-triggering inflammation at the source, while 5% Azelaic Acid prevents redness and controls melanin overproduction. Together they visibly reduce both existing and future dark spots — even stubborn melasma patches. 3% Glycolic Acid gently exfoliates dead skin cells, accelerating cell renewal for a smoother, brighter complexion. Tyrostat™-09, sourced from the Northern Canadian Prairies, further controls excess pigmentation and restores natural glow. Alpha-Arbutin, Kojic Dipalmitate, and Mulberry Extract work together to slow melanin production and shield skin from UV-triggered darkening.', 130.00, NULL, NULL, 'AMOUNT', NULL, 20, '/uploads/products/f2bb8c72-8a0f-4099-a643-70a2e50f0683.webp', '[\"/uploads/products/e215f340-4812-4387-9353-351d050fc964.webp\",\"/uploads/products/8204a9e0-8397-47ab-a8a8-265f9add333c.webp\"]', 'PERSONAL TOUCH SKINCARE Melakey', 'PERSONAL TOUCH SKINCARE Melakey', 'APPROVED', 1, '2026-08-01 19:35:44.747', '2026-08-02 21:09:44.689', 0, 0),
('cmsarxzfj0009vqj4d1aoo8nh', 'cms0q2ezf0002vqnor6iixfhp', NULL, 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sb3fm000qvqlcqls1ldkk', 'cms3smpvi002ivqlcn55g1tgx', 'Ghar Soaps Magic Face wash', 'ghar-soaps-magic-face-wash', NULL, 'Tan Removal, Skin Brightening & Radiant Glow Face Wash (100 ml)', 'Gel\r\nApplied For\r\nTan Removal, Radiance & Glow, Skin Brightening, Uneven Skin Tone, Cleansing, Anti-dullness', 300.00, NULL, 10.00, 'AMOUNT', NULL, 0, '/uploads/products/7e514505-1f19-4172-ad7b-ea129fe6fb07.webp', '[\"/uploads/products/664a73f4-4166-4a6f-b572-0eceb892a7a6.webp\",\"/uploads/products/1cd784e4-2d5f-4b8f-80d5-7b06c06d558b.webp\"]', 'Ghar Soaps Magic Face wash', 'Ghar Soaps Magic Face wash', 'APPROVED', 1, '2026-08-01 19:38:32.480', '2026-08-01 19:43:17.290', 1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `productvariation`
--

CREATE TABLE `productvariation` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `sku` varchar(191) DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `image` varchar(191) DEFAULT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`attributes`)),
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `productvariation`
--

INSERT INTO `productvariation` (`id`, `productId`, `name`, `sku`, `price`, `stock`, `image`, `attributes`, `createdAt`, `updatedAt`) VALUES
('cms3ubg8m003ovqlc7lrcxzps', 'cms3ubg8m003nvqlcucocsyg3', 'L', NULL, 110.00, 0, NULL, '{\"Size\":\"L\"}', '2026-07-27 23:10:36.790', '2026-07-27 23:10:36.790'),
('cms3ubg8m003pvqlcvirw63xk', 'cms3ubg8m003nvqlcucocsyg3', 'S', NULL, 120.00, 0, NULL, '{\"Size\":\"S\"}', '2026-07-27 23:10:36.790', '2026-07-27 23:10:36.790'),
('cms3ubg8m003qvqlcun44jqns', 'cms3ubg8m003nvqlcucocsyg3', 'M', NULL, 125.00, 0, NULL, '{\"Size\":\"M\"}', '2026-07-27 23:10:36.790', '2026-07-27 23:10:36.790'),
('cms3utcsn0002vqx8lhgmmxmh', 'cms3utcsn0001vqx89lnachts', 'Red / L', NULL, 120.00, 5, NULL, '{\"Color\":\"Red\",\"Size\":\"L\"}', '2026-07-27 23:24:32.135', '2026-08-02 21:09:44.691'),
('cms3utcsn0003vqx8fyoqzamc', 'cms3utcsn0001vqx89lnachts', 'Red / S', NULL, 120.00, 5, NULL, '{\"Color\":\"Red\",\"Size\":\"S\"}', '2026-07-27 23:24:32.135', '2026-07-27 23:24:32.135'),
('cms3utcsn0004vqx85fvjm6rj', 'cms3utcsn0001vqx89lnachts', 'Blue / L', NULL, 120.00, 10, NULL, '{\"Color\":\"Blue\",\"Size\":\"L\"}', '2026-07-27 23:24:32.135', '2026-07-27 23:24:32.135'),
('cms3utcsn0005vqx8enkqum1o', 'cms3utcsn0001vqx89lnachts', 'Blue / S', NULL, 120.00, 10, NULL, '{\"Color\":\"Blue\",\"Size\":\"S\"}', '2026-07-27 23:24:32.135', '2026-07-27 23:24:32.135'),
('cmsarmyem0002vqj4yxm9n1f5', 'cmsarmyem0001vqj4nm32h9fv', 'blue', NULL, 200.00, 19, NULL, '{\"Color\":\"blue\"}', '2026-08-01 19:29:57.916', '2026-08-09 20:15:28.263'),
('cmsarmyem0003vqj47h2g8yiq', 'cmsarmyem0001vqj4nm32h9fv', 'red', NULL, 200.00, 19, NULL, '{\"Color\":\"red\"}', '2026-08-01 19:29:57.916', '2026-08-09 20:37:10.079'),
('cmsarxzfj000avqj4480yxtka', 'cmsarxzfj0009vqj4d1aoo8nh', '100ml', NULL, 230.00, 15, NULL, '{\"Size\":\"100ml\"}', '2026-08-01 19:38:32.480', '2026-08-09 21:09:50.404'),
('cmsarxzfj000bvqj4jn2fbcme', 'cmsarxzfj0009vqj4d1aoo8nh', '200ml', NULL, 300.00, 30, NULL, '{\"Size\":\"200ml\"}', '2026-08-01 19:38:32.480', '2026-08-01 19:38:32.480');

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `id` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `orderItemId` varchar(191) NOT NULL,
  `rating` int(11) NOT NULL,
  `title` varchar(191) DEFAULT NULL,
  `comment` text NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `status` enum('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `isVisible` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`id`, `productId`, `customerId`, `orderItemId`, `rating`, `title`, `comment`, `images`, `status`, `createdAt`, `isVisible`) VALUES
('cmsgkehm60001vqv80kjmbl4k', 'cmsarp7pz0005vqj4g6f0dxcj', 'cmrwcwo180000vqssjgi0l3b0', 'cmsccrlc30005vqygu3ccrfhd', 5, 'This Product good', 'This seller is very good.', NULL, 'APPROVED', '2026-08-05 20:54:02.645', 1);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` varchar(191) NOT NULL,
  `sessionToken` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `subcategory`
--

CREATE TABLE `subcategory` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subcategory`
--

INSERT INTO `subcategory` (`id`, `name`, `slug`, `categoryId`, `createdAt`, `updatedAt`) VALUES
('cms3s8q520008vqlckgikj5i5', 'T-shirt', 't-shirt', 'cms3s6fkz0000vqlcr9rrhx3e', '2026-07-27 22:12:30.422', '2026-07-27 22:12:30.422'),
('cms3s8z7h000avqlcwjry92l8', 'Watches', 'watches', 'cms3s6fkz0000vqlcr9rrhx3e', '2026-07-27 22:12:42.173', '2026-07-27 22:12:42.173'),
('cms3s97m4000cvqlcwhbcv8lh', 'Kurtis', 'kurtis', 'cms3s6fkz0000vqlcr9rrhx3e', '2026-07-27 22:12:53.068', '2026-07-27 22:12:53.068'),
('cms3s9e09000evqlclo4aup5t', 'Sarees', 'sarees', 'cms3s6fkz0000vqlcr9rrhx3e', '2026-07-27 22:13:01.353', '2026-07-27 22:13:01.353'),
('cms3s9ob2000gvqlcc2q9n38t', 'iPhone', 'iphone', 'cms3s6qhs0001vqlc7mcf3zvk', '2026-07-27 22:13:14.702', '2026-07-27 22:13:14.702'),
('cms3s9vdz000ivqlc77ayu8mt', 'Vivo', 'vivo', 'cms3s6qhs0001vqlc7mcf3zvk', '2026-07-27 22:13:23.879', '2026-07-27 22:13:23.879'),
('cms3sa90l000kvqlcpehfuqlo', 'Earphones', 'earphones', 'cms3s6zpk0002vqlc1ud9p8zh', '2026-07-27 22:13:41.542', '2026-07-27 22:13:41.542'),
('cms3sah9d000mvqlce0iat9bf', 'Two Wheelers', 'two-wheelers', 'cms3s6zpk0002vqlc1ud9p8zh', '2026-07-27 22:13:52.225', '2026-07-27 22:13:52.225'),
('cms3saq67000ovqlc94ttkfp2', 'Speakers', 'speakers', 'cms3s6zpk0002vqlc1ud9p8zh', '2026-07-27 22:14:03.775', '2026-07-27 22:14:03.775'),
('cms3sb3fm000qvqlcqls1ldkk', 'Makeup', 'makeup', 'cms3s7bjd0003vqlcq7gge6zj', '2026-07-27 22:14:20.963', '2026-07-27 22:14:20.963'),
('cms3sba7d000svqlcwatnlcgz', 'Skin Care', 'skin-care', 'cms3s7bjd0003vqlcq7gge6zj', '2026-07-27 22:14:29.737', '2026-07-27 22:14:29.737'),
('cms3sbg5b000uvqlci3pp0ad2', 'Hair Care', 'hair-care', 'cms3s7bjd0003vqlcq7gge6zj', '2026-07-27 22:14:37.440', '2026-07-27 22:14:37.440'),
('cms3sbrq4000wvqlcigg9bu4c', 'Hardware', 'hardware', 'cms3s7kr90004vqlca7cltcgz', '2026-07-27 22:14:52.445', '2026-07-27 22:14:52.445'),
('cms3sc23v000yvqlcpvwuusci', 'Bathroom', 'bathroom', 'cms3s7kr90004vqlca7cltcgz', '2026-07-27 22:15:05.899', '2026-07-27 22:15:05.899'),
('cms3sc8hb0010vqlc2ljkz0yq', 'Decor', 'decor', 'cms3s7kr90004vqlca7cltcgz', '2026-07-27 22:15:14.160', '2026-07-27 22:15:14.160'),
('cms3scgyz0012vqlc8lohlp9s', 'Chairs', 'chairs', 'cms3s7sca0005vqlc755k97bz', '2026-07-27 22:15:25.163', '2026-07-27 22:15:25.163'),
('cms3scnyk0014vqlc8i39renv', 'Tables', 'tables', 'cms3s7sca0005vqlc755k97bz', '2026-07-27 22:15:34.221', '2026-07-27 22:15:34.221'),
('cms3scuc40016vqlcwrqze8bo', 'Cricket', 'cricket', 'cms3s7zhk0006vqlcjn53mpq0', '2026-07-27 22:15:42.484', '2026-07-27 22:15:42.484'),
('cms3sd0440018vqlc9mm9znt7', 'Yoga', 'yoga', 'cms3s7zhk0006vqlcjn53mpq0', '2026-07-27 22:15:49.972', '2026-07-27 22:15:49.972');

-- --------------------------------------------------------

--
-- Table structure for table `suborder`
--

CREATE TABLE `suborder` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `vendorId` varchar(191) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `discount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `total` decimal(10,2) NOT NULL,
  `couponId` varchar(191) DEFAULT NULL,
  `status` enum('PENDING','CONFIRMED','PACKAGING','OUT_FOR_DELIVERY','DELIVERED','CANCELED','RETURNED','FAILED_TO_DELIVER') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `paidAt` datetime(3) DEFAULT NULL,
  `paymentStatus` enum('UNPAID','PAID','REFUNDED') NOT NULL DEFAULT 'UNPAID'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `suborder`
--

INSERT INTO `suborder` (`id`, `orderId`, `vendorId`, `subtotal`, `discount`, `total`, `couponId`, `status`, `createdAt`, `updatedAt`, `paidAt`, `paymentStatus`) VALUES
('cmsccrlc20003vqygiqk7eqcn', 'cmsccrlc20001vqygwvrm4p2i', 'cmrwd2i300003vqss6q5158km', 470.00, 0.00, 470.00, NULL, 'DELIVERED', '2026-08-02 22:09:12.387', '2026-08-05 20:29:04.261', '2026-08-05 20:29:04.259', 'PAID'),
('cmsi1ahq40003vq8o8mlgayrc', 'cmsi1ahq40001vq8oj00bl5qp', 'cms0q2ezf0002vqnor6iixfhp', 460.00, 0.00, 460.00, NULL, 'PENDING', '2026-08-06 21:34:35.814', '2026-08-06 21:34:35.814', NULL, 'UNPAID'),
('cmsm8sai10003vqes9zvuq9bu', 'cmsm8sai10001vqesjjmtoq9w', 'cmrwd2i300003vqss6q5158km', 200.00, 0.00, 200.00, NULL, 'PENDING', '2026-08-09 20:15:28.297', '2026-08-09 20:15:28.297', NULL, 'UNPAID'),
('cmsm9k6yp0003vqh8fo31o08b', 'cmsm9k6yp0001vqh8ui2iygx0', 'cmrwd2i300003vqss6q5158km', 200.00, 0.00, 200.00, NULL, 'PENDING', '2026-08-09 20:37:10.082', '2026-08-09 21:04:48.344', '2026-08-09 21:04:48.338', 'PAID'),
('cmsmayjqm0003vq3sxam70znx', 'cmsmayjqm0001vq3smpgo7jx9', 'cmrwd2i300003vqss6q5158km', 940.00, 0.00, 940.00, NULL, 'PENDING', '2026-08-09 21:16:19.439', '2026-08-09 21:28:19.842', '2026-08-09 21:28:19.839', 'PAID'),
('cmsmc3jxo0003vq6gy0i6ja6d', 'cmsmc3jxo0001vq6gbw1s4meg', 'cmrwd2i300003vqss6q5158km', 940.00, 0.00, 940.00, NULL, 'PENDING', '2026-08-09 21:48:12.589', '2026-08-09 21:48:14.675', '2026-08-09 21:48:14.673', 'PAID'),
('cmsmduai00004vqgkik2dkjvk', 'cmsmduai00002vqgkqvofz6u0', 'cmrwd2i300003vqss6q5158km', 470.00, 0.00, 470.00, NULL, 'PENDING', '2026-08-09 22:36:59.688', '2026-08-09 22:37:01.812', '2026-08-09 22:37:01.810', 'PAID'),
('cmsme7m9x0003vq6wqfb9gn0l', 'cmsme7m9x0001vq6w3630ipsx', 'cmrwd2i300003vqss6q5158km', 1410.00, 0.00, 1410.00, NULL, 'PENDING', '2026-08-09 22:47:21.477', '2026-08-09 22:47:24.087', '2026-08-09 22:47:24.083', 'PAID');

-- --------------------------------------------------------

--
-- Table structure for table `subsubcategory`
--

CREATE TABLE `subsubcategory` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `categoryId` varchar(191) NOT NULL,
  `subCategoryId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `subsubcategory`
--

INSERT INTO `subsubcategory` (`id`, `name`, `slug`, `categoryId`, `subCategoryId`, `createdAt`, `updatedAt`) VALUES
('cms3sdoez001avqlc96jy8rle', 'Mans T-shirt', 'mans-t-shirt', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8q520008vqlckgikj5i5', '2026-07-27 22:16:21.468', '2026-07-27 22:16:21.468'),
('cms3sdy3o001cvqlcfji3v8y5', 'Woman T-shirt', 'woman-t-shirt', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8q520008vqlckgikj5i5', '2026-07-27 22:16:34.020', '2026-07-27 22:16:34.020'),
('cms3se9yi001evqlcwq6unoi1', 'Kids T-shirt', 'kids-t-shirt', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8q520008vqlckgikj5i5', '2026-07-27 22:16:49.386', '2026-07-27 22:16:49.386'),
('cms3semq4001gvqlcf6wu32xg', 'Leather Watch', 'leather-watch', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8z7h000avqlcwjry92l8', '2026-07-27 22:17:05.932', '2026-07-27 22:17:05.932'),
('cms3sev6v001ivqlc27yapac1', 'Mesh Watch', 'mesh-watch', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8z7h000avqlcwjry92l8', '2026-07-27 22:17:16.904', '2026-07-27 22:17:16.904'),
('cms3sf32v001kvqlcwg11xlkf', 'Metal Watch', 'metal-watch', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s8z7h000avqlcwjry92l8', '2026-07-27 22:17:27.128', '2026-07-27 22:17:27.128'),
('cms3sfcis001mvqlcd6srapgi', 'Long Kurtis', 'long-kurtis', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s97m4000cvqlcwhbcv8lh', '2026-07-27 22:17:39.365', '2026-07-27 22:17:39.365'),
('cms3sfjiu001ovqlc4um4sn7u', 'Short Kurtis', 'short-kurtis', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s97m4000cvqlcwhbcv8lh', '2026-07-27 22:17:48.438', '2026-07-27 22:17:48.438'),
('cms3sfujy001qvqlcqbzb11x7', 'Kanjivaram', 'kanjivaram', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s9e09000evqlclo4aup5t', '2026-07-27 22:18:02.734', '2026-07-27 22:18:19.753'),
('cms3sghnf001svqlcnjwq8qvp', 'Silk', 'silk', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s9e09000evqlclo4aup5t', '2026-07-27 22:18:32.667', '2026-07-27 22:18:32.667'),
('cms3sgp56001uvqlcyeonn558', 'Banarashi', 'banarashi', 'cms3s6fkz0000vqlcr9rrhx3e', 'cms3s9e09000evqlclo4aup5t', '2026-07-27 22:18:42.378', '2026-07-27 22:18:42.378'),
('cms3sh7si001wvqlcs2pue1bp', 'iPhone 15', 'iphone-15', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9ob2000gvqlcc2q9n38t', '2026-07-27 22:19:06.547', '2026-07-27 22:19:06.547'),
('cms3shf7u001yvqlcii1cdzzd', 'iPhone 16', 'iphone-16', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9ob2000gvqlcc2q9n38t', '2026-07-27 22:19:16.170', '2026-07-27 22:19:16.170'),
('cms3shpag0020vqlc9cfuxui2', 'vivo t4', 'vivo-t4', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9vdz000ivqlc77ayu8mt', '2026-07-27 22:19:29.224', '2026-07-27 22:19:29.224'),
('cms3shwt20022vqlcj8db5dob', 'vivo t5', 'vivo-t5', 'cms3s6qhs0001vqlc7mcf3zvk', 'cms3s9vdz000ivqlc77ayu8mt', '2026-07-27 22:19:38.966', '2026-07-27 22:19:38.966'),
('cms3sk3xa0024vqlchmhc3ksh', 'Home Entertainment', 'home-entertainment', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3sa90l000kvqlcpehfuqlo', '2026-07-27 22:21:21.502', '2026-07-27 22:21:21.502'),
('cms3skot40026vqlcksl8zo6k', 'Wired', 'wired', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3sa90l000kvqlcpehfuqlo', '2026-07-27 22:21:48.568', '2026-07-27 22:21:48.568'),
('cms3skzpq0028vqlct3axofg7', 'Hero', 'hero', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3sah9d000mvqlce0iat9bf', '2026-07-27 22:22:02.703', '2026-07-27 22:22:02.703'),
('cms3sl9gm002avqlcynwsc5d8', 'TVS', 'tvs', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3sah9d000mvqlce0iat9bf', '2026-07-27 22:22:15.334', '2026-07-27 22:22:15.334'),
('cms3slt19002cvqlcrj4y9atw', 'Soundbars', 'soundbars', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3saq67000ovqlc94ttkfp2', '2026-07-27 22:22:40.701', '2026-07-27 22:22:40.701'),
('cms3sm5dr002evqlctly0h0ya', 'Mobile Speakers', 'mobile-speakers', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3saq67000ovqlc94ttkfp2', '2026-07-27 22:22:56.703', '2026-07-27 22:22:56.703'),
('cms3smgos002gvqlcgdetpllg', 'Smart Speakers', 'smart-speakers', 'cms3s6zpk0002vqlc1ud9p8zh', 'cms3saq67000ovqlc94ttkfp2', '2026-07-27 22:23:11.357', '2026-07-27 22:23:11.357'),
('cms3smpvi002ivqlcn55g1tgx', 'Face Makeup', 'face-makeup', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sb3fm000qvqlcqls1ldkk', '2026-07-27 22:23:23.263', '2026-07-27 22:23:23.263'),
('cms3smw6a002kvqlcvx0btgm2', 'Eye Makeup', 'eye-makeup', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sb3fm000qvqlcqls1ldkk', '2026-07-27 22:23:31.426', '2026-07-27 22:23:31.426'),
('cms3sn3qj002mvqlcs34nwy2t', 'Face Care', 'face-care', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sba7d000svqlcwatnlcgz', '2026-07-27 22:23:41.227', '2026-07-27 22:23:41.227'),
('cms3snaga002ovqlchxrm7ago', 'Serum', 'serum', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sba7d000svqlcwatnlcgz', '2026-07-27 22:23:49.931', '2026-07-27 22:23:49.931'),
('cms3sni4k002qvqlchbhh7xbw', 'Shampoos', 'shampoos', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sbg5b000uvqlci3pp0ad2', '2026-07-27 22:23:59.876', '2026-07-27 22:23:59.876'),
('cms3snq78002svqlcpagxjdlr', 'Conditioners', 'conditioners', 'cms3s7bjd0003vqlcq7gge6zj', 'cms3sbg5b000uvqlci3pp0ad2', '2026-07-27 22:24:10.341', '2026-07-27 22:24:10.341'),
('cms3so1ue002uvqlcjcdc093d', 'Hammer Drills', 'hammer-drills', 'cms3s7kr90004vqlca7cltcgz', 'cms3sbrq4000wvqlcigg9bu4c', '2026-07-27 22:24:25.430', '2026-07-27 22:24:25.430'),
('cms3so8s5002wvqlci7fp9wq8', 'Power Drills', 'power-drills', 'cms3s7kr90004vqlca7cltcgz', 'cms3sbrq4000wvqlcigg9bu4c', '2026-07-27 22:24:34.422', '2026-07-27 22:24:34.422'),
('cms3soihv002yvqlcunqjw582', 'Bathroom Wall Shelf', 'bathroom-wall-shelf', 'cms3s7kr90004vqlca7cltcgz', 'cms3sc23v000yvqlcpvwuusci', '2026-07-27 22:24:47.012', '2026-07-27 22:24:47.012'),
('cms3soq180030vqlcaz4e3efc', 'Wall Collage', 'wall-collage', 'cms3s7kr90004vqlca7cltcgz', 'cms3sc8hb0010vqlc2ljkz0yq', '2026-07-27 22:24:56.781', '2026-07-27 22:24:56.781'),
('cms3sow9q0032vqlc0wqnpvgh', 'Divine Crafts', 'divine-crafts', 'cms3s7kr90004vqlca7cltcgz', 'cms3sc8hb0010vqlc2ljkz0yq', '2026-07-27 22:25:04.863', '2026-07-27 22:25:04.863'),
('cms3sp7040034vqlcfo3bifjs', 'Home Chairs', 'home-chairs', 'cms3s7sca0005vqlc755k97bz', 'cms3scgyz0012vqlc8lohlp9s', '2026-07-27 22:25:18.773', '2026-07-27 22:25:18.773'),
('cms3spf7q0036vqlce77qmrzm', 'Office Chairs', 'office-chairs', 'cms3s7sca0005vqlc755k97bz', 'cms3scgyz0012vqlc8lohlp9s', '2026-07-27 22:25:29.414', '2026-07-27 22:25:29.414'),
('cms3spn0f0038vqlcjetzotwa', 'Home Tables', 'home-tables', 'cms3s7sca0005vqlc755k97bz', 'cms3scnyk0014vqlc8i39renv', '2026-07-27 22:25:39.519', '2026-07-27 22:25:39.519'),
('cms3spw71003avqlcn9r9rvqd', 'Office Tables', 'office-tables', 'cms3s7sca0005vqlc755k97bz', 'cms3scnyk0014vqlc8i39renv', '2026-07-27 22:25:51.421', '2026-07-27 22:25:51.421'),
('cms3sq8a4003cvqlclxxnnkgc', 'Cricket Bat', 'cricket-bat', 'cms3s7zhk0006vqlcjn53mpq0', 'cms3scuc40016vqlcwrqze8bo', '2026-07-27 22:26:07.084', '2026-07-27 22:26:07.084'),
('cms3sqg1n003evqlc06bqutos', 'Cricket Ball', 'cricket-ball', 'cms3s7zhk0006vqlcjn53mpq0', 'cms3scuc40016vqlcwrqze8bo', '2026-07-27 22:26:17.148', '2026-07-27 22:26:17.148'),
('cms3sqrhn003gvqlc68fb9b5p', 'Yoga Mat', 'yoga-mat', 'cms3s7zhk0006vqlcjn53mpq0', 'cms3sd0440018vqlc9mm9znt7', '2026-07-27 22:26:31.980', '2026-07-27 22:26:31.980');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `passwordHash` varchar(191) NOT NULL,
  `phone` varchar(191) DEFAULT NULL,
  `role` enum('CUSTOMER','VENDOR','ADMIN') NOT NULL DEFAULT 'CUSTOMER',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `image` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `name`, `email`, `passwordHash`, `phone`, `role`, `createdAt`, `updatedAt`, `image`) VALUES
('cmrw9uhds0000vqncxwt3hqbr', 'Covet Admin', 'admin@covet.com', '$2b$12$c7blzeRPJOWSxV.J8qaqZuz4yYauQegIGiPGysezm71uBcRSVe612', NULL, 'ADMIN', '2026-07-22 16:03:09.566', '2026-07-22 16:03:09.566', NULL),
('cmrwak8ph0000vqawu9wb7iyy', 'Test Customer', 'test.customer@covet.com', '$2b$12$qsLa9f5p8xQPR8/yfOyXQuy6hz4SX/nmO002kvBBnzoWCT9RRfmHe', NULL, 'CUSTOMER', '2026-07-22 16:23:11.370', '2026-07-22 16:23:11.370', NULL),
('cmrwak9030001vqawxavhz6pw', 'Test Vendor', 'test.vendor.pending@covet.com', '$2b$12$2Ipqzplsi.nMsCeVR0puCOE7KOdzwToCCugjGbjyPOd6BuAlkqa8i', NULL, 'VENDOR', '2026-07-22 16:23:11.763', '2026-07-22 16:23:11.763', NULL),
('cmrwak97v0004vqaw5izne8sl', 'Test Vendor', 'test.vendor.approved@covet.com', '$2b$12$OiTIaDxUwBcDSIhiDQtpmuRDbjadJZ3SUEBWKhCfEBjVnN/kK3SXa', NULL, 'VENDOR', '2026-07-22 16:23:12.044', '2026-07-22 16:23:12.044', NULL),
('cmrwcwo180000vqssjgi0l3b0', 'Kazi1 User', 'user@gmail.com', '$2b$12$z06aJeDmI5HmhD9HJIjuC.FWM/g77xzCJmUuws73WpJqfRjkEleyK', '434343434', 'CUSTOMER', '2026-07-22 17:28:50.330', '2026-08-03 19:39:47.345', '/uploads/users/340f883f-7c12-471e-baf0-dca64a888607.jpg'),
('cmrwd2i2k0001vqssuvdgq9ja', 'Nayamee', 'vendor@gmail.com', '$2b$12$Aylq1wmR1BDtaLKV4S9Fzu/S9fEnikKCCUnTa7GSSJCDTcCuGmlIa', '434343434', 'VENDOR', '2026-07-22 17:33:22.543', '2026-08-01 19:45:44.410', NULL),
('cms0q2ezd0000vqno8jze70la', 'Raju', 'raju@gmail.com', '$2b$12$kUaFoSRRi8Bjr7ThnUNqIebe381cIusAkwaQo2sfykEQQZ2Vi0y7u', '2323232332', 'VENDOR', '2026-07-25 18:48:18.265', '2026-08-01 19:33:46.964', NULL),
('cms0qcv970003vqnovb9a8314', 'John Deo', 'john@gmail.com', '$2b$12$Y6FiAiDtBnXjssFRezkrNuLPL7ZQeoMN7DJUGaFll.LdosNNwJK5C', '34343434', 'VENDOR', '2026-07-25 18:56:25.915', '2026-07-25 18:56:25.915', NULL),
('cms0wv2qz0000vqhg10zr8nkw', 'James Dawson', 'approved.vendor@covet.test', '$2b$12$x3qaBo8V06EGgLvW4akxXOTrYtYCDEgc8j3Emo9OFAM5F5HXHzwfG', '555 018 2245', 'VENDOR', '2026-07-25 21:58:33.114', '2026-07-26 19:50:45.050', NULL),
('cmsmdt9rl0000vqgkdy3midy9', 'test', 'test@gmail.com', '$2b$12$xVBNNJ/JkIAGggSfyrmDdewvYYuw18E435Bsvi2c10As6jElI1./K', NULL, 'CUSTOMER', '2026-08-09 22:36:12.082', '2026-08-09 22:36:12.082', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vendor`
--

CREATE TABLE `vendor` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `storeName` varchar(191) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `status` enum('PENDING','APPROVED','SUSPENDED') NOT NULL DEFAULT 'PENDING',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `updatedAt` datetime(3) NOT NULL,
  `address` varchar(191) DEFAULT NULL,
  `coverImage` varchar(191) DEFAULT NULL,
  `image` varchar(191) DEFAULT NULL,
  `logo` varchar(191) DEFAULT NULL,
  `tinCertificate` varchar(191) DEFAULT NULL,
  `tinExpireDate` datetime(3) DEFAULT NULL,
  `tinNumber` varchar(191) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `vendor`
--

INSERT INTO `vendor` (`id`, `userId`, `storeName`, `slug`, `status`, `createdAt`, `updatedAt`, `address`, `coverImage`, `image`, `logo`, `tinCertificate`, `tinExpireDate`, `tinNumber`) VALUES
('cmrwak97x0006vqawzqv3tq1k', 'cmrwak97v0004vqaw5izne8sl', 'Store APPROVED', 'store-approved', 'APPROVED', '2026-07-22 16:23:12.045', '2026-07-22 16:23:12.045', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
('cmrwd2i300003vqss6q5158km', 'cmrwd2i2k0001vqssuvdgq9ja', 'Nayamee', 'nayamee', 'APPROVED', '2026-07-22 17:33:22.559', '2026-08-01 19:45:44.411', 'New York', '/uploads/vendors/384077ac-291e-4f09-8c3b-e7a01f85325b.jpg', NULL, '/uploads/vendors/d7e925c2-ccfb-4580-877e-9d24aedd26af.webp', NULL, '2026-08-08 00:00:00.000', '343434343443'),
('cms0q2ezf0002vqnor6iixfhp', 'cms0q2ezd0000vqno8jze70la', 'Arabika', 'arabika', 'APPROVED', '2026-07-25 18:48:18.267', '2026-08-01 19:33:47.010', NULL, '/uploads/vendors/922c1e9f-2160-4e3b-9786-3750926d9f1e.jpg', NULL, '/uploads/vendors/4de7e7dd-0359-4f88-be42-7cff568f610e.webp', NULL, NULL, NULL),
('cms0qcv9o0005vqno3o3jfr65', 'cms0qcv970003vqnovb9a8314', 'Boraka', 'boraka', 'APPROVED', '2026-07-25 18:56:25.933', '2026-07-25 18:56:25.933', 'New york', '/uploads/vendors/1a73a7e6-d56c-4179-beaa-16495f68e983.jpg', '/uploads/vendors/c11f3854-ed2f-45fd-983e-8ac7509fb6b6.jpg', '/uploads/vendors/09e392dd-9b89-4e13-99bf-d55fb8dc6e0f.jpg', '/uploads/vendors/776266d1-23c9-4a63-b35a-222454e49ffd.png', '2026-10-29 00:00:00.000', '3434343434'),
('cms0wv2u10002vqhgr3gc2c6u', 'cms0wv2qz0000vqhg10zr8nkw', 'Dawson Goods', 'dawson-goods-1785016713239', 'APPROVED', '2026-07-25 21:58:33.241', '2026-07-26 18:32:43.712', '12 Market St', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `verificationtoken`
--

CREATE TABLE `verificationtoken` (
  `identifier` varchar(191) NOT NULL,
  `token` varchar(191) NOT NULL,
  `expires` datetime(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wishlist`
--

CREATE TABLE `wishlist` (
  `id` varchar(191) NOT NULL,
  `customerId` varchar(191) NOT NULL,
  `productId` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `wishlist`
--

INSERT INTO `wishlist` (`id`, `customerId`, `productId`, `createdAt`) VALUES
('cmsf3cq9a0005vqvo8zg8ok4m', 'cmrwcwo180000vqssjgi0l3b0', 'cms3utcsn0001vqx89lnachts', '2026-08-04 20:09:00.910');

-- --------------------------------------------------------

--
-- Table structure for table `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) NOT NULL,
  `checksum` varchar(64) NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) NOT NULL,
  `logs` text DEFAULT NULL,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT current_timestamp(3),
  `applied_steps_count` int(10) UNSIGNED NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('12f5ea80-21e1-48f8-9801-c3e6a8f40904', '5482798bde492d928720806ef9866ae1ed2e3ea2d889ee9650af611092b9f8ac', '2026-08-09 19:19:50.791', '20260809191948_stripe_payment_intent', NULL, NULL, '2026-08-09 19:19:50.777', 1),
('2963e94c-7140-4d5e-8e67-7e2abbc32c67', '1cbff73b8337a52840ac82394ebe9fb2e61e1ea6e9eeae36ac733a93e2f3e757', '2026-07-27 17:35:17.531', '20260727173517_add_product', NULL, NULL, '2026-07-27 17:35:17.268', 1),
('51b8bb72-7a6d-4be7-b33a-2ca0e99ea0b9', 'd9ab3401c962052d529b98e9bc1948df37db945d74cfe69a635f0032ed69cfe6', '2026-08-02 20:04:45.573', '20260802200445_add_orders', NULL, NULL, '2026-08-02 20:04:45.174', 1),
('581bb1b5-0dd5-4b46-85b1-3228a3a71d4d', '5474ff817eacf806e9b2495744d5eb6d82a435dcc478baa3a897a2ba5a29376d', '2026-08-08 21:45:34.059', '20260808214154_add_chat', NULL, NULL, '2026-08-08 21:45:33.916', 1),
('5e49cd3a-5cc6-4950-92f2-0a7dfcab1c0c', '09a1633455e5920163f3bda387d83ef7b7bba0f0bd7f73b5f0664cbe75cbed06', '2026-08-07 20:01:31.307', '20260807200131_review_visibility', NULL, NULL, '2026-08-07 20:01:31.086', 1),
('661ee2c9-4b6b-45f9-8886-d0ab00db829e', '9332e9de85b78fdb6f38a295779cf9f21d607e9b01c55035ce1a3883449fd365', '2026-07-25 18:06:05.772', '20260725180605_vendor_profile_fields', NULL, NULL, '2026-07-25 18:06:05.700', 1),
('8a2fc924-6af4-400c-a88b-a3fe355cccfd', '199e2cc89398bad539f9d58974d76d868b3537f63fa9300a9427dabafaac067d', '2026-08-03 21:05:36.051', '20260803210536_add_order_hidden', NULL, NULL, '2026-08-03 21:05:36.027', 1),
('91e5af3d-f4e4-483e-b8c4-a1268d4371d2', 'f932cf3383754b88171d3481193319985fb4123b3e60d0705c7c0f120d338998', '2026-08-03 20:59:02.655', '20260803205902_add_reviews', NULL, NULL, '2026-08-03 20:59:02.512', 1),
('97c95e0f-a342-4827-8e5b-7e7846c9ea67', '50047ad3e2b320a41fc6fd02da884fd9318f4520d3efe4ec12b73ac7eb50bc86', '2026-08-03 18:38:14.724', '20260803183814_add_user_image', NULL, NULL, '2026-08-03 18:38:14.569', 1),
('9ac6c97e-a381-426b-87e9-e713e2363e9f', 'c4dc41f8453e5be6c9c2aea10c14261556885e02cab4f26995762ade5d0974d1', '2026-07-31 20:54:46.830', '20260731205446_product_flags', NULL, NULL, '2026-07-31 20:54:46.649', 1),
('d090bde7-9ca7-4946-beb9-fd60befb94fc', 'f0d0513f9f1c0456ea5b1cd6df21cde052cb9f79c12e19fbafedf7a230c83360', '2026-07-31 17:40:31.199', '20260731174031_add_coupon', NULL, NULL, '2026-07-31 17:40:31.082', 1),
('d831fb92-d2f4-41ef-b4fa-7ccbf39a18ec', 'a50111b4858feb989086ea7a9d526cc4753e1634103ad58a069b24b37f9f85ef', '2026-08-05 20:13:46.097', '20260805201346_add_suborder_payment', NULL, NULL, '2026-08-05 20:13:46.078', 1),
('de30c24c-9860-4f3e-94a5-05300c72a00b', '60c7918a28658af96b63bea2a5a668cb2b21a7e8f0de6d6c83935f36ef4cb04f', '2026-07-22 16:02:04.392', '20260722160204_auth_init', NULL, NULL, '2026-07-22 16:02:04.037', 1),
('deece916-b756-4c1c-ab70-854fb511085f', 'aaa467ee3f54ae530e2ff808c37cd1241a681ebda35e4dde74748fcfd5ccf3d7', '2026-08-04 18:54:37.278', '20260804185437_add_wishlist', NULL, NULL, '2026-08-04 18:54:37.189', 1),
('ef92698b-af0d-4499-b62a-431420c6869e', 'b0ca16cc613b8ae8ffc357e7020b5d89b74f6f6bd02ab3f862e30dd9a336f96b', '2026-07-24 18:46:42.048', '20260724184641_add_categories', NULL, NULL, '2026-07-24 18:46:41.816', 1),
('f5224e80-156f-4cb0-b334-7a5678d051e7', '722679457e5ea46d1c68e70309b5879dbed33e45d07f8eef1df551d012c9a390', '2026-07-22 20:52:37.687', '20260722205237_add_brand', NULL, NULL, '2026-07-22 20:52:37.664', 1),
('f69cd82b-05b2-443d-beb1-bc1e3c995e31', '544d5c1853c5220c805745e4ad0964e76047cc784f976c29843cd85dd4aa9895', '2026-08-05 18:57:41.132', '20260805185740_add_failed_to_deliver_status', NULL, NULL, '2026-08-05 18:57:40.991', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Account_provider_providerAccountId_key` (`provider`,`providerAccountId`),
  ADD KEY `Account_userId_fkey` (`userId`);

--
-- Indexes for table `brand`
--
ALTER TABLE `brand`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Brand_name_key` (`name`),
  ADD UNIQUE KEY `Brand_slug_key` (`slug`);

--
-- Indexes for table `category`
--
ALTER TABLE `category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Category_name_key` (`name`),
  ADD UNIQUE KEY `Category_slug_key` (`slug`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Conversation_customerId_vendorId_key` (`customerId`,`vendorId`),
  ADD KEY `Conversation_customerId_lastMessageAt_idx` (`customerId`,`lastMessageAt`),
  ADD KEY `Conversation_vendorId_lastMessageAt_idx` (`vendorId`,`lastMessageAt`),
  ADD KEY `Conversation_productId_fkey` (`productId`);

--
-- Indexes for table `coupon`
--
ALTER TABLE `coupon`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Coupon_vendorId_code_key` (`vendorId`,`code`),
  ADD KEY `Coupon_vendorId_idx` (`vendorId`);

--
-- Indexes for table `couponproduct`
--
ALTER TABLE `couponproduct`
  ADD PRIMARY KEY (`couponId`,`productId`),
  ADD KEY `CouponProduct_productId_idx` (`productId`);

--
-- Indexes for table `message`
--
ALTER TABLE `message`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Message_conversationId_createdAt_idx` (`conversationId`,`createdAt`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Order_orderNumber_key` (`orderNumber`),
  ADD UNIQUE KEY `Order_stripePaymentIntentId_key` (`stripePaymentIntentId`),
  ADD KEY `Order_customerId_idx` (`customerId`),
  ADD KEY `Order_createdAt_idx` (`createdAt`);

--
-- Indexes for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD PRIMARY KEY (`id`),
  ADD KEY `OrderItem_subOrderId_idx` (`subOrderId`),
  ADD KEY `OrderItem_productId_idx` (`productId`),
  ADD KEY `OrderItem_variationId_fkey` (`variationId`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Product_slug_key` (`slug`),
  ADD KEY `Product_vendorId_idx` (`vendorId`),
  ADD KEY `Product_categoryId_idx` (`categoryId`),
  ADD KEY `Product_brandId_idx` (`brandId`),
  ADD KEY `Product_approvalStatus_idx` (`approvalStatus`),
  ADD KEY `Product_subCategoryId_fkey` (`subCategoryId`),
  ADD KEY `Product_subSubCategoryId_fkey` (`subSubCategoryId`),
  ADD KEY `Product_isFeatured_idx` (`isFeatured`),
  ADD KEY `Product_isPopular_idx` (`isPopular`);

--
-- Indexes for table `productvariation`
--
ALTER TABLE `productvariation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ProductVariation_productId_idx` (`productId`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Review_customerId_orderItemId_key` (`customerId`,`orderItemId`),
  ADD KEY `Review_productId_idx` (`productId`),
  ADD KEY `Review_customerId_idx` (`customerId`),
  ADD KEY `Review_status_idx` (`status`),
  ADD KEY `Review_orderItemId_fkey` (`orderItemId`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Session_sessionToken_key` (`sessionToken`),
  ADD KEY `Session_userId_fkey` (`userId`);

--
-- Indexes for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SubCategory_categoryId_name_key` (`categoryId`,`name`),
  ADD UNIQUE KEY `SubCategory_categoryId_slug_key` (`categoryId`,`slug`),
  ADD KEY `SubCategory_categoryId_idx` (`categoryId`);

--
-- Indexes for table `suborder`
--
ALTER TABLE `suborder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `SubOrder_orderId_idx` (`orderId`),
  ADD KEY `SubOrder_vendorId_idx` (`vendorId`),
  ADD KEY `SubOrder_couponId_fkey` (`couponId`);

--
-- Indexes for table `subsubcategory`
--
ALTER TABLE `subsubcategory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `SubSubCategory_subCategoryId_name_key` (`subCategoryId`,`name`),
  ADD UNIQUE KEY `SubSubCategory_subCategoryId_slug_key` (`subCategoryId`,`slug`),
  ADD KEY `SubSubCategory_categoryId_idx` (`categoryId`),
  ADD KEY `SubSubCategory_subCategoryId_idx` (`subCategoryId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `User_email_key` (`email`);

--
-- Indexes for table `vendor`
--
ALTER TABLE `vendor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Vendor_userId_key` (`userId`),
  ADD UNIQUE KEY `Vendor_slug_key` (`slug`);

--
-- Indexes for table `verificationtoken`
--
ALTER TABLE `verificationtoken`
  ADD UNIQUE KEY `VerificationToken_token_key` (`token`),
  ADD UNIQUE KEY `VerificationToken_identifier_token_key` (`identifier`,`token`);

--
-- Indexes for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Wishlist_customerId_productId_key` (`customerId`,`productId`),
  ADD KEY `Wishlist_customerId_idx` (`customerId`),
  ADD KEY `Wishlist_productId_idx` (`productId`);

--
-- Indexes for table `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `account`
--
ALTER TABLE `account`
  ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `Conversation_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Conversation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Conversation_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `coupon`
--
ALTER TABLE `coupon`
  ADD CONSTRAINT `Coupon_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `couponproduct`
--
ALTER TABLE `couponproduct`
  ADD CONSTRAINT `CouponProduct_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `CouponProduct_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `message`
--
ALTER TABLE `message`
  ADD CONSTRAINT `Message_conversationId_fkey` FOREIGN KEY (`conversationId`) REFERENCES `conversation` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `order`
--
ALTER TABLE `order`
  ADD CONSTRAINT `Order_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `orderitem`
--
ALTER TABLE `orderitem`
  ADD CONSTRAINT `OrderItem_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_subOrderId_fkey` FOREIGN KEY (`subOrderId`) REFERENCES `suborder` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `OrderItem_variationId_fkey` FOREIGN KEY (`variationId`) REFERENCES `productvariation` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `Product_brandId_fkey` FOREIGN KEY (`brandId`) REFERENCES `brand` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `subcategory` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_subSubCategoryId_fkey` FOREIGN KEY (`subSubCategoryId`) REFERENCES `subsubcategory` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `Product_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `productvariation`
--
ALTER TABLE `productvariation`
  ADD CONSTRAINT `ProductVariation_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `Review_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_orderItemId_fkey` FOREIGN KEY (`orderItemId`) REFERENCES `orderitem` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Review_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `subcategory`
--
ALTER TABLE `subcategory`
  ADD CONSTRAINT `SubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `suborder`
--
ALTER TABLE `suborder`
  ADD CONSTRAINT `SubOrder_couponId_fkey` FOREIGN KEY (`couponId`) REFERENCES `coupon` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `SubOrder_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `SubOrder_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `vendor` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `subsubcategory`
--
ALTER TABLE `subsubcategory`
  ADD CONSTRAINT `SubSubCategory_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `category` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `SubSubCategory_subCategoryId_fkey` FOREIGN KEY (`subCategoryId`) REFERENCES `subcategory` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `vendor`
--
ALTER TABLE `vendor`
  ADD CONSTRAINT `Vendor_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `wishlist`
--
ALTER TABLE `wishlist`
  ADD CONSTRAINT `Wishlist_customerId_fkey` FOREIGN KEY (`customerId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `Wishlist_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
