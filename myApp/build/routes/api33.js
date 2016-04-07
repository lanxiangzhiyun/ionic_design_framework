var express = require('express');
var router = express.Router();
router.get('/table/n_lens_price?order_=order1', function (req, res) {
  console.log(req.params);
  res.json('[{"id":1,"type":"1.60","brand":"普通","price":0,"order1":10,"create_time":"2015-12-01 19:02:54","market_price":400},{"id":10,"type":"1.60","brand":"MR-8","price":100,"order1":15,"create_time":"2015-12-16 15:44:24","market_price":600},{"id":2,"type":"1.60","brand":"依视路","price":616,"order1":20,"create_time":"2015-12-01 19:02:54","market_price":880},{"id":3,"type":"1.60","brand":"蔡司","price":686,"order1":30,"create_time":"2015-12-01 19:02:55","market_price":980},{"id":4,"type":"1.67","brand":"普通","price":200,"order1":40,"create_time":"2015-12-01 19:02:55","market_price":1000},{"id":5,"type":"1.67","brand":"依视路","price":1176,"order1":50,"create_time":"2015-12-01 19:02:55","market_price":1680},{"id":6,"type":"1.67","brand":"蔡司","price":1316,"order1":60,"create_time":"2015-12-01 19:02:55","market_price":1880},{"id":7,"type":"1.74","brand":"普通","price":500,"order1":70,"create_time":"2015-12-01 19:02:55","market_price":1980},{"id":8,"type":"1.74","brand":"依视路","price":3500,"order1":80,"create_time":"2015-12-01 19:02:55","market_price":5000},{"id":9,"type":"1.74","brand":"蔡司","price":5376,"order1":90,"create_time":"2015-12-01 19:02:55","market_price":7680}]');
  });
module.exports = router;
