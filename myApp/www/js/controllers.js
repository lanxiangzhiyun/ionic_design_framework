angular.module('starter.controllers', [])
  .controller('IndexCtrl', function($scope,$rootScope,$location,SvrShare,UserService,LensPrice,WishGoods,$http,CouponService,ChartLens) {
    console.log("IndexCtrl called: url:", location.href, ' path: ', $location.path(), ' search:', $location.search());
    //debugger;
    SvrShare.setupSharedFuncs();
    var test = $location.search().test || localStorage.test || location.host != 'epeijing.cn';
    if (test) {
      localStorage.test = test;
    }
    $rootScope.test = test;
    $rootScope.storagePrefix = 'corp.';
    var rec = $location.search().rec;
    if (rec) {
      localStorage.prec = rec;
    }
    var entry = '/full/pay';
    //split by ? to handle /corp/?from=single#/full/product-detail/633
    $rootScope.entryPoint = location.href.split('#')[0].split('?')[0] + '#' + entry;
    if (!$location.search()['from-url']) {
      var userinfo = $location.search().userinfo || localStorage.userinfo;
      console.log('userinfo: ', userinfo);
      if (!userinfo || userinfo.length < 200) { //for last version
        if ($location.path() && $location.path() != entry) {
          $rootScope.setLocal('lastPage', $location.path()); // save last page, go there when oauth finished
          $rootScope.setLocal('lastQuery', JSON.stringify($location.search())); // save last page, go there when oauth finished
        }
        if (isWeixin()) {
          return redirectOAuth($rootScope.entryPoint, config.app_id);
        }
        console.log('请在微信中打开');
        return;
      }
      if (isWeixin() && $location.path() != entry) { //微信支付连接的限制与苹果上的url不变化导致了必须从指定的入口url进入,极其恶心的东西
        $rootScope.setLocal('lastPage', $location.path());
        $rootScope.setLocal('lastQuery', JSON.stringify($location.search())); // save last page, go there when oauth finished
        return $rootScope.redirect($rootScope.entryPoint);
      }
      localStorage.userinfo = userinfo;
      $rootScope.userinfo = userinfo = JSON.parse(userinfo);
    } else {
      $rootScope.userinfo = localStorage.userinfo || '{"openid":"ttt"}';
    }
    $rootScope.wx_id = $rootScope.userinfo.openid;
    if (typeof wx != 'undefined' && !_.last(location.hostname.split('.')).match(/^\d+$/)) {
      $rootScope.configWeixin();
    }
    $rootScope.getTotalPrice = function (order) {
      var p = order.buy_total_price + (order.buy_other_price || 0);
      return Math.round(p * 100) / 100;
    }
    $rootScope.clipImage = SvrShare.setupClipImage($scope);
    $rootScope.calSize = function (e) {
      var doc = $(document);
      var hs = doc.height();
      if (hs <= 50 && $rootScope.try) return;
      var header_height = 45;
      var bottom_height = 0;
      $rootScope.try = {
        doc_height: hs,
        width: doc.width(),
        header_height: header_height,
        bottom_height: bottom_height,
        height: hs - header_height - bottom_height,
      };
      console.log('calSize: ', $rootScope.try, ' e ', e);
      if (e) $rootScope.$apply();
      if ($rootScope.showResult) {
        $rootScope.showResult();
      }
    };
    window.addEventListener('resize', $rootScope.calSize, false);
    $rootScope.calSize();
    UserService.init($rootScope.wx_id).then(function () {
      console.log('in user service init cb');
      var rec = $location.search().rec;
      if (rec) {
        var recm = rec;
        localStorage.prec = rec;
        console.log('get recm', recm);
        if ($scope.user.user_phone) {
          $http.get(pre + '/api/call/util/add_coupon?code=' + recm + '&user_phone=' + $scope.user.user_phone).then(function (res) {
            if (!res.data.success) {
              alert('您输入的优惠码无效: ' + res.data.msg || '');
            }
            else {
              CouponService.reload($rootScope.user.user_phone).then(function () {
                $rootScope.$emit('coupon_event');
              })
              alert('成功添加代金券!');
            }
            localStorage.removeItem('prec');
          });
        }
      }
    });
    $rootScope.getProductNum = function () {
      return WishGoods.getProducts().length;
    }
    //$rootScope.getLenstNum=function(){
    //  return ChartLens.getItems().map((itm)=>{return itm.num}).reduce((x,y)=>{return x+y},0);
    //}
    LensPrice.init();
    $scope.login = SvrShare.setupLogin($scope);
    if (isWeixin() && !$location.search()['from-url']) {
      var page = $rootScope.getLocal('lastPage') || '/tab/product';
      var search = $rootScope.getLocal('lastQuery') || '{}';
      search = JSON.parse(search);
      if (page == '/full/pay') {
        page = '/tab/product';
      }
      $rootScope.setLocal('lastPage', '');
      $rootScope.setLocal('lastQuery', '');
      $location.path(page).search(search);
    }
  })
  .controller('ChartCtrl', function($scope,WishGoods,SvrShare,$rootScope,ShopOrders,BaseService,NCoupon,CouponService,$q) {
    console.log("ChartCtrl called");
    console.log('get user',$rootScope.user);
    $scope.pairs=WishGoods.getProducts();
    $scope.coupon={coupon_gel:0,coupon_lens:0};
    function calcCoupon() {
      $scope.coupon_gel = 0;
      $scope.coupon_lens = 0;
      $scope.coupon.coupon_gel=0;
      $scope.coupon.coupon_lens=0;
      $scope.pending_coupons = [];
      if(WishGoods.getSelectProducts().length==0 )
        return;
      var j= 0,k=0;
      var sels = $scope.pairs.filter(function(p){ return p.notSelected == false});
      for (var i = 0; i < sels.length; i++) {
        var f =sels[i];
        if ( $scope.generalCoupon && j< $scope.generalCoupon.length && f.pzone) {
          $scope.coupon.coupon_gel += parseFloat($scope.generalCoupon[j].value);
          //$scope.coupon_gel += parseFloat($scope.generalCoupon[j].value);
          $scope.pending_coupons.push($scope.generalCoupon[j].code);
          j+=1;
        }
        console.log('get f brand', f.brand, 'not select',f.notSelected);
        if ($scope.lensCoupon && k < $scope.lensCoupon.length  && (f.brand != '普通' || f.type != '1.60')) {
          $scope.coupon.coupon_lens += parseFloat($scope.lensCoupon[k].value);
          //$scope.coupon_lens += parseFloat($scope.lensCoupon[k].value);
          $scope.pending_coupons.push($scope.lensCoupon[k].code);
          k+=1;
        }
      }
      console.log('pending c: ',$scope.pending_coupons);
      console.log('coupon_gel : ',$scope.coupon_gel);
      console.log('coupon_len : ',$scope.coupon_lens);
    }
    $rootScope.$on('coupon_event',function(){
      console.log('get coupon_event');
      loadCoupon();
    })
    function loadCoupon(){
      var coupon= CouponService.get();
      $scope.generalCoupon = coupon.generalCoupon || [];
      $scope.lensCoupon = coupon.lensCoupon || [];
      console.log('get gel coupon:', $scope.generalCoupon);
      console.log('get gel coupon:', $scope.lensCoupon);
    }
    $scope.get_total_price = function(){
      $scope.pairs = WishGoods.getProducts();
      var t=WishGoods.getSelectPrice();
      calcCoupon();
      //$scope.final_price=t- $scope.coupon_gel-$scope.coupon_lens;
      $scope.final_price=t- $scope.coupon.coupon_gel-$scope.coupon.coupon_lens;
      $scope.final_price= $scope.final_price>0 ? $scope.final_price : 0;
      return t;
    }
    $rootScope.user.$promise.then(function() {
      loadCoupon();
      $scope.get_total_price();
    })
    $scope.goNext= function(){
      if(!$scope.user.user_phone){
        $scope.login();
        return;
      }
      if(WishGoods.getProducts().length==0){
        BaseService.showFlashMessage('购物车为空哦~~');
        return;
      }
      if(WishGoods.getSelectProducts().length ==0){
        BaseService.showFlashMessage('请选择眼镜购买!');
        return;
      }
      var order = BaseService.createOrder($rootScope.user,WishGoods,$scope.coupon.coupon_gel+$scope.coupon.coupon_lens,$scope.pending_coupons);
      order.$save({},function(data){

        // use $q
        var tas = $scope.pending_coupons.map(function(cp){
          return NCoupon.save({code: cp, status:'used'});
        })
        $q.all(tas).then(function(){
          console.log('coupon used');
          CouponService.reload($rootScope.user.user_phone).then(function(){
            $rootScope.$emit('coupon_event');
          })
        })
        BaseService.showFlashMessage('订单提交成功!');
        ShopOrders.add(data);
        WishGoods.clear();
        $scope.pairs =WishGoods.getProducts();
        $rootScope.epjGo('/full/pay',{id:data.id});
      })
      console.log('order set',order);
    }
    $scope.newuser={};
    $scope.verify_code={};
    $scope.toggleSelect=function(item){
      WishGoods.toggleSelect(item);
      calcCoupon();
    }
    $scope.login = SvrShare.setupLogin($scope);
    //购物车删除事件
    $scope.onItemDelete = function(item) {
      console.log('from wgs',WishGoods.getProducts());
      console.log('from here',item);
      WishGoods.toggleItem(item,true);
    };
  })

  .controller('ProductCtrl', function($scope,$rootScope,$timeout,$location,$ionicHistory){
  })

  .controller('ProductGoodsCtrl', function($scope,$stateParams,NGoods2){
    console.log('ProductGoodsCtrl called');
    $scope.id=$stateParams.id;
    console.log("id",$stateParams.id);
    var filter = $scope.id == "精选" ? {recommend:1} : {zone:$scope.id};
    filter.on_sale=1;
    NGoods2.query(filter,function(gds){
      $scope.goods=gds;
      $scope.goods.sort(compareSn);
      $scope.pairs=[];
      var i,chunk=2;
      for(i=0;i<gds.length;i+=chunk){
        $scope.pairs.push(gds.slice(i,i+chunk));
      }
      console.log('get goods for '+$scope.id,gds);
    })
    $scope.getDiscount = function(goods) {
      var dis = goods.shop_price / (goods.market_price+$scope.lens_lowest) * 100;
      return Math.round(dis) / 10;
    };
  })
  .controller('ProductDetailCtrl',function($scope,$rootScope,$stateParams,NGoods2,WishGoods,$ionicSlideBoxDelegate){
    console.log("ProductDetailCtrl id",$stateParams.id);
    $scope.index = 0;
    $scope.gid = $stateParams.id;
    var array=[0,1,2,3,4];
    $scope.getLensPrice = function(field) {
      var l = $rootScope.lens_map && $rootScope.lens_map[$scope.lens.select_type] && $rootScope.lens_map[$scope.lens.select_type][$scope.lens.brand] || null;
      return l ? l[field] : 0;
    }
    NGoods2.get({id: $scope.gid},function(data){
      $scope.goods=data;
      $scope.isAdded = WishGoods.has($scope.goods);
      $scope.goods_details=[];
      $scope.goods_models=[];
      array.forEach(function(i){
        if($scope.goods['img_detail_'+ i])
          $scope.goods_details.push($scope.goods['img_detail_'+ i]);
        if($scope.goods['model_'+ i])
          $scope.goods_models.push($scope.goods['model_'+ i]);
      });
      $ionicSlideBoxDelegate.update();
      console.log('get details imgs',$scope.goods_details);
      $scope.checkm={BuyBrand: false};
      if($scope.goods.zone=='品牌'){
        $scope.brand_price = parseFloat($scope.goods.shop_price)-200;
        $scope.checkm={BuyBrand : false};
      }
    });
    $scope.go = function(index){
      $ionicSlideBoxDelegate.slide(index);
    }
    function checkLens() {
      if(!$rootScope.lens_map[$scope.lens.select_type][$scope.lens.brand]) {
        $scope.lens.select_type = '1.60';
        $scope.lens.brand = '普通';
      }
    }
    function extendGood(){
      angular.extend($scope.goods,{
        isBrand: $scope.checkm.BuyBrand || false ,
        pzone: $scope.goods.zone !='特价',
        type: $scope.lens.select_type,
        brand: $scope.lens.brand,
        s_price:parseFloat($scope.checkm.BuyBrand ? $scope.brand_price: $scope.goods.shop_price)+parseFloat($rootScope.lens_map[$scope.lens.select_type][$scope.lens.brand].price),
      })

    }
    $scope.buyNow=function(){
      console.log('in buy now');
      checkLens();
      if(WishGoods.has($scope.goods)) {
        WishGoods.disSelectOthers($scope.goods);
      }
      else{
        WishGoods.disSelectOthers();
        $scope.goods.notSelected=false;
        extendGood();
        WishGoods.addItem($scope.goods);
        $scope.isAdded = true;
      }
      $rootScope.epjGo('/tab/chart');
    }

    $scope.addToChart=function(){
      checkLens();
      if(!WishGoods.has($scope.goods)) {
        $scope.goods.notSelected=false;
        var price_d = $scope.checkm.BuyBrand ? $scope.brand_price : $scope.goods.shop_price;
        extendGood();
        WishGoods.addItem($scope.goods);
        $scope.isAdded = true;
        $rootScope.$broadcast('new_goods_added');
        $(".badge-animate").animate({
          display:'block',
          bottom:'10px',
        },'slow',function(){$(this).hide();$(this).css('bottom','40px')});
        return;
      }
      $rootScope.epjGo('/tab/chart');
    }
    //镜片默认类型
    $scope.lens={
      select_type:'1.60',
      brand : '普通',
    };
  })
  .controller('AccountCtrl', function($scope,SvrShare,UserService,ShopOrders,NOrderShop,$ionicPopup,BaseService,$http,$rootScope,NCoupon,CouponService,NUserOptics,$timeout,$q,$ionicModal) {
    console.log('AccountCtrl called');
    $scope.login = SvrShare.setupLogin($scope);
    $scope.mytype='data';
    $scope.myClickType=function(s){
      $scope.mytype=s;
    }
    $scope.verify_code={};
    $scope.newuser={};
    $scope.doRefresh =function(){
      UserService.reload().then(function(){
        function refreshEnd(){$scope.$broadcast("scroll.refreshComplete");}
        CouponService.reload($rootScope.user.user_phone).then(function(){
          $rootScope.$emit('coupon_event');
        })
        refreshEnd();
      });
    }

  })
  .controller('OrderDetailCtrl',function($scope){

  })
  .controller('TryCtrl', function($scope,$rootScope,SvrShare,$stateParams,NGoods2,$location, $timeout,$http) {
    debugger;
    console.log('TryCtrl called');
    $scope.from = $location.search()['from-url'];
    var hback = $scope.historyBack = function() { location.href = $scope.from; };
    if (isIphone()) {
      $scope.historyBack = function() { $timeout(hback, 100); }
    }
    $rootScope.current = NGoods2.get({id:$stateParams.goods_id||632}, function(){
      $rootScope.showResult && $rootScope.showResult();
    });
    $('#face').attr('src', $rootScope.getLocal('faceImage') || 'static/img/modal2.jpg');
    $rootScope.showResult = SvrShare.setupShowResult($scope);
    $rootScope.showResult(true);
    var file1 =document.getElementById('faceUpload');
    $('#faceUpload').change(function(){
      console.log('file change called');
      getFileContent(file1.files[0]).then(function(result) {
        file1.value = '';
        $rootScope.clipImage(result, function(){ $rootScope.showResult(true); });
      })
    });
    $scope.wxSelect = function () {
      wxChooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'] // 可以指定来源是相册还是相机，默认二者都有
      }).then(function(r) {
        var url = `/api/wx/weixin_image?id=${r[0].serverId}`;
        $rootScope.clipImage(url, function(){ $rootScope.showResult(true); });
      })
    }
  })
  .controller('StarCtrl', function($scope,SvrShare,$rootScope,$ionicHistory) {
    console.log('StarCtrl called');
    SvrShare.setupStarCtrl($scope, function (src) {
      $rootScope.clipImage(src, function(){
        $ionicHistory.goBack(-1);
        $rootScope.showResult(true);
      });
    });
  })
  .controller('BuyCtrl', function($scope,WishGoods,$stateParams,ShopOrders) {
    console.log('BuyCtrl called');


  })
  .controller('PayCtrl', function($scope,$stateParams,ShopOrders,WishGoods,NOrderShop,BaseService,$rootScope,$http,UserService,NGoods2,$timeout,$location) {
    console.log('PayCtrl called');
    $scope.order_id = $location.search().id

    function refreshStatus(order) {
      $scope.order=order;
      $scope.view_t = order.orderStatus=='待支付'?'支付':'详情';
      var isPaid =order.orderStatus!='待支付' ;
      //$scope.use_click=true;
      $scope.use_click = isPaid
      $scope.discount = parseFloat(order.buy_other_price);
      $scope.s={
        showPay: !isPaid,
        showStatus: isPaid,
        enableEdit: !isPaid
      }
    }
    ShopOrders.find($scope.order_id, null, function (order) {
      //NOrderShop.get({id:$stateParams.order_id},function(order) {
      console.log('find order by id', $scope.order_id, order);
      refreshStatus(order);
      var s = JSON.parse(order.buy_comment);
      var ids = s.length == 1 ? s[0].id : s.map(function (gd) {
        return gd.id
      }).join(',');
      console.log('e ids', ids);
      var mGoods = order.buy_goods;
      for (var i = 0; i < s.length; i++) {
        angular.extend(mGoods[i], {
          type: s[i].type,
          brand: s[i].brand,
          s_price: s[i].s_price,
          exchange: s[i].exchange
        })
      }
      $scope.goods = mGoods;
      console.log('pay goods: ', $scope.goods);
      $scope.pay_price = $rootScope.getTotalPrice($scope.order);
      console.log('pay price: ', $scope.pay_price);
    });


    function payOk(order) {
      order.paid = 1;
      $rootScope.user.receiver_name = $rootScope.user.receiver_name || order.buy_receiver;
      $rootScope.user.receiver_phone = $rootScope.user.receiver_phone || order.buy_receiver_phone;
      $rootScope.user.receiver_address = $rootScope.user.receiver_address || order.buy_address;
      UserService.update();
      order.$save({update_pay:1},function(order){
        refreshStatus(order);
        $scope.use_click =true;
        BaseService.showFlashMessage('支付已成功');
        $scope.s={
          showPay: false,
          showStatus: true,
          enableEdit: false
        }
        //if($scope.isFromLen)
        //  ShopOrders.findLen($scope.order_id,order)
        //else {
        ShopOrders.find($scope.order_id, order);
        $rootScope.$emit('pay_ok_event');
        if (order.use_coupons && order.use_coupons.length > 0) {
          var codes = order.use_coupons.split(',').map(function (cp) {
            return "\'" + cp + "\'"
          }).join(',');
          $http.get(pre + '/api/call/util/recm_bonus?codes=' + codes + '&user_phone=' + $rootScope.user.user_phone).then(function (res) {
            console.log('bonus for recm', res.data.coupon);
          })
        }
        $scope.goods.map(function (gd) {
          gd.saled += 1;
          NGoods2.save({id: gd.id, saled: gd.saled}, function () {
            console.log('goods' + gd.name + ' sales' + gd.saled);
          });
        })

      });
    }
    $scope.payNow = function(order, field) {
      if(!order.buy_receiver||!order.buy_receiver_phone||!order.buy_address){
        BaseService.showFlashMessage('收货信息不全，请完善！');
        return false;
      }
      if ($scope.test && typeof WeixinJSBridge == 'undefined') {
        return payOk(order, field);
      }
      var price = $scope.pay_price ;
      price = parseInt(price*100);
      if ($scope.test) price = 1;
      BaseService.weixinPay($scope.user.wx_id, order.sn+(field?'a':''), price, function (err) {
        if (!err) {
          payOk(order, field);
        } else {
          if (err.indexOf('cancel')<0)
            alert('未知错误,'+err,'popup-danger');
        }
      }, 'n_order_shop');
    };
    console.log('order: ',$scope.order);
    $scope.uClick=function(){
      $scope.use_click=!$scope.use_click;
      if(!$scope.use_click){
        console.log("提示:",'可编辑状态');
        $("#buy_receiver").focus();
      }else{
        console.log("提示:",'保存状态：'+$scope.order.buy_receiver,$scope.order.buy_address);
        $rootScope.user.receiver_name = $rootScope.user.receiver_name || $scope.order.buy_receiver;
        $rootScope.user.receiver_address = $rootScope.user.receiver_address || $scope.order.buy_address;
        UserService.update();
        $scope.order.$save();
      }
    }
    $("#file_ygd").change(function(e){
      var file=e.target.files[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(e) {
        $("#ygd_img").attr('src',e.target.result);
        console.log('img:',e.target.result);
      };
    })
  })
  .controller('AboutCtrl', function($scope,$rootScope) {
    $scope.refresh = function() {
      localStorage.clear();
      redirectOAuth($rootScope.entryPoint);
    }
  })
  .controller('AccountMyCtrl', function($scope,$rootScope,UserService,BaseService,$ionicPopup,$http,CouponService,NUserOptics) {

    $scope.saveInfo=function(){
      UserService.update();
      BaseService.showFlashMessage('用户信息已保存');
    }
    $scope.getMailStatus = function(){
      if($rootScope.user.corp)
        return '已验证';
      if($rootScope.user.corp_email)
        return '重新发送邮件验证';
      return '立即验证';
    }
    $scope.my_Coupon='';
    $scope.couponClick=function(s){
      $scope.my_Coupon=s;
    };
    $scope.addCoupon = function() {
      $scope.data = {coupon:''};

      // An elaborate, custom popup
      $scope.$watch('data.coupon',function(){
        $scope.data.coupon = $scope.data.coupon.toLowerCase().replace(/\s+/g,'');
      })
      var myPopup = $ionicPopup.show({
        template: '<input type="text" ng-model="data.coupon">',
        title: '我的优惠券',
        scope: $scope,
        buttons: [{
          text: '<b>确定</b>',
          type: 'button-positive',
          onTap: function(e) {
            if (!$scope.data.coupon || $scope.data.coupon.length==0) {
              e.preventDefault();
            } else {
              $http.get(pre+'/api/call/util/add_coupon?code='+$scope.data.coupon+'&user_phone='+$scope.user.user_phone).then(function(res) {
                if (!res.data.success)
                  alert('您输入的优惠码无效');
                else {
                  myPopup.close();
                  CouponService.reload($rootScope.user.user_phone).then(function(){
                    $rootScope.$emit('coupon_event');
                  })
                  //alert('成功添加代金券'+res.data.coupon.value+'元');
                  BaseService.showFlashMessage('添加优惠券成功！');
                }
              });
            }
          }
        },{
          text: '<b>取消</b>',
          type: 'button-cancel',
          onTap: function(e) {
            myPopup.close();
          }
        }]
      });
    };
    function validateEmail(email) {
      var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
    }
    $scope.sendVerifyEmail = function(to) {
      $http.get(pre+'/api/call/util/send_verify_email',{params:{wx_id:$rootScope.wx_id,email:to}});
      $scope.mail_sended = true;
      console.log('verify email sended', $rootScope.wx_id, $scope.data.corp_email);
    }
    $scope.verifyCorp = function() {
      if ($scope.user.corp) return;
      if(!$scope.user.user_phone){
        BaseService.showFlashMessage('请您先绑定手机号');
        $timeout(function(){
          $scope.login();
        },1500)
      }
      $scope.data = {corp_email: $scope.user.corp_email};
      $scope.mail_sended = false;
      var mail_pop = $ionicPopup.show({
        title : '邮箱验证',
        templateUrl: 'templates/modal-verify-corp.html',
        subTitle: '验证企业邮箱',
        scope: $scope,
        buttons: [
          { text: '取消'},
          {
            text: '发送',
            type: 'button-positive',
            onTap: function(e) {
              // email not ok
              if(!validateEmail($scope.data.corp_email)){
                e.preventDefault();
                return;
              }
              $rootScope.user.corp_email = $scope.data.corp_email;
              UserService.update();
              $scope.email_act = $scope.getMailStatus();
              $scope.sendVerifyEmail( $scope.data.corp_email);
              mail_pop.close();
              $timeout(function(){
                BaseService.showFlashMessage('邮件已发送');
              },500);
              $timeout(function(){
                UserService.reload();
                CouponService.reload($rootScope.user.user_phone).then(function(){
                  $rootScope.$emit('coupon_event');
                })
              },1000*12);
            }
          }
        ]
      });

    }
    $scope.recommendCode=function(){
      var qr_url = location.origin+'/api/raw/qr_code?tm='+new Date().getTime()+'&url='+encodeURIComponent(location.origin+'/corp/#/full/pay?rec='+$rootScope.user.recommend_code);
      console.log('qr url: ' + qr_url);
      wx.previewImage({
        current: qr_url,
        urls: [qr_url] // 需要预览的图片http链接列表
      });
    }
    $scope.receiverEditing = false;
    $scope.receiverEdit = function() {
      if (!$scope.receiverEditing) {
        $scope.newUser = angular.copy($scope.user);
        $scope.receiverEditing = true;
      } else {
        $scope.user.receiver_name = $scope.newUser.receiver_name;
        $scope.user.receiver_phone = $scope.newUser.receiver_phone;
        $scope.user.receiver_address = $scope.newUser.receiver_address;
        UserService.update();
        $scope.receiverEditing = false;
      }
    }
    $scope.receiverCancel = function() {
      $scope.receiverEditing = false;
    }
    $rootScope.$on('coupon_event',function(){
      loadCoupon();
    })
    function loadCoupon(){
      CouponService.reload($rootScope.user.user_phone).then(function() {
        var coupon = CouponService.get();
        $scope.generalCoupon = coupon.generalCoupon || [];
        $scope.lensCoupon = coupon.lensCoupon || [];
        console.log('get gel coupon:', $scope.generalCoupon);
        console.log('get gel coupon:', $scope.lensCoupon);
      });
    }
    $rootScope.user.$promise.then(function() {
      loadCoupon();
      $scope.opticses = NUserOptics.query({where_:"sph_r is not null and user_phone='"+($scope.user.user_phone||'-1')+"'",order_:'id desc'});
    })

  })
  .controller('AccountOrderCtrl', function($scope,$ionicPopup,$rootScope,BaseService,NCoupon,$q,CouponService,ShopOrders) {
    $scope.isNotPaid=function(order){
      return !order.paid;
    }
    $scope.getLens = function(order) {
      var lens = JSON.parse(order.buy_comment)[0];
      return lens && lens.type + ' ' + lens.brand || '无';
    }
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
            function getCouponsArray(use_coupons){
              if(!use_coupons)
                return [];
              if(use_coupons.indexOf(',')==-1){
                return [use_coupons];
              }
              return use_coupons.split(',');
            }
            var use_coupons = getCouponsArray(order.use_coupons);
            console.log('in get coupon array',use_coupons);
            console.log('pre order delete',order);
            var oid = order.id;
            ShopOrders.remove(oid);
            order.$delete({},function(){
              BaseService.showFlashMessage('订单取消成功！');
              console.log('after order delete');
              //use $q to update coupon status, refresh coupons afterwards
              var tas = use_coupons.map(function(coupon){
                return NCoupon.save({code: coupon, status: 'unused'});
              });
              $q.all(tas).then(function(){
                console.log('after order delete, coupon reset');
                CouponService.reload($rootScope.user.user_phone).then(function(){
                  $rootScope.$emit('coupon_event');
                })
              })
            })
          }
        }]
      })
    }

  })
  .controller('AccountGlassCtrl', function($scope,$rootScope) {
    $rootScope.$on('pay_ok_event',function(e){
      console.log('pay ok event');
      getAllPaidGlass();
    })
    function getAllPaidGlass(){
      $scope.pairs = [];
      $scope.tgoods= $rootScope.orders==[] ? [] : $rootScope.orders.filter(function(o){
        return o.paid == '1';
      }).map(function(o){
        return o.buy_goods
      }).reduce(function(a,b){
        return a.concat(b.filter(function(good){
          var aids= a.map(function(g){return g.id});
          return aids.indexOf(good.id)<0;
        }))
      },[]);
      var chunk=2;
      for(var i=0;i<$scope.tgoods.length;i+=chunk){
        $scope.pairs.push($scope.tgoods.slice(i,i+chunk));
      }
      console.log('orders: ', $scope.orders);
      console.log('pairs: ', $scope.pairs);
    }
    getAllPaidGlass();
  })
  .controller('QueueClientCtrl',function($scope,$stateParams,$rootScope,SvrShare,BaseService, $interval,NQueueManager,EHttp,NQueue2,$location){
    console.log('in queue client')
    $scope.login = SvrShare.setupLogin($scope);
    var qid = $stateParams.queueId;
    $scope.qid = qid;
    $scope.from = $location.search().from;
    if (qid == 'EGlass走进携程爱眼护眼活动') qid = 3;
    if (qid == 'EGlass走进苏河汇爱眼护眼活动') qid = 5;
    $scope.queue = {};
    function refresh() {
      $scope.queue = EHttp.get('/api/call/queue/client?user_phone='+($scope.user.user_phone||0)+'&queue_id='+qid);
      $scope.queue.$promise.then(function(){
        console.log('queue is: ', $scope.queue);
        var v = `
            EGlass走进企业，为企业的朋友们送福利啦！

            EGlass镜框全部来自深圳，镜片标配采用的是国内最大镜片生产商万新光学1.60非球面树脂镜片，市场零售价540元。
            我们推出三个套餐组合：
            套餐一：
            399元＝市场价：528元镜框＋540元镜片

            套餐二：
            599元＝市场价：758元镜框＋540元镜片

            套餐三：
            799元=市场价：1158元镜框＋540元镜片

            企业员工可以再额外享受150元的优惠券和50元镜片升级券

            更多惊喜：同一个员工（只要近视度数相当就算为同一个员工）购买两副眼镜，再享受额外8折，3副7折，4副6折，5副5折。（品牌眼镜除外）。三天活动可以累积，现场现金返还。

            品牌眼镜套餐：
            雷朋、阿玛尼、Prada、gucci等陆逊梯卡旗下品牌眼镜框全部6.4折！

            依视路、蔡司等品牌镜片全部5.5折起
`;
        v = v.replace(/\n/g, '<br/>&nbsp&nbsp;').replace(/企业/g,$scope.queue.corp_name);
        $('#format-comments').html(v);
      })
    }
    $rootScope.user.$promise.then(function(){
      refresh();
      $interval(refresh(),1000*15);
    })
    function refreshToggle() {
      refresh();
      $scope.queue.$promise.then(function(){
        $scope.toggle();
      });
    }
    $scope.toggle=function(){
      console.log('toogle called');
      if (!$rootScope.user.user_phone) {
        return $scope.login(refreshToggle);
      }
      var old = $scope.queue.status;
      if (old == 'pending') {
        return; //disable cancel;
        $scope.queue.status = 'canceled';
      } else {
        $scope.queue.status = null;
        $scope.queue.id = null;
        $scope.queue.queue_id = qid;
        $scope.queue.user = $scope.userinfo.nickname;
        $scope.queue.user_phone = $scope.user.user_phone;
        $scope.queue.queue_name = $scope.queue.name;
      }
      NQueue2.save($scope.queue, function(data){
        $scope.queue = data;
        console.log(data);
        if (old == 'pending') {
          BaseService.showFlashMessage('取消成功');
          $scope.queue.rank = null;
        } else {
          BaseService.showFlashMessage('排���成功');
        }
      });
    }
  })

  .controller('QueueStaffCtrl',function($scope,$stateParams,$rootScope,$ionicListDelegate,$interval,BaseService,NQueueManager,EHttp,NQueue2){
    console.log('queue staff called');
    $scope.queue_status = 'pending';
    $scope.queueStatus = function(status) {
      $scope.queue_status = status;
    }
    $scope.state = {isAdmin: false};
    var qid = $stateParams.queueId;
    $rootScope.user.$promise.then(function(){
      if($scope.user.role == 'epj_yg2016' && $scope.user.user_phone){
        $scope.state.isAdmin=true;
        refresh();
      }
    })
    function refresh() {
      $scope.data = EHttp.get('/api/call/queue/server?qid='+qid);
    }
    $interval(refresh, 15*1000);

    $scope.setFinish=function(item,index){
      NQueue2.save({id: item.id, status:'finished'},function(){
        $scope.data.finished.unshift(item);
        $scope.data.pending.splice(index,1);
      })
    }
    $scope.setPass=function(item,index){
      NQueue2.save({id: item.id, status:'passed'},function(){
        $scope.data.passed.unshift(item);
        $scope.data.pending.splice(index,1);
      })
    }
    $scope.passFinish=function(item,index){
      NQueue2.save({id: item.id, status:'finished'},function(){
        $scope.data.finished.unshift(item);
        $scope.data.passed.splice(index,1);
      })
    }
    $scope.sendSms=function(item){
      $.ajax({
        url: '/api/call/util/sendQueueSms?mobile='+item.user_phone+'&sms_addr='+$scope.data.sms_addr,
        success: function(){
          item.notified =1;
          BaseService.showFlashMessage('短信已发送');
          NQueue2.save(item);
        },
        error: function(){
          BaseService.showFlashMessage('短信发送失败');
        }
      })
      $ionicListDelegate.closeOptionButtons();
    }
  })
  .controller('CouponGetCtrl', function($scope,$rootScope,$stateParams,$http,NCoupon,SvrShare,NQueueManager) {
    var qid = $stateParams.qid
    if (qid == 'xiecheng.com') qid=3;
    $scope.login = SvrShare.setupLogin($scope);
    $scope.received = true;
    $scope.queue = NQueueManager.get({id:qid});
    $scope.user.$promise.then(function() {
      if (!$scope.user.user_phone) {
        $scope.received = false;
      } else {
        NCoupon.query({user_phone: $scope.user.user_phone, reason: qid}, function (data) {
          $scope.received = data.length > 0;
        })
      }
    })

    $scope.receive = function() {
      if($scope.received)
        return;
      if (!$rootScope.user.user_phone) {
        return $scope.login().then($scope.receive);
      }
      $http.post('/api/call/util/corp_coupon_add', {user_phone:$rootScope.user.user_phone, qid:qid})
        .then(function() {
          $scope.received = true;
          alert('优惠券已经送入您的账户');
        })
    }
  })
  .controller('ErpServiceCtrl',function($scope,$rootScope,NErpService,$ionicModal,BaseService,NQueueManager){
    console.log('in erp service ctrl');
    $scope.erpModal = $ionicModal.fromTemplate(require('../templates/modal-erp-service-new.html'),{scope: $scope})
    $scope.erps = NQueueManager.query({order_: 'id asc'})
    $scope.addErpService=function(){
      $scope.erpService = new NErpService()
      $scope.erpModal.show();
      $("#date").mobiscroll().datetime({
        theme: 'android-holo-light',
        display: 'bottom',
        lang:'zh',
        dateFormat : 'yy-mm-dd',
        startYear:'2016',
        showNow:true
      });
    }
    $scope.submit=function(erpService){
      erpService.$save({},function(saved_es){
        BaseService.showFlashMessage('saved ')
        $scope.erps.push(saved_es);
        $scope.erpModal.hide();
        $rootScope.epjGo('/full/erp-service-detail/'+saved_es.id)
      })
    }
  })

  .controller('ErpServiceDetailCtrl',function($scope,NErpService,$rootScope,NQueueManager,BaseService,$stateParams,NErpOrder,$ionicModal,NGoods2,LensPrice,$filter){
    console.log('in erp service detail ctrl')
    $scope.esId = $stateParams.id;
    //$scope.es = NErpService.get({id : $scope.esId})
    $scope.es = NQueueManager.get({id : $scope.esId})
    $scope.erpOrders = NErpOrder.query({erps_id : $scope.esId})
    $scope.erpModal = $ionicModal.fromTemplate(require('../templates/modal-erp-service-order.html'),{scope: $scope})
    LensPrice.np.then(function(){
      console.log('erp get lens price',$rootScope.lens_map);
      $scope.lens_map = $rootScope.lens_map;
    })
    $scope.isSnValid =false;
    $scope.checkIsValidSn=function(glass_sn){
      "use strict";
      if(!glass_sn)
        $scope.isSnValid =false;
      glass_sn = $scope.erpOrder.glass_sn = $filter('uppercase')(glass_sn);
      console.log('get gsn', glass_sn);
      console.log('get gsn', glass_sn);
      NGoods2.query({sn: glass_sn, order_:'create_time asc'},function(goods){
        if(goods && goods.length==1) {
          $scope.erpOrder.base_price = goods[0].shop_price;
          $scope.erpOrder.price = goods[0].shop_price;
          $scope.erpOrder.glass_url =goods[0].img_detail_0;
          $scope.isSnValid = true;
        }else{
          $scope.isSnValid = false;
          $scope.erpOrder.glass_url =undefined;
          $scope.erpOrder.base_price = undefined;
          $scope.erpOrder.price = undefined;
        }
      })
    }
    $scope.updatePrice=function(){
      console.log('update price')
      $scope.erpOrder.price = parseFloat($scope.erpOrder.base_price)+ parseFloat($scope.lens_map[$scope.erpOrder.glass_type][$scope.erpOrder.glass_brand].price);
    }
    $scope.scanOne=function(){
      NGoods2.query({limit_:10},function(data){
        var goods= data[0];
        $scope.erpOrder= new NErpOrder({
          erps_id : $scope.esId,
          glass_sn: goods.sn,
          price: goods.shop_price,
          base_price : goods.shop_price,
          glass_type: '1.60',
          glass_brand: '普通',
          create_time: nowStr(),
          pay_type : '现金',
          glass_url: goods.img_detail_0
        })
        $scope.isSnValid = true;
        $scope.erpModal.show();
      })

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
          NGoods2.get({id: goods_id},function(goods){
            $scope.erpOrder= new NErpOrder({
              erps_id : $scope.esId,
              glass_sn: goods.sn,
              price: goods.shop_price,
              base_price : goods.shop_price,
              glass_type: '1.60',
              glass_brand: '普通',
              create_time: nowStr(),
              pay_type : '现金',
              glass_url: goods.img_detail_0
            })
            $scope.isSnValid = true;
            $scope.erpModal.show();
          })
        }
      });
    }
    $scope.addErpOrder=function(){
      $scope.erpOrder= new NErpOrder({
        erps_id : $scope.esId,
        glass_type: '1.60',
        glass_brand: '普通',
        create_time: nowStr(),
        pay_type : '现金',
      })
      $scope.isSnValid = false;
      $scope.erpModal.show();
    }
    $scope.submit=function(order){
      order.$save({},function(saved_order){
        BaseService.showFlashMessage('erp订单提交成功!');
        $scope.erpModal.hide();
        $scope.erpOrders.push(saved_order);
        $scope.es.glass_num +=1
        $scope.es.total_price += order.price;
        $scope.es.$save({})
        var x=3
      })
    }
  })
  .controller('ErpOrderDetailCtrl',function($scope,$stateParams,NErpOrder){
    console.log('in erp order detail');
    $scope.order_id = $stateParams.id
    $scope.order = NErpOrder.get({id: $scope.order_id})
  })
