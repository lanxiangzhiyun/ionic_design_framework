angular.module('starter.services', [])

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'static/img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'static/img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'static/img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'static/img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'static/img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
.service('WishGoods',function(BaseService,$q){
  var wishGoods=[];
  var storeWishGoods = localStorage.basket;
  //var q = $q.defer();
  // json |  id:1,type: brand:,exchange
  if (storeWishGoods) {
    var s = JSON.parse(storeWishGoods);
    console.log('local s',s);
    var ids = s.length==1 ? s[0].id : s.map(function(gd){ return gd.id}).join(',');
    console.log('gene ids',ids);
    wishGoods=BaseService.toGoods(ids);
    wishGoods.$promise.then(function(){
      for( var i=0;i< s.length;i++){
        angular.extend(wishGoods[i],{
          notSelected : false,
          type: s[i].type,
          brand: s[i].brand,
          pzone: s[i].pzone,
          s_price: s[i].s_price,
          exchange: s[i].exchange
        })
      }
      console.log('extend wg', wishGoods);
    })
  }
  function searchItem(item) {
    for (var i = 0; i < wishGoods.length; i++) {
      if (wishGoods[i].id == item.id)
        return i;
    }
    return -1;
  }
  function getSelectProducts () {
    return wishGoods.filter(function (item) {
      return item.notSelected == false;
    });
  }
  function getIds() {
    var ids = wishGoods.map(function (item) {
      //return item.id;
      return {
        id: item.id,
        type: item.type,
        brand: item.brand,
        pzone: item.pzone,
        s_price: item.s_price,
        exchange: item.exchange || 0
      }
    });
    //return ids.join(',') + (ids.length ? ',' : '');
    return JSON.stringify(ids);
  }
  return {
    clear : function(){
      wishGoods=[];
      localStorage.removeItem('basket');
    },
    disSelectOthers : function(item){
      wishGoods=wishGoods.map(function(itm){
        if( !item || item.id != itm.id ){
          itm.notSelected =true;
        }
        console.log('itm',itm);
        return itm;
      })
    },
    getSelectPrice : function () {
      var totalPrice = 0.0;
      for (var i = 0; i < wishGoods.length; i++) {
        var w = wishGoods[i];
        totalPrice += parseFloat(w && !w.notSelected && w.s_price || 0);
      }
      return totalPrice;
    },
    toggleSelect  : function (item) {
      item.notSelected = !item.notSelected;
    },
    hasItem : function () {
      return wishGoods.length > 0;
    },
    addItem: function(item){
      wishGoods.push(item);
      localStorage.basket = getIds();
    },
    toggleItem : function (item, onlyRemove) {
      console.log('current wg',wishGoods);
      var i = searchItem(item);
      console.log('get i',i);
      if (i > -1) {
        wishGoods.splice(i, 1);
        console.log('in toggle rm len',wishGoods.length);
        if(wishGoods.length==0){
          localStorage.removeItem('basket');
          console.log('toggle remove last e');
          return;
        }
        console.log('toggle remove');
        localStorage.basket = getIds();
      }
      else if (!onlyRemove) {
        wishGoods.push(item);
        localStorage.basket= getIds();
      }
    },
    getProducts : function () {
      //return q.promise;
      return wishGoods;
    },
    getSelectProducts : function () {
      return wishGoods.filter(function (item) {
        return !item.notSelected;
      });
    },
    getSelectIds : function () {
      return getSelectProducts().map(function (item) {
          return item.id
        }).join(',') + ',';
    },
    has : function (item) {
      return searchItem(item) > -1;
    },
    hasGoods : function () {
      return wishGoods.length > 0;
    },
    GNum : function () {
      return wishGoods.length;
    },
    Selected_Num: function(){
      return wishGoods.filter(function (item) {
        return !item.notSelected;
      }).length;
    }
  }
})
.service('LensPrice',function($rootScope,NLensPrice){
  $rootScope.lens_map={};
  $rootScope.lens_types=[];
  $rootScope.getBrands = function(ltype) {
    return _.keys($rootScope.lens_map[ltype]);
  }
  var np = new Promise(function(resolve,reject){
    "use strict";
    NLensPrice.query({order_:'order1'},function(data){
      console.log('get lens_price',data);
      data.forEach(function(lp){
        if(lp.type in $rootScope.lens_map == false){
          $rootScope.lens_types.push(lp.type);
          $rootScope.lens_map[lp.type] = {}
        }
        $rootScope.lens_map[lp.type][lp.brand]=lp;
      })
      resolve('ok')
      console.log('get lens_price',$rootScope.lens_map);
      $rootScope.lens_lowest = $rootScope.lens_map['1.60']['普通'].market_price;
      console.log('get lens_price',$rootScope.lens_types);
    })
  })

  return {np: np,init: function(){}};
})
.service('ShopOrders',function(NOrderShop,$rootScope,NLensOrder){
  $rootScope.orders = [];
  $rootScope.hasOrdersRetrived=false;
  $rootScope.buyNowOrder= undefined;
  return {
    load:  function(user_phone, cb){
      console.log('Orders loading for ', user_phone);
      NOrderShop.query({user_phone:user_phone, order_: "sn desc"}, function(data) {
        console.log('gots shop_orders from server by user_phone: ', user_phone, data);
        $rootScope.orders = data;
        $rootScope.hasOrdersRetrived=true;
        $rootScope.$emit('pay_ok_event');
        if (cb) cb(data);
      });
    },
    loadLens:  function(user_phone, cb){
      console.log('len Orders loading for ', user_phone);
      NLensOrder.query({user_phone:user_phone, order_: "sn desc"}, function(data) {
        console.log('gots lens_orders from server by user_phone: ', user_phone, data);
        $rootScope.lensOrders = data;
        if (cb) cb(data);
      });
    },
    find: function(id,rep_order,cb) {
      for(var i=0; i<$rootScope.orders.length; i++) {
        if ($rootScope.orders[i].id == id) {
          if(rep_order)
            $rootScope.orders.splice(i,1,rep_order);
          if(cb) cb($rootScope.orders[i]);
          return $rootScope.orders[i];
        }
      }
      if(cb) cb(null);
      return null;
    },
    findLen: function(id,rep_order,cb) {
      for(var i=0; i<$rootScope.lensOrders.length; i++) {
        if ($rootScope.lensOrders[i].id == id) {
          if(rep_order)
            $rootScope.lensOrders.splice(i,1,rep_order);
          if(cb) cb($rootScope.lensOrders[i]);
          return $rootScope.lensOrders[i];
        }
      }
      if(cb) cb(null);
      return null;
    },
    add: function(order) {
      $rootScope.orders.unshift(order);
    },
    remove: function(id){
      for(var i=0; i<$rootScope.orders.length; i++) {
        console.log('remove id ',id,'curid',$rootScope.orders[i].id);
        if ($rootScope.orders[i].id == id) {
          $rootScope.orders.splice(i,1);
        }
      }
    },
    removeLen: function(id){
      for(var i=0; i<$rootScope.orders.length; i++) {
        console.log('remove id ',id,'curid',$rootScope.orders[i].id);
        if ($rootScope.lensOrders[i].id == id) {
          $rootScope.lensOrders[i].splice(i,1);
        }
      }
    },
    getOrders: function(user_phone,cb){
      if($rootScope.hasOrdersRetrived){
        console.log('has orders');
        cb($rootScope.orders);
      }else{
        console.log('get order from romote ');
        load(user_phone,cb);
      }
    },
    getNew : function(){
      return $rootScope.orders[0];
    },
    setBuyNow : function(order){
      $rootScope.buyNowOrder=order;
    },
    getBuyNow : function getBuyNow(){
      return $rootScope.buyNowOrder;
    }
  };
})
.service('UserService',  function(NUser, $log, $rootScope,ShopOrders,CouponService,$http){
  function processCoupon() {
    if(localStorage.prec){
      var recm = localStorage.prec;
      console.log('has pendding rec',localStorage.prec);
      $http.get(pre+'/api/call/util/add_coupon?code=' + recm + '&user_phone=' + $rootScope.user.user_phone).then(function (res) {
        if (!res.data.success) {
          alert('您输入的优惠码无效: ' + res.data.msg || '');
        }
        else {
          alert('成功添加代金券!');
        }
        localStorage.removeItem('prec');
      });
    }
    CouponService.reload($rootScope.user.user_phone).then(function(){
      $rootScope.$emit('coupon_event');
    })
  }

  return {
    init: function (wx_id) {
      console.log('user Service initing ', wx_id);
      $rootScope.user = new NUser({wx_id:wx_id});
      var t = NUser.query({wx_id: wx_id}, function (data) {
        if (data.length) {
          angular.extend($rootScope.user, data[0]);
          ShopOrders.load($rootScope.user.user_phone);
          ShopOrders.loadLens($rootScope.user.user_phone)
          processCoupon();
        }
        console.log("result user after query: ", $rootScope.user);
        $rootScope.$emit('loggedIn');
      });
      $rootScope.user.$promise = t.$promise;
      return t.$promise;
    },
    reload: function() {
      $rootScope.user.$get();
      return $rootScope.user.$promise;
    },
    reload_cp: function(){
      if($rootScope.user.user_phone)
        CouponService.reload($rootScope.user.user_phone);
    },
    getUser: function () {
      return $rootScope.user;
    },
    signup: function (user_phone, cb) {
      return new Promise(function(resolve, reject) {
        if (!user_phone) {
          throw new Error('you should specify user_phone to call signup');
        }
        $rootScope.user.user_phone = user_phone;
        $rootScope.user.receiver_name = $rootScope.userinfo.nickname;
        $rootScope.user.receiver_phone = user_phone;
        $rootScope.user.$save({}, function () {
          console.log('save result is: ', $rootScope.user);
          ShopOrders.load(user_phone);
          processCoupon();
          if (cb) {cb();}
          resolve($rootScope.user);
        });
      })
    },
    update: function () {
      $rootScope.user.$save();
      return $rootScope.user.$promise;
    }
  };
})
.service('CouponService',function(NCoupon){
  var coupon_bundle={};
  return {
    reload : function(user_phone,cb){
      console.log('service load coupon');
      return  NCoupon.query({where_:"user_phone='"+user_phone+"' and (status <> 'used' or status is null)"},function(data) {
        var orderFuncs = function (a, b) {
          var x = parseFloat(b.value), y = parseFloat(a.value);
          if (x > y)
            return 1;
          if (x == y) {
            return Date.parse(a.create_time) - Date.parse(b.create_time);
          }
          return -1;
        };
        coupon_bundle.generalCoupon = data.filter(function (c) {
          return c.type == 'general'
        }).sort(orderFuncs);
        coupon_bundle.lensCoupon = data.filter(function (c) {
          return c.type == 'lens'
        }).sort(orderFuncs);
        console.log('service get 1 coupon:', coupon_bundle.generalCoupon);
        console.log('service get 2 coupon:', coupon_bundle.lensCoupon);
      }).$promise
    },
    get : function(){
      return coupon_bundle;
    }
  }
})
.service('BaseService', function ($ionicPopup,$timeout, $http, $ionicLoading,NGoods2,NOrderShop) {
  return {
    showFlashMessage: function (m,css){
      var FlashPopup = $ionicPopup.alert({
        title: m,
        buttons:[],
        cssClass: css || ''
      });
      $timeout(function(){
        FlashPopup.close();
      },1500);
    },
    createOrder: function (user, wishGoods,discount,coupons) {
      return new NOrderShop({
        user_phone: user.user_phone,
        buy_receiver:  user.receiver_name || '',
        buy_address:  user.receiver_address || '',
        buy_receiver_phone:  user.receiver_phone || user.user_phone,
        buy_create_time: nowStr(),
        buy_glasses: wishGoods.getSelectIds(),
        buy_total_price: wishGoods.getSelectPrice()-discount,
        buy_other_price: 0,
        use_coupons: coupons.length==0 ? '': coupons.length==1 ? coupons[0] : coupons.join(','),
        buy_comment: JSON.stringify(wishGoods.getSelectProducts().map(function(gd){
          return {
            id: gd.id,
            type: gd.type,
            brand: gd.brand,
            s_price: gd.s_price
          }
        }))
      });
    },
    toGoods: function(strGoods,cb) {
      //if (!strGoods) cb([]);
      //NGoods2.query({ids:strGoods},function(data){
      //cb(data);
      //});
      if(!strGoods) return [];
      return NGoods2.query({ids:strGoods});
    },
    weixinPay: function(wx_id, sn, price, cb, table) {
      $ionicLoading.show("准备支付中...");
      $http.get(pre+'/api/call/util/unified_order?wx_id=' + wx_id + '&sn=' + sn + '&price=' + price+'&table='+table)
        .success(function (order) {
          $ionicLoading.hide();
          if (!order.success || !order.order.appId) {
            cb('Epeijing server return error: ' + order.message);
            return;
          }
          order = order.order;
          WeixinJSBridge.invoke('getBrandWCPayRequest', order, function (wx_res) {
            if (wx_res.err_msg.indexOf('ok') >= 0) {
              cb('');
            } else {
              cb(JSON.stringify(wx_res));
            }
          });
        });
    },
  }
})
