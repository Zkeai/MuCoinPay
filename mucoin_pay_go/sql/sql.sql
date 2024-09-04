/*
 Navicat Premium Data Transfer

 Source Server         : 本地
 Source Server Type    : MySQL
 Source Server Version : 80300 (8.3.0)
 Source Host           : localhost:3306
 Source Schema         : yuka

 Target Server Type    : MySQL
 Target Server Version : 80300 (8.3.0)
 File Encoding         : 65001

 Date: 03/09/2024 10:03:40
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for yu_business
-- ----------------------------
DROP TABLE IF EXISTS `yu_business`;
CREATE TABLE `yu_business` (
                               `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
                               `user_id` int unsigned NOT NULL COMMENT '用户id',
                               `shop_name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '店铺名称',
                               `title` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '浏览器标题',
                               `notice` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci COMMENT '店铺公告',
                               `service_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '网页客服链接',
                               `subdomain` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '子域名',
                               `topdomain` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '顶级域名',
                               `master_display` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '主站显示：0=否，1=是',
                               `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for yu_category
-- ----------------------------
DROP TABLE IF EXISTS `yu_category`;
CREATE TABLE `yu_category` (
                               `id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '主键id',
                               `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '商品分类名称',
                               `sort` smallint unsigned NOT NULL DEFAULT '0' COMMENT '排序',
                               `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                               `owner` int unsigned NOT NULL DEFAULT '0' COMMENT '所属会员：0=系统，其他等于会员UID',
                               `icon` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL COMMENT '分类图标',
                               `status` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '状态：0=停用，1=启用',
                               `hide` tinyint unsigned NOT NULL DEFAULT '0' COMMENT '隐藏：1=隐藏，0=不隐藏',
                               `user_level_config` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci COMMENT '会员配置',
                               PRIMARY KEY (`id`,`hide`),
                               UNIQUE KEY `unique_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ----------------------------
-- Table structure for yu_user
-- ----------------------------
DROP TABLE IF EXISTS `yu_user`;
CREATE TABLE `yu_user` (
                           `id` int NOT NULL AUTO_INCREMENT COMMENT 'id',
                           `wallet` varchar(42) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'eth 钱包地址',
                           `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '账号状态',
                           `type` int NOT NULL DEFAULT '0' COMMENT '账号类型 0-用户 1-商户 2-管理员',
                           `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                           `login_time` timestamp NULL DEFAULT NULL COMMENT '登录时间',
                           `login_ip` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT '登录ip',
                           PRIMARY KEY (`id`),
                           UNIQUE KEY `unique_wallet` (`wallet`)
) ENGINE=InnoDB AUTO_INCREMENT=1001 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci COMMENT='用户表';

SET FOREIGN_KEY_CHECKS = 1;
