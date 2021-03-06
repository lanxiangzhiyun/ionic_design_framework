/**
 * Created by fanghui on 2016/4/6.
 */
var express = require('express');
var router = express.Router();

router.get('/table/n_lens_price', function(req, res) {
  //console.log(req);
  console.log(req.query);
  res.json([{"id":1,"type":"1.60","brand":"普通","price":0,"order1":10,"create_time":"2015-12-01 19:02:54","market_price":400},{"id":10,"type":"1.60","brand":"MR-8","price":100,"order1":15,"create_time":"2015-12-16 15:44:24","market_price":600},{"id":2,"type":"1.60","brand":"依视路","price":616,"order1":20,"create_time":"2015-12-01 19:02:54","market_price":880},{"id":3,"type":"1.60","brand":"蔡司","price":686,"order1":30,"create_time":"2015-12-01 19:02:55","market_price":980},{"id":4,"type":"1.67","brand":"普通","price":200,"order1":40,"create_time":"2015-12-01 19:02:55","market_price":1000},{"id":5,"type":"1.67","brand":"依视路","price":1176,"order1":50,"create_time":"2015-12-01 19:02:55","market_price":1680},{"id":6,"type":"1.67","brand":"蔡司","price":1316,"order1":60,"create_time":"2015-12-01 19:02:55","market_price":1880},{"id":7,"type":"1.74","brand":"普通","price":500,"order1":70,"create_time":"2015-12-01 19:02:55","market_price":1980},{"id":8,"type":"1.74","brand":"依视路","price":3500,"order1":80,"create_time":"2015-12-01 19:02:55","market_price":5000},{"id":9,"type":"1.74","brand":"蔡司","price":5376,"order1":90,"create_time":"2015-12-01 19:02:55","market_price":7680}]);
});
router.get('/table/n_goods2', function(req, res) {
  //console.log(req);
  console.log(req.query);
  res.json([{
      "id": 565,
      "sn": "A1",
      "on_sale": 1,
      "shop_price": 399,
      "market_price": 528,
      "name": "时尚TR圆框-A1",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/A1.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/A1.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/A1-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 43,
      "lower_left_x": null,
      "lower_left_y": 70,
      "upper_right_x": 249,
      "upper_right_y": 41,
      "lower_right_x": 249,
      "lower_right_y": 67,
      "category": "试戴",
      "color": "黑",
      "style": "全框",
      "glass_width": 51,
      "leg_length": 148,
      "nose_width": 14,
      "create_time": "2016-01-20 12:40:14",
      "update_time": "2016-01-20 12:40:14",
      "img_detail_0": "/epj_images/goods_images/A1.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/A1.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/A1.glass_2.jpg",
      "img_detail_3": "http://epeijing.cn//epj_images/goods_images/A1.glass_3.jpg",
      "img_detail_4": "http://epeijing.cn//epj_images/goods_images/A1.glass_4.jpg",
      "img_detail_5": null,
      "leg_y1": 0,
      "leg_y2": 36,
      "zone": "399",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 17,
      "stock": 1,
      "ss_stock": 93,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 577,
      "sn": "B5",
      "on_sale": 1,
      "shop_price": 599,
      "market_price": 758,
      "name": "热销款百搭板材系列-B5",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/B5.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/B5.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/B5-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 12,
      "lower_left_x": null,
      "lower_left_y": 41,
      "upper_right_x": 249,
      "upper_right_y": 12,
      "lower_right_x": 249,
      "lower_right_y": 41,
      "category": "试戴",
      "color": "黑",
      "style": "全框",
      "glass_width": 56,
      "leg_length": 145,
      "nose_width": 16,
      "create_time": "2015-12-15 19:15:24",
      "update_time": "2015-12-29 15:04:41",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/B5.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/B5.glass_1.jpg",
      "img_detail_2": "/epj_images/goods_images/B5.glass_2.jpg",
      "img_detail_3": "http://epeijing.cn//epj_images/goods_images/B5.glass_3.jpg",
      "img_detail_4": "http://epeijing.cn//epj_images/goods_images/B5.glass_4.jpg",
      "img_detail_5": null,
      "leg_y1": 2,
      "leg_y2": 38,
      "zone": "599",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 589,
      "sn": "A5",
      "on_sale": 1,
      "shop_price": 399,
      "market_price": 528,
      "name": "明星款百搭金属半框-A5",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/A5.thumb.jpg",
      "img_face": "/epj_images/goods_images/A5.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/A5-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 24,
      "lower_left_x": null,
      "lower_left_y": 52,
      "upper_right_x": 249,
      "upper_right_y": 24,
      "lower_right_x": 249,
      "lower_right_y": 50,
      "category": "试戴",
      "color": "黑",
      "style": "全框",
      "glass_width": 56,
      "leg_length": 146,
      "nose_width": 19,
      "create_time": "2015-12-29 11:31:51",
      "update_time": "2015-12-29 15:06:48",
      "img_detail_0": "/epj_images/goods_images/A5.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/A5.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/A5.glass_2.jpg",
      "img_detail_3": "http://epeijing.cn//epj_images/goods_images/A5.glass_3.jpg",
      "img_detail_4": "http://epeijing.cn//epj_images/goods_images/A5.glass_4.jpg",
      "img_detail_5": null,
      "leg_y1": 6,
      "leg_y2": 38,
      "zone": "399",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 5,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 626,
      "sn": "Pra-Q1",
      "on_sale": 1,
      "shop_price": 2384,
      "market_price": 2980,
      "name": "普拉达Prada-VPR18Q",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/Pra-Q1.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/Pra-Q1.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/Pra-Q1-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 31,
      "lower_left_x": null,
      "lower_left_y": 70,
      "upper_right_x": 249,
      "upper_right_y": 31,
      "lower_right_x": 249,
      "lower_right_y": 72,
      "category": "品牌",
      "color": "黑",
      "style": "全框",
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2015-11-09 18:34:29",
      "update_time": "2015-12-17 15:35:25",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/Pra-Q1.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/Pra-Q1.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/Pra-Q1.glass_2.jpg",
      "img_detail_3": null,
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 50,
      "leg_y2": 103,
      "zone": "品牌",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 631,
      "sn": "Rayb-A5",
      "on_sale": 1,
      "shop_price": 1024,
      "market_price": 1280,
      "name": "雷朋Rayban中性-4187F",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.png",
      "img_leg": "/epj_images/goods_images/Rayb-A5-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 9,
      "lower_left_x": null,
      "lower_left_y": 34,
      "upper_right_x": 249,
      "upper_right_y": 9,
      "lower_right_x": 249,
      "lower_right_y": 33,
      "category": "品牌",
      "color": "黑",
      "style": null,
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2015-11-08 12:13:11",
      "update_time": "2015-12-17 15:40:33",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.glass_2.jpg",
      "img_detail_3": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.glass_3.jpg",
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 0,
      "leg_y2": 17,
      "zone": "品牌",
      "model_0": "/epj_images/goods_images/Rayb-A5.model_0.jpg",
      "model_1": "/epj_images/goods_images/Rayb-A5.model_1.jpg",
      "model_2": "http://epeijing.cn//epj_images/goods_images/Rayb-A5.model_2.jpg",
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 632,
      "sn": "Rayb-A6",
      "on_sale": 1,
      "shop_price": 1024,
      "market_price": 1280,
      "name": "雷朋Rayban中性-5228F",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/Rayb-A6.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/Rayb-A6.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/Rayb-A6-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 31,
      "lower_left_x": null,
      "lower_left_y": 63,
      "upper_right_x": 249,
      "upper_right_y": 31,
      "lower_right_x": 249,
      "lower_right_y": 65,
      "category": "品牌",
      "color": "黑",
      "style": "全框",
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2015-11-08 12:12:02",
      "update_time": "2015-12-17 15:40:24",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/Rayb-A6.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/Rayb-A6.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/Rayb-A6.glass_2.jpg",
      "img_detail_3": null,
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 5,
      "leg_y2": 48,
      "zone": "品牌",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 634,
      "sn": "Rayb-A7",
      "on_sale": 1,
      "shop_price": 1056,
      "market_price": 1320,
      "name": "雷朋Rayban中性-5332D",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.png",
      "img_leg": "/epj_images/goods_images/Rayb-A7-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 26,
      "lower_left_x": null,
      "lower_left_y": 48,
      "upper_right_x": 249,
      "upper_right_y": 26,
      "lower_right_x": 249,
      "lower_right_y": 48,
      "category": "品牌",
      "color": "红色",
      "style": "全框",
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2015-11-08 12:13:06",
      "update_time": "2015-12-17 15:40:17",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.glass_2.jpg",
      "img_detail_3": "http://epeijing.cn//epj_images/goods_images/Rayb-A7.glass_3.jpg",
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 10,
      "leg_y2": 43,
      "zone": "品牌",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }, {
      "id": 1275,
      "sn": "S579-C12",
      "on_sale": 1,
      "shop_price": 799,
      "market_price": 1158,
      "name": "1275",
      "img_thumb": "http://epeijing.cn//epj_images/goods_images/S579-C12.thumb.jpg",
      "img_face": "http://epeijing.cn//epj_images/goods_images/S579-C12.png",
      "img_leg": "http://epeijing.cn//epj_images/goods_images/S579-C12-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 64,
      "lower_left_x": null,
      "lower_left_y": 81,
      "upper_right_x": null,
      "upper_right_y": 65,
      "lower_right_x": null,
      "lower_right_y": 81,
      "category": "799",
      "color": null,
      "style": null,
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2016-01-24 18:29:58",
      "update_time": "2016-01-27 00:47:59",
      "img_detail_0": "http://epeijing.cn//epj_images/goods_images/S579-C12.0.jpg",
      "img_detail_1": "http://epeijing.cn//epj_images/goods_images/S579-C12.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn//epj_images/goods_images/S579-C12.glass_2.jpg",
      "img_detail_3": null,
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 45,
      "leg_y2": 65,
      "zone": "799",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-"
    }]
  );
});
router.get('/table/n_goods2/:id', function(req, res) {
  //console.log(req);
  console.log(req.params);
  res.json({
      "id": 1275,
      "sn": "S579-C12",
      "on_sale": 1,
      "shop_price": 799,
      "market_price": 1158,
      "name": "1275",
      "img_thumb": "http://epeijing.cn/epj_images/goods_images/S579-C12.thumb.jpg",
      "img_face": "http://epeijing.cn/epj_images/goods_images/S579-C12.png",
      "img_leg": "http://epeijing.cn/epj_images/goods_images/S579-C12-.png",
      "description": null,
      "upper_left_x": null,
      "upper_left_y": 64,
      "lower_left_x": null,
      "lower_left_y": 81,
      "upper_right_x": null,
      "upper_right_y": 65,
      "lower_right_x": null,
      "lower_right_y": 81,
      "category": "799",
      "color": null,
      "style": null,
      "glass_width": null,
      "leg_length": null,
      "nose_width": null,
      "create_time": "2016-01-24 18:29:58",
      "update_time": "2016-01-27 00:47:59",
      "img_detail_0": "http://epeijing.cn/epj_images/goods_images/S579-C12.0.jpg",
      "img_detail_1": "http://epeijing.cn/epj_images/goods_images/S579-C12.glass_1.jpg",
      "img_detail_2": "http://epeijing.cn/epj_images/goods_images/S579-C12.glass_2.jpg",
      "img_detail_3": null,
      "img_detail_4": null,
      "img_detail_5": null,
      "leg_y1": 45,
      "leg_y2": 65,
      "zone": "799",
      "model_0": null,
      "model_1": null,
      "model_2": null,
      "model_3": null,
      "model_4": null,
      "recommend": 1,
      "saled": 0,
      "stock": 1,
      "ss_stock": 100,
      "brand": null,
      "link_url": null,
      "seller": "-",
      "try_owner": null,
      "face_origin": null,
      "leg_origin": null,
      "try_desc": null
    }
  );
});

module.exports = router;
