'use strict';

angular.module('starter.controllers')
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    // for supplier
      .state('stab',{
        url: '/stab',
        abstract: true,
        template: require('../templates/stab.html'),
      })
      .state('stab.index',{
        url: '/index',
        views: {
          'stab-index': {
            template: require('../templates/stab-index.html'),
            controller: 'SIndexCtrl'
          }
        }
      })
      .state('stab.dealer',{
        url: '/dealer',
        views: {
          'stab-dealer': {
            template: require('../templates/stab-dealer.html'),
            controller: 'SDealerCtrl'
          }
        }
      })
      .state('stab.orders',{
        url: '/orders',
        views: {
          'stab-orders': {
            template: require('../templates/stab-orders.html'),
            controller: 'SOrdersCtrl'
          }
        }
      })
      .state('stab.stocks',{
        url: '/stocks',
        views: {
          'stab-stock': {
            template: require('../templates/stab-stocks.html'),
            controller: 'SStocksCtrl'
          }
        }
      })
      .state('sfull', {
        url: '/sfull',
        abstract: true,
        template: require('../templates/sfull.html'),
      })
      .state('sfull.product', {
        url: '/product/:id',
        views: {
          'sfull': {
            template: require('../templates/shared-product.html'),
            controller: 'SaasProductCtrl'
          }
        }
      })
      .state('sfull.order-detail', {
        url: '/order-detail/:id',
        views: {
          'sfull': {
            template: require('../templates/shared-order-detail.html'),
            controller: 'SaasOrderDetailCtrl'
          }
        }
      })
      // for dealer
      .state('dfull', {
        url: '/dfull',
        abstract: true,
        template: require('../templates/dfull.html'),
      })
      .state('dfull.orders', {
        url: '/orders',
        views: {
          'dfull': {
            template: require('../templates/dfull-orders.html'),
            controller: 'DOrdersCtrl'
          }
        }
      })
      .state('dfull.chart', {
        url: '/chart',
        views: {
          'dfull': {
            template: require('../templates/dfull-chart.html'),
            controller: 'DChartCtrl'
          }
        }
      })
      .state('dfull.product', {
        url: '/product/:id',
        views: {
          'dfull': {
            template: require('../templates/shared-product.html'),
            controller: 'SaasProductCtrl'
          }
        }
      })
      .state('dfull.order-detail', {
        url: '/order-detail/:id',
        views: {
          'dfull': {
            template: require('../templates/shared-order-detail.html'),
            controller: 'SaasOrderDetailCtrl'
          }
        }
      })
    $urlRouterProvider.when('/sfull/index', '/stab/index')
      .when('/dfull/index', '/dfull/orders')
  })
  .controller('SIndexCtrl',function($scope){
    console.log('in sf index ctrl');
  })
  .controller('SDealerCtrl',function($scope, NUser,$ionicListDelegate){
    console.log('in sf dealer ctrl');
    $scope.user.$promise.then(function(){
      $scope.dealers = NUser.query({seller:$scope.user.seller||-1});
    });
    $scope.setStatus=function(dl,status){
      dl.dealer_status = status;
      dl.$save();
      $ionicListDelegate.closeOptionButtons();
    }
    $scope.statusShow = function(status) {
      return status == 'pass' ? '已通过' : (status == 'reject' ? '已拒绝' : '待审核');
    }
  })
  .controller('SOrdersCtrl',function($scope,NOrderSupply,BaseService,$ionicListDelegate,$timeout){
    console.log('in sf order ctrl')
    $scope.filterBy= function(status){
      $scope.state= status;
      $scope.orders = $scope.state == 'paid' ? $scope.allOrders.filter((o)=>{ return o.status == 'paid' || o.status=='processing'; }) : $scope.allOrders;
    }
    function retriveOrders() {
      NOrderSupply.query({seller:$scope.user.seller, order_:'create_time desc', user_phone:$scope.subapp()=='dfull'?($scope.user.user_phone||-1):null}, function (data) {
        $scope.allOrders = data;
        $scope.filterBy($scope.state || 'paid');
      })
    }
    $scope.user.$promise.then(retriveOrders);
    $scope.getOp = function(order) {
      return {'paid':'审核', 'processing':'发货'}[order.status];
    }
    $scope.changeState=function(order,status,e){
      e.preventDefault();
      e.stopPropagation();
      $ionicListDelegate.closeOptionButtons();
      $timeout(()=>{ //避免受到两个消息,微信中出现
        if (status == 'paid') order.status = 'processing';
        else if (status=='processing') order.status = 'shipped';
        order.$save({},function(data){
          BaseService.showFlashMessage('设置成功!')
          $scope.filterBy($scope.state || 'paid');
        })
      }, 100)
    }
    $scope.refresh=function(){
      retriveOrders();
    }
  })
  .controller('SaasProductCtrl',function($scope,$ionicSlideBoxDelegate,$stateParams,NGoods2,$location){
      $scope.index=0;
      $scope.gid=$stateParams.id;
      var array=[0,1,2,3,4];
      NGoods2.get({id:$scope.gid, buy_records: 1},function(s){
        $scope.goods=s.goods;
        $scope.orders = s.records;
        $scope.goods_details=[];
        array.forEach(function(i){
          if($scope.goods['img_detail_'+ i]){
            $scope.goods_details.push($scope.goods['img_detail_'+ i]);
          }
        })
        $ionicSlideBoxDelegate.update();
      })
      $scope.go = function(index){
        $ionicSlideBoxDelegate.slide(index);
      }
  })

  .controller('SStocksCtrl',function($scope,NGoods2){
    console.log('in saas stock ctrl')
    $scope.user.$promise.then(function() {
      $scope.gds = NGoods2.query({seller:$scope.user.seller || -1,limit_: 50});
    });
  })
    // for dealer
  .controller('DOrdersCtrl',function($scope,NOrderSupply,$rootScope){
    console.log('DOrdersCtrl called');
    $scope.scanMultiple = function() {
      $scope.epjGo('/sfull/chart', {qr:1});
    }
    $rootScope.$on('newOrderEvent',function(e,newOrder){
      console.log('new order arrived',newOrder)
      $scope.suOrders.unshift(newOrder);
    })
    $scope.scan = $scope.scanMultiple;
    $rootScope.user.$promise.then(function(){
      if ($rootScope.user.user_phone) {
        $scope.suOrders = NOrderSupply.query({user_phone:$scope.user.user_phone,order_:'create_time desc'});
      }
    })
  })
  .controller('SaasOrderDetailCtrl',function($scope,$stateParams,NOrderLine,NOrderSupply,BaseService){
    $scope.order = NOrderSupply.get({id: $stateParams.id});
    $scope.pay = function() {
      if (!$scope.order.pay_method) { return BaseService.showFlashMessage('请选择支付方式');}
      if (!$scope.order.ship_company) { return BaseService.showFlashMessage('请选择快递方式');}
      $scope.order.status = 'paid';
      BaseService.showFlashMessage('支付完成');
      $scope.order.$save();
    }
    $scope.finish = function() {
      $scope.order.status = 'finished';
      $scope.order.$save();
    }
    $scope.goProduct = function (gid) { $scope.epjGo(`${$scope.subapp()}/product/${gid}`)}
  })
  .controller('DChartCtrl',function($rootScope,$scope,NGoods2,$location,$ionicModal,NOrderLine,NOrderSupply,BaseService,$q,$ionicPopup,$ionicScrollDelegate){
    console.log('DChartCtrl called');
    $scope.items = [];
    function load(){
      $scope.allGoods = NGoods2.query({seller:$scope.user.seller || -1,limit_:50}, function(all) {
        all.sort(function(g1, g2) { return g1.sn.localeCompare(g2.sn); });
        _.each(all, function(g) {
          g.num = 0;
        })
        updateChart();
      });
    }
    $rootScope.$on('loggedIn', load);
    $rootScope.user.$promise.then(load)
    $scope.changeView = function (view) {
      $scope.view = view;
      $scope.citems = view == 'all' ? $scope.allGoods : $scope.items;
      if (view == 'chart') {
        $ionicScrollDelegate.resize();
      }
    }
    $scope.changeView('chart');
    function updateChart() {
      $scope.items.length = 0;
      $scope.totalGlasses = 0;
      $scope.final_price = 0;
      _.each($scope.allGoods, (g)=>{
        g.num = parseInt(g.num);
        if (g.num >= 1) {
          $scope.items.push(g);
          $scope.totalGlasses += g.num;
          $scope.final_price += g.num * g.shop_price;
        }
      });
    }
    $scope.updateChart = updateChart;
    function clearChart() {
      _.each($scope.allGoods, (g) => {
        g.num = 0;
      })
      updateChart();
    }
    $scope.isNotValidOrder=function(){
      for(var i=0; i<$scope.items.length;i++){
        if($scope.items[i].num > $scope.items[i].ss_stock) return true;
      }
      return $scope.final_price==0;
    }
    $scope.inc=function(item){
      item.num = parseInt(item.num)+1;
      updateChart();
    }
    $scope.dec=function(item){
      if ($scope.view == 'chart' && item.num == 1) {
        return $ionicPopup.show({
          subTitle: '<div>删除该商品？</div>',
          scope: $scope,
          buttons: [
            { text: '取消' },
            {
              text: '<b>确定</b>',
              type: 'button-positive',
              onTap: function(e) {
                console.log('get cur idx to delete')
                item.num -= 1;
                updateChart();
              }
            }
          ]
        })
      }
      if (item.num == 0) return;
      item.num -=1;
      updateChart();
    }
    $scope.ensureValidNum=function(item){
      if(item.num &&  parseInt(item.num)>0) return;
      item.num = item.p_num;
    }
    $scope.scan2 = function() {
      console.log('scan2 called');
      if(!isWeixin()){
        $scope.scanOne();
        return;
      }
      wx.scanQRCode({
        needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
        scanType: ["qrCode","barCode"], // 可以指定扫二维码还是一维码，默认二者都有
        success: function(res) {
          if(typeof res === 'string')
            res= JSON.parse(res);
          var goods_id_str = res.resultStr.split('/').pop();
          var goods_id = parseInt(goods_id_str);
          for (let i in $scope.allGoods) {
            let g = $scope.allGoods[i];
            if (goods_id == g.id) {
              $scope.inc(g);
              $scope.$apply();
              return;
            }
          }
          NGoods2.get({id: goods_id},function(goods){
            let p = _.sortedIndex($scope.allGoods, goods, 'sn');
            goods.num = 1;
            $scope.allGoods.splice(p, 0, goods);
            updateChart();
          })
        }
      });
    }
    $scope.submit=function(){
      if(!$scope.user.user_phone){
        BaseService.showFlashMessage('请登录!');
        return;
      }
      var newSsOrder= new NOrderSupply({
        user_name: $scope.userinfo.nickname,
        total_price: $scope.final_price,
        user_phone: $scope.user.user_phone,
        total_glasses: $scope.totalGlasses,
        create_time: nowStr()
      })
      newSsOrder.$save({},function(order){
        var lines= $scope.items.map(function(t){
          return new NOrderLine({
            order_id:order.id,
            goods_id:t.id,
            num:t.num,
            goods_img: t.img_thumb,
            name: t.name,
            total_price: t.num * t.shop_price,
          });
        })
        order.items = lines;
        $q.all(lines.map(function(l) { return l.$save().$promise})).then(
          function(){
            BaseService.showFlashMessage('提交成功!');
            $rootScope.epjGo('/dfull/orders')
            $rootScope.$emit('newOrderEvent',order)
            clearChart();
        },function(err){
            BaseService.showFlashMessage('提交失败!')
        })
      })
    }
    if (!isWeixin()) {
      $scope.scanOne = function(){
        console.log('scan pc called')
        if ($scope.items.length < $scope.allGoods.length) {
          $scope.allGoods[$scope.items.length].num = 1;
          updateChart();
        } else {
          alert('无法添加更多商品');
        }
      }
    }
  })
  .filter('orderStatusSupply', function(){
    return function (s) {
      return {pendding:'待支付',paid:'待审核',processing:'待发货',shipped:'已发货',finished:'已完成'}[s] || '未知状态';
    }
  })





/** WEBPACK FOOTER **
 ** ./js/ctrl-sass.js
 **/
