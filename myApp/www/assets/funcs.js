'use strict';

export function getPicSrc(pic, update_time) {
  if (pic && pic.startsWith('data:')) {
    return pic;
  }
  return pic ? pic + '?_up='+update_time : '';
}

export function encodeData(data) {
  return Object.keys(data).map(function(key) {
    return [key, data[key]].join("=");
  }).join("&");
}

export function startsWith(str1, str2) {
  return str1.slice(0, str2.length) == str2;
}

export function endsWith(str1, str2) {
  return str1.slice(-str2.length, str1.length)==str2;
}

export function findGoods(goods, id) {
  for (var i=0; i<goods.length; i++) {
    if (id == goods[i].id) {
      return goods[i];
    }
  }
  return null;
}

/*
 #include <stdio.h>
 #include <stdlib.h>
 long extgcd(long a, long b, long& x, long& y) {
 long d = a;
 if(b!=0) {
 d = extgcd(b, a%b, y, x);
 y -= (a/b)*x;
 } else {
 x = 1; y = 0;
 }
 return d;
 }

 int main(int argc, const char* argv[]) {
 long x = 0, y = 0;
 long r = extgcd(atol(argv[1]), atol(argv[2]), x, y);
 printf("r: %ld x: %ld y:%ld\n", r, x, y);
 return 0;
 }
*/
var optics_limit = 0x1000000;
var optics_interval = 0x9a6577;
//optics_limit * -1581679 + optics_interval * 2622535 = 1 //挑战程序设计竞赛中的模运算章节
export function getOpticsCode(optics_id) {
  return sprintf('%06x', parseInt(optics_id) * optics_interval % optics_limit);
}

export function getOpticsId(optics_code) {
  var id = parseInt('0x'+optics_code);
  var n = id * (2622535) % optics_limit;
  return n > 0 ? n : n + optics_limit;
}

export function hideRealName(name) {
  return name.slice(0,1)+'**';
}

export function checkOrderValid(order,type) {
  //return order.try_receiver && order.try_receiver_phone && order.try_address && order.shop_id;
  var fields=[type+'_receiver',type+'_receiver_phone',type+'_address'];
  var x=fields.filter(function(fd){
    return !order[fd];
  });
  console.log('get invald fds ',x);
  return x;
}

export function getFileContentQ(id, q) {
  var f = document.getElementById(id).files[0];
  if (!f) {
    return q.when();
  }
  var defer = q.defer();
  var r = new FileReader();
  r.onloadend = function() {
    var data = new Uint8Array(r.result);
    defer.resolve(data);
  };
  r.readAsArrayBuffer(f);
  return defer.promise;
}

export function compareSn(g1, g2) {
  var sn1 = g1.sn;
  var sn2 = g2.sn;
  var reg = /([^\d]+)(\d+)$/;
  var ss1 = reg.exec(sn1);
  var ss2 = reg.exec(sn2);
  if (!ss1 || !ss2) return sn1.localeCompare(sn2);
  return ss1[1] == ss2[1] ? parseInt(ss1[2]) - parseInt(ss2[2]) : ss1[1].localeCompare(ss2[1]);
}



/** WEBPACK FOOTER **
 ** ../assets/funcs.js
 **/