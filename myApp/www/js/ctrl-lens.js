'use strict';

angular.module('starter.controllers')
  .config(function($stateProvider,$urlRouterProvider) {
    $stateProvider
      .state('ltab', {
        url: '/ltab',
        abstract: true,
        template: require('../templates/ltab.html'),
      })
      .state('ltab.chart', {
        url: '/chart',
        cache: false,
        views: {
          'ltab-chart': {
            template: require('../templates/ltab-chart.html'),
            controller: 'LenChartCtrl'
          }
        }
      })
      .state('ltab.product', {
        url: '/product',
        views: {
          'ltab-product': {
            template: require('../templates/ltab-product.html'),
            controller: 'LenProductCtrl'
          }
        }
      })
      .state('ltab.account', {
        url: '/account',
        views: {
          'ltab-account': {
            template: require('../templates/ltab-account.html'),
            controller: 'LenAccountCtrl'
          }
        }
      })
      .state('lfull', {
        url: '/lfull',
        abstract: true,
        template: require('../templates/lfull.html'),
      })
      .state('lfull.lens-cat', {
        url: '/lens-cat/:id',
        views: {
          'lfull': {
            template: require('../templates/lfull-product-goods.html'),
            controller: 'LensCatCtrl'
          }
        }
      })
      .state('lfull.len-detail', {
        url: '/lens/:id',
        cache: false,
        views: {
          'lfull': {
            template: require('../templates/lfull-product-detail.html'),
            controller: 'LensDetailCtrl'
          }
        }
      })
      .state('full.len-pay', {
        url: '/len-pay',
        cache: false,
        views: {
          'full': {
            template: require('../templates/full-pay.html'),
            controller: 'LensPayCtrl'
          }
        }
      })
      .state('lfull.account-len-my', {
        url: '/account-len-my',
        views: {
          'lfull': {
            template: require('../templates/lfull-account-my.html'),
            controller: 'LenAccountMyCtrl'
          }
        }
      })
      .state('lfull.account-len-order', {
        url: '/account-len-order',
        views: {
          'lfull': {
            template: require('../templates/lfull-account-order.html'),
            controller: 'LenAccountOrdersCtrl'
          }
        }
      })
      .state('lfull.account-about', {
        url: '/account-about',
        views: {
          'lfull': {
            template: require('../templates/lfull-account-about.html'),
            controller: 'LenAboutCtrl'
          }
        }
      })
    $urlRouterProvider.when('/ltab/index', '/ltab/product')
      .when('/lfull/index', '/ltab/product')
  })
  .controller('LensPayCtrl', function($scope,$stateParams,LenOrderService,NLensOrder,BaseService,UserService,$rootScope,$location,ShopOrders){
    $scope.id = $location.search().id
    $scope.isNew = $scope.id == 'new'
    if($scope.isNew) {
      $scope.order = LenOrderService.getNewRe();
      refreshStatus($scope.order);
    }
    else
       NLensOrder.get({id: $scope.id}).$promise.then(function(data){
        $scope.order= data;
        refreshStatus($scope.order);
      });
    $scope.ships=['顺丰', '中通', '申通'];

    $scope.provinces=['北京市','天津市','重庆市','上海市','河北省',
      '山西省','辽宁省','吉林省','黑龙江省','江苏省','浙江省','安徽省',
      '福建省','江西省','山东省','河南省','湖北省','湖南省','广东省',
      '海南省','四川省','贵州省','云南省','陕西省','甘肃省','青海省',
      '内蒙古自治区', '广西自治区','西藏自治区','宁夏自治区','新疆自治区'];
    $scope.provinces_price_map={
      '顺丰':{},'申通':{},'中通':{}
    };
    //for 顺丰
    _.each($scope.provinces,p=>{$scope.provinces_price_map['顺丰'][p]=23})
    $scope.provinces_price_map['顺丰']['安徽省']=14
    _.each(['上海市','浙江省'],p=>{ $scope.provinces_price_map['顺丰'][p]=12});
    _.each(['西藏自治区','新疆自治区'],p=>{ $scope.provinces_price_map['顺丰'][p]=26});
    _.each(['山东省','湖北省','江西省','河南省','福建省'],p=>{ $scope.provinces_price_map['顺丰'][p]=22});

    //for 中通
    _.each($scope.provinces,p=>{$scope.provinces_price_map['中通'][p]=8})
    _.each(['上海市','浙江省','江苏省','安徽省'],p=>{$scope.provinces_price_map['中通'][p]=6})
    _.each(['海南省','四川省','贵州省','云南省','陕西省',
      '广西自治区','山西省','辽宁省','吉林省','黑龙江省','重庆市','内蒙古自治区'],p=>{$scope.provinces_price_map['中通'][p]=10});
    _.each(['甘肃省', '青海省','宁夏自治区','新疆自治区','西藏自治区'],p=>{$scope.provinces_price_map['中通'][p]=10});

    //for 申通
    _.each($scope.provinces,p=>{$scope.provinces_price_map['申通'][p]=11})
    _.each(['上海市','浙江省','江苏省'],p=>{$scope.provinces_price_map['申通'][p]=6})
    _.each(['安徽省'],p=>{$scope.provinces_price_map['申通'][p]=8})
    _.each(['甘肃省', '青海省','宁夏自治区'],p=>{$scope.provinces_price_map['申通'][p]=15});
    _.each(['新疆自治区','西藏自治区','内蒙古自治区'],p=>{$scope.provinces_price_map['申通'][p]=22});


    console.log('get pro,price->map',$scope.provinces_price_map);

    $scope.updateShipPrice=function(ship_corp,province){
      if(ship_corp) {
        console.log('get ships ', ship_corp);
        $scope.order.ship_corp = ship_corp;
      }
      if(province) {
        $scope.order.ship_fee =  $scope.provinces_price_map[ship_corp][province];
        $scope.order.ship_prov = province;
        console.log('set ship_prov',$scope.order.ship_prov)
      }

    }
    console.log('get len order detail', $scope.order)
    function refreshStatus(order) {
      $scope.view_t = order.orderStatus == '待支付' ? '支付' : '详情';
      var isPaid = order.orderStatus != '待支付';
      $scope.use_click= isPaid;
      console.log('len pay order', order)
      console.log('is paid', isPaid)
      $scope.sh={ship: order.ship_corp || '', ship_province: order.ship_prov || ''}
      $scope.s = {
        showPay: !isPaid,
        showStatus: isPaid,
        enableEdit: !isPaid
      }
    }
    function payOk(order) {
      order.paid = 1;
      $rootScope.user.receiver_name = $rootScope.user.receiver_name || order.buy_receiver;
      $rootScope.user.receiver_phone = $rootScope.user.receiver_phone || order.buy_receiver_phone;
      $rootScope.user.receiver_address = $rootScope.user.receiver_address || order.buy_address;
      UserService.update();
      order.$save({update_pay:1},function(order){
        refreshStatus(order);
        $scope.use_click= true;
        BaseService.showFlashMessage('支付已成功');
        $scope.s={
          showPay: false,
          showStatus: true,
          enableEdit: false
        }
        ShopOrders.findLen($scope.id,order)
        LenOrderService.setNewRe(undefined);
      });
    }
    $scope.payNow = function(order, field) {
      if(!order.buy_receiver||!order.buy_receiver_phone||!order.buy_address){
        BaseService.showFlashMessage('收货信息不全，请完善！');
        return false;
      }
      if(!order.ship_fee){
        BaseService.showFlashMessage('请选择快递方式!')
        return false;
      }
      if ($scope.test && typeof WeixinJSBridge == 'undefined') {
        return payOk(order, field);
      }
      var price = $scope.order.total_price + $scope.order.ship_fee;
      price = parseInt(price*100);
      if ($scope.test) price = 1;
      BaseService.weixinPay($scope.user.wx_id, order.sn+(field?'a':''), price, function (err) {
        if (!err) {
          payOk(order, field);
        } else {
          if (err.indexOf('cancel')<0)
            alert('未知错误,'+err,'popup-danger');
        }
      }, 'n_lens_order');
    };
    console.log('order: ',$scope.order);
    $scope.uClick=function(){
      $scope.use_click=!$scope.use_click;
      if(!$scope.use_click){
        console.log("提示:",'可编辑状态');
        $("#buy_receiver").focus();
      }else{
        console.log("提示:",'保存状态：'+$scope.order.buy_receiver,$scope.order.receiver_address);
        $rootScope.user.receiver_name = $rootScope.user.receiver_name || $scope.order.receiver;
        $rootScope.user.receiver_address = $rootScope.user.receiver_address || $scope.order.receiver_address;
        UserService.update();
        $scope.order.$save();
      }
    }

  })
  .controller('LenChartCtrl',function($scope,ChartLens,$ionicPopup,SvrShare,$rootScope,$q,NLensOrder,BaseService,LenOrderService){
    console.log('in lens chart crtl')
    $scope.pairs= ChartLens.getItems();
    $scope.get_total_price = function(){
      "use strict";
      return ChartLens.getItems().map((item)=>{
        return item.price
      }).reduce((x,y)=>{return x+y},0)
    }
    $scope.newuser={};
    $scope.login = SvrShare.setupLogin($scope);
    console.log('get items form svs',$scope.items)
    function deleteGoodsPopUp(idx, penddingRemoveGs,penddingRemovePrice){
      $ionicPopup.show({
        //templateUrl: '<div>删除该商品？</div>',
        subTitle: '<div>删除该商品？</div>',
        scope: $scope,
        buttons: [
          { text: '取消' },
          {
            text: '<b>确定</b>',
            type: 'button-positive',
            onTap: function() {
              console.log('get cur idx to delete',idx);
              $scope.pairs.splice(idx,1);
              ChartLens.rmLineItem(idx);
              $scope.totalNum = penddingRemoveGs;
              $scope.finalPrice -= penddingRemovePrice;
            }
          }
        ]
      }).then(function(res){
      })
    }
    $scope.isNotValidOrder=function(){
      for(var i=0; i<$scope.pairs.length;i++){
        if($scope.pairs[i].warn) return true;
      }
      return $scope.finalPrice==0;
    };
    $scope.finalPrice =ChartLens.getTotalPrice();
    $scope.totalNum = ChartLens.getTotalNum;
    $scope.inc=function(e,item){
      e.preventDefault();
      e.stopPropagation();
      item.num = parseInt(item.num)+1;
      item.warn= item.num> item.stockLimit && 1 || 0;
      item.price  += item.s_price;
      $scope.finalPrice  += item.s_price;
      $scope.totalNum+=1;
    };
    $scope.dec=function(e,item,idx){
      e.preventDefault();
      e.stopPropagation();
      item.num -=1;
      if(item.num==0){
        item.num=1;
        deleteGoodsPopUp(idx,1,item.s_price);
        return
      }
      item.warn= item.num > item.stockLimit && 1 || 0;
      item.price = item.s_price * item.num;
      $scope.finalPrice= item.s_price;
      $scope.totalNum -=1;
    };
    $scope.ensureValidNum=function(item){
      if(item.num &&  parseInt(item.num)>0) return;
      item.num = item.p_num;
    };
    // num change
    $scope.updatePrice=function(item,old_num,idx){
      console.log('old num,new num',old_num,item.num);
      if(item.num &&  parseInt(item.num)>0) {
        // 用户删除后 重新填写数量
        if(!old_num || parseInt(old_num)<=0)
          old_num = item.p_num;
        item.warn= item.num> item.stockLimit && 1 || 0;
        item.price = item.s_price * item.num;
        $scope.finalPrice += item.price - item.s_price * old_num;
        $scope.totalNum += item.num - old_num
      }else if(item.num == '0'){
        item.num= item.p_num;
        deleteGoodsPopUp(idx,item.p_num,item.p_num* item.s_price);
      }
      else
        item.p_num= old_num;
    };
    $scope.login = SvrShare.setupLogin($scope)
    //结算
    $scope.goNext= function(){
      if(!$scope.user.user_phone){
        $scope.login();
        return;
      }
      if(ChartLens.getItems().length==0){
        BaseService.showFlashMessage('购物车为空哦~~');
        return;
      }
      var lenOrder = new NLensOrder({
        user_phone : $scope.user.user_phone,
        paid : 0,
        status: '待支付',
        total_price: $scope.get_total_price(),
        buy_receiver: $scope.user.receiver_name || '',
        buy_receiver_phone: $scope.user.receiver_phone || '',
        buy_address: $scope.user.receiver_address || ''
      })
      lenOrder.$save({},function(o){
        var items = $scope.pairs.map((p)=>{
          p.lens_order_id = o.id;
          p.attrs= p.attrs.map(attr=>{
            return [attr.name,attr.value].join(':')
          }).join(',')
          return p.$save().$promise;
        })
        $q.all(items).then(function(){
          o.items = $scope.pairs;
          BaseService.showFlashMessage('提单提交成功!');
          LenOrderService.setNewRe(o);
          ChartLens.clearItems();
          $scope.pairs = ChartLens.getItems();
          $rootScope.lensOrders.unshift(o);
          $rootScope.epjGo('/full/len-pay',{id: o.id});
        })

      })
    }
    $scope.newuser={};
    $scope.verify_code={};
  })
  .controller('LenProductCtrl',function($scope,NGoodsLens){
    console.log('in lens product crtl')
   // $scope.goods = NGoodsLens.query();
    NGoodsLens.query(function(gd){
      $scope.goods=gd;
      $scope.pairs=[];
      var i,chunk=2;
      for(i=0;i<gd.length;i+=chunk){
        $scope.pairs.push(gd.slice(i,i+chunk));
      }
      console.log('get goods',$scope.pairs);
    })
  })
  .controller('LenAccountCtrl',function($scope,SvrShare){
    console.log('in lens acc crtl')
    $scope.login = SvrShare.setupLogin($scope);
  })
  .controller('LensCatCtrl', function($scope,$stateParams,NGoodsLens){
    console.log("in lens cat");
    NGoodsLens.get({id: $stateParams.id},function(len){
      "use strict";
      $scope.allIors = _.keys(len.data);
      $scope.gid = len.id;

    })
  })

  .filter('addSign',function($filter){
    return function(num){
      if (_.isUndefined(num)) return num;
      var numStr = $filter('number')(num,2);
      if(num>0)
        return '+'+numStr
      return  numStr
    }
  })
  .controller('LensDetailCtrl',function($scope,$stateParams,$location,NGoodsLens,BaseService,ChartLens,$timeout,$rootScope){
    console.log('in len detail')
    $rootScope.user.$promise.then(function(){
      console.log('len detail get user promise,',$rootScope.user);
    })
    console.log('len detail get user',$rootScope.user);
    function startsWith(str1, str2) {
      return str1.slice(0, str2.length) == str2;
    }
    $scope.len={num:1,penddingAdd:0}
    $scope.refract = $location.search()['refract'];
    NGoodsLens.get({id: $stateParams.id},function(len){
      $scope.len = angular.extend($scope.len, len);
      $scope.hasAxis = len.name.indexOf('偏光') > -1 || len.name.indexOf('渐进')>-1;
      $scope.isProgress = len.name.indexOf('渐进') > -1;
      $scope.refracts = _.keys(len.data)
      $scope.lenData = len.data
      if($rootScope.user.lens=='dealer')
        for(let k in $scope.lenData) {
          if($scope.lenData[k].cyl.price_dealer)
          $scope.lenData[k].cyl.price =$scope.lenData[k].cyl.price_dealer
          if($scope.lenData[k].sph.price_dealer)
            $scope.lenData[k].sph.price =$scope.lenData[k].sph.price_dealer
        }
      console.log('get lenData',$scope.lenData);

      if(len.multi_attrs)
        $scope.multi_attrs= len.multi_attrs.split('|').map(function(kv){
          console.log('get kv',kv)
          kv = kv.split(',');
          return {name:kv[0],value:kv[1],price: startsWith(kv[1],'¥')? parseInt(kv[1].split('¥')[1]):0}
        });
      console.log('get multi_attrs',$scope.multi_attrs);
      var sphPrices = _.chain($scope.lenData).map((value,key)=>{
        return [value.sph.price,value.cyl.price]
      }).flatten().value().sort((a,b)=>{return a-b});
      console.log('get sph prices',sphPrices)
      $scope.priceRegion = sphPrices[0]+'~'+sphPrices[sphPrices.length-1];
      $scope.attrs=[];
      $scope.len.attrs=[];
      [1,2,3,4].forEach(i=>{
          if(len['attr'+i]) {
            console.log('get attr'+i, len['attr'+i],len['value'+i]);
            var attr = {index: i, name: len['attr'+i],values: len['value'+i].split(' ')}
            $scope.attrs.push(attr);
            $scope.len.attrs.push({index:1 ,name: len['attr'+i]});
          }
        })
      //内渐进镜片 独有 add 属性 +25~+300 步进25
      if($scope.isProgress)
        $scope.adds= _.range(75,300+25,25);
    });
    //多属性可选
    $scope.len.attrsPrice = 0;
    $scope.toggleAttr=function(attr){
      attr.isSelect=!attr.isSelect
      $scope.len.attrsPrice = 0;
      _.each($scope.multi_attrs, (attr)=>{if(attr.isSelect) $scope.len.attrsPrice+=attr.price});
    };

    //
    $scope.angles=_.range(0,181,1);
    $scope.attrChanged = function(i,attrV){
      $scope.len.attrs[i].value = attrV;
      console.log('attr changed:', i,$scope.len)
    }
    /*
     现片共有如下几类：
     偏光、炫彩偏光的单片（不带散光）
     炫彩 1.56：0~-6带0~-2     1.60： 0~-8带0~-2
     非球面镜片1.74：-4~-15无散光、-4~-12带0~-2
     */
    function checkCanFetchNow(){
      console.log('can fetch now: ', $scope.len);
      if($scope.len.name=='偏光镜片' && $scope.len.cyl==0)
        return true;
      if($scope.len.name=='炫彩镜片')
        return true;
      if($scope.len.name=='炫彩偏光镜片' && !$scope.len.cyl)
        return true;
      if($scope.len.name=='非球面镜片' && $scope.len.refract=='1.74' && $scope.len.sph>=-15 && $scope.len.sph<=-4 && $scope.len.cyl==0)
        return true;
      if($scope.len.name=='非球面镜片' && $scope.len.refract=='1.74' && $scope.len.sph>=-12 && $scope.len.sph<=-4 && $scope.len.cyl>=-2 && $scope.len.cyl<=0)
        return true;
      if($scope.len.name=='夜视镜' && !$scope.len.cyl)
        return true;
      return false;
    }
    $scope.checkCanFetchNow=checkCanFetchNow;
    function sphValid(sph){
      if(sph==undefined)
        return true;
      return sph==undefined || sph<=$scope.sph.high && sph>=$scope.sph.low || sph>=$scope.sph.high && sph<=$scope.sph.low;
    }
    $scope.updateSelect =function(refract,sph,cyl){
      $scope.len.refract = refract;
      $scope.cyl = $scope.lenData[refract].cyl;
      $scope.sph= $scope.lenData[refract].sph;
      $scope.gl = $scope.lenData[refract].gl
      var  spos = $scope.sph.low < $scope.sph.high ? 1 : -1;
      var cpos = $scope.cyl.low < $scope.cyl.high ? 1 : -1;
      console.log('get cyl low,high',$scope.cyl.low,$scope.cyl.high);
      var cyls = _.range($scope.cyl.low,$scope.cyl.high+0.25*cpos, 0.25 * cpos);
      $scope.cyls = _.without(cyls,-0.25,0.25);
      if (_.first($scope.cyls) != 0)
        $scope.cyls.unshift(0);
      var sphs= _.range($scope.sph.low,$scope.sph.high+0.25*spos, 0.25 * spos);
      $scope.sphs = _.without(sphs,-0.25,0.25)
      if(!sphValid($scope.len.sph)) {
        $scope.len.sph=undefined;
      }
      if($scope.len.cyl!=undefined && $scope.len.sph != undefined && $scope.gl && (Math.abs($scope.len.sph+ $scope.len.cyl) > Math.abs($scope.gl))){
        BaseService.showFlashMessage('超过联合光度限制!')
        $scope.len.cyl= undefined
      }
      if(refract !=undefined && $scope.len.sph!=undefined && $scope.len.cyl!=undefined) {
        $scope.len.price= $scope.lenData[refract].sph.price;
        if(cyl!=0)
         $scope.len.price = $scope.lenData[refract].cyl.price;
      } else {
        $scope.len.price = 0;
      }
      if($scope.len.price>0)
        $scope.len.price += $scope.len.penddingAdd;
      $scope.canFetchNow=checkCanFetchNow();
    }

    $scope.getProductNum = function () {
      return ChartLens.getItems().length;
    }
    $scope.inc=function(e,item){
      e.preventDefault();
      e.stopPropagation();
      item.num = parseInt(item.num)+1;
      item.warn= item.num> item.stockLimit && 1 || 0;
    };
    $scope.dec=function(e,item,idx){
      if(item.num==1)
        return;
      e.preventDefault();
      e.stopPropagation();
      item.num -=1;
      item.warn= item.num > item.stockLimit && 1 || 0;
    };
    $scope.addToChart=function(isBuyThis){
      for(var i=0;i<$scope.len.attrs.length;i++)
        if(!$scope.len.attrs[i].value){
          BaseService.showFlashMessage('请选择'+$scope.len.attrs[i].name)
          return false;
        }
      if(!$scope.len.refract) {
        BaseService.showFlashMessage('请选择折射率')
        return false
      }
      if($scope.len.sph ==undefined) {
        BaseService.showFlashMessage('请选择度数')
        return false
      }
      if($scope.len.cyl ==undefined) {
        BaseService.showFlashMessage('请选择散光')
        return false
      }
      if($scope.len.cyl && $scope.len.cyl!=0 && $scope.hasAxis &&  $scope.len.axis==undefined){
        BaseService.showFlashMessage('请选择轴位')
        return false
      }
      if($scope.isProgress && !$scope.len.add){
        BaseService.showFlashMessage('请选择ADD')
        return false;
      }
      if($scope.isProgress && $scope.len.add)
        $scope.len.attrs.push({index: -1,name:'ADD',value:$scope.len.add});
      let allAttrs = _.clone($scope.len.attrs);
      if($scope.multi_attrs && $scope.multi_attrs.length>0)
        _.each($scope.multi_attrs,ma=>{
          if(ma.isSelect)
            allAttrs.push({index: -1,name: ma.name,value: '+'+ma.price});
        })
      if(isBuyThis) {
        ChartLens.clearItems();
      }
      console.log('get price',$scope.len.price + $scope.len.attrsPrice)
      ChartLens.addLineItem($scope.len ,parseInt($scope.len.num),$scope.len.price+$scope.len.attrsPrice,$scope.len.refract,$scope.len.sph,$scope.len.cyl,
        allAttrs,$scope.len.remark,$scope.len.axis);
      if(isBuyThis)
        $rootScope.epjGo('/ltab/chart')
    }
  })
  .controller('LenAccountMyCtrl',function($scope){

  })
  .controller('LenAccountOrdersCtrl', function($scope,$ionicPopup,BaseService,ShopOrders){
    $scope.cancel = function(e,order){
      e.preventDefault();
      e.stopPropagation();
      $ionicPopup.show({
        template:'订单一旦取消就无法恢复，您确定取消吗？',
        title:'取消订单',
        buttons:[{
          text:'取消'
        },{
          text:'确定',
          type: 'button-positive',
          onTap:function(){
            console.log('in cancel order');
            var oid = order.id;
            ShopOrders.removeLen(oid);
            order.$delete({},function(){
              BaseService.showFlashMessage('订单取消成功！');
              console.log('after order delete');
            })
          }
        }]
      })
    }
  })
  .service('LenOrderService',function(NLensLineOrder,NLensOrder,$rootScope){
    var newOrder = undefined;
    return {
      setNewRe: function(returnOrder){
        newOrder = returnOrder
      },
      getNewRe: function(){
        return newOrder;
      },
      addOrder: function(order){
        "use strict";
        $rootScope.lensOrders.unshift(order);
      }
    }
  })
  .service('ChartLens',function($ionicPopup,NLensLineOrder){
    var lineItems = [];
    function createOrderLine(item_id,num,single_price,name,pic,refract,sph,cyl,attrs,remark,axis){
      return new NLensLineOrder({
        len_id : item_id,
        num: num || 1,
        s_price: single_price,
        price: single_price * num,
        name: name,
        pic: pic,
        refract: refract,
        sph: sph,
        cyl: cyl,
        attrs: attrs,
        remark: remark,
        axis: axis,
        warn: 0,
        stockLimit: 1000,
      })
    }
    return {
      has: function(goods){
        var ids= lineItems.map(item=>{ return item.item_id});
        return ids.indexOf(goods.id)>-1
      },
      addLineItem: function(goods,num,price,refract,sph,cyl,attrs,remark,axis){
        var idx = -1;
        for(var i=0; i< lineItems.length;i++){
          if(lineItems[i].len_id == goods.id && lineItems[i].refract==refract && lineItems[i].sph==sph && lineItems[i].cyl==cyl && attrs.length ==0){
            idx = i;
            break;
          }
        }
        if(idx>-1){
          lineItems[idx].num +=1;
          lineItems[idx].price += lineItems[idx].s_price;
        }
        else
          lineItems.push(createOrderLine(goods.id,num,price,goods.name,goods.pic,refract,sph,cyl,attrs,remark,axis))
      },
      dec: function(goods){
        console.log('in p d dec');
        var ids= lineItems.map(item=>{ return item.item_id});
        var idx = ids.indexOf(goods.id);
        if(idx>-1){
          lineItems[idx].num -=1;
          lineItems[idx].price -= lineItems[idx].s_price;
          if(lineItems[idx].num==0)
            lineItems.splice(idx,1)
        }

      },
      rmLineItem: function(index){
        lineItems.splice(index,1)
      },
      rmGoods : function(goods){
        var ids= lineItems.map(item=>{ return item.item_id});
        var idx = ids.indexOf(goods.id);
        if(idx>-1){
          lineItems.splice(idx,1)
        }

      },
      getTotalNum: function(){
        let sum =0;
        for(var l=0; l< lineItems.length; l++){
          sum+= parseInt(lineItems[l].num)
        }
        return sum;
      },
      getTotalPrice: function(){
        let sum =0;
        for(var l=0; l< lineItems.length; l++){
          sum+= parseInt(lineItems[l].price)
        }
        return sum;
      },
      getItems : function(){
        return lineItems;
      },
      clearItems: function(){
        lineItems = [];
      }
    }
  })
.controller('LenAboutCtrl', function($scope){
  $scope.refresh = function() {
    localStorage.clear();
    $scope.redirect(location.href)
  }
})



/** WEBPACK FOOTER **
 ** ./js/ctrl-lens.js
 **/
