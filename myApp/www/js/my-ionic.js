
angular.module('starter.controllers')
.directive('focusOn', function() {
  return function(scope, elem, attr) {
    scope.$on('focusOn', function(e, name) {
      if(name === attr.focusOn) {
        elem[0].focus();
      }
    });
  };
})
.factory('Focus', function ($rootScope, $timeout) {
  return function(name) {
    $timeout(function (){
      $rootScope.$broadcast('focusOn', name);
    });
  }
})
.directive('qmap', ['$rootScope', 'lazyLoadQmap','$compile','$templateCache',
  function( $rootScope, lazyLoadQmap,$compile,$templateCache) {

    return {
      restrict: 'A', // restrict by attr name
      scope: {
        mapId: '@id', // map ID  //取id属性， 传给 $scope.mapId
        shops: '=',
        location :'='
      },
      link: function( $scope, elem, attrs ) {
        // Initialize the map
        $scope.btnClicked=function(idx){
          $rootScope.$broadcast('Select_from_map_event',idx,$scope.shops[idx]);
          var shop = $scope.shops[idx];
          $rootScope.$broadcast('shop_chosed_event',idx,{lat:shop.latitude,lng:shop.longitude,name:shop.shop_name,addr:shop.address});
          console.log('btn clicked',idx);
          console.log('selected shop: ',$scope.shops[idx]);
        }
        $scope.initialize = function() {
          console.log('get shops by attr ',$scope.shops);
          console.log('get shops by attr ',$scope.location);
          //$scope.location = new qq.maps.LatLng($scope.positions[0].lat,$scope.positions[0].long);
          var loc = $scope.shops ? $scope.shops[0] : {latitude: 40,longitude:120};
          $scope.location = new qq.maps.LatLng(loc.latitude,loc.longitude);
          console.log('qmap init location',$scope.location);
          $scope.mapOptions = {
            zoom: 12,
            center: $scope.location,
            mapTypeId: qq.maps.MapTypeId.ROADMAP,
            mapTypeControl: false
          };
          $scope.map = new qq.maps.Map(document.getElementById($scope.mapId), $scope.mapOptions);
          //$scope.poiView= new PoiResultMapView({index:1,poiData:[]});
          $scope.poiView= new PoiResultMapView({index:0,poiData:[]},$compile,$scope,$templateCache,$scope.map);
          console.log('directive created map',$scope.map);
          if($scope.shops){
            $scope.isChart =false;
            $scope.poiView.set({
              index : 0,
              poiData : $scope.shops.map(function(shop){
                return {
                  title: shop.shop_name,
                  address:shop.address,
                  location: {
                    lat : shop.latitude,
                    lng : shop.longitude
                  }
                }
              })
            })

            $scope.poiView.render();
          }else{
            $scope.isChart =true;
          }

          $scope.$on("shop_cancel",function(e){

          })
          $scope.IsInit=true;
          $scope.$on('city_click_event',function(e,city_shops){
            if($scope.isChart)
              return;
            var cCity = city_shops.city;
            console.log('city clicked,to',cCity);
            var shops =city_shops.shops;
            console.log('city clicked,to shops',shops);
            if($scope.IsInit && cCity =='北京'){
              console.log('first in bj');
              return ;
            }
            if($scope.city == cCity){
              return ;
            }
            $scope.IsInit= false;
            $scope.city = cCity;
            $scope.shops = shops;
            //showMarks(shops);
            $scope.poiView.clear();
            $scope.poiView.set({
              index : 0,
              poiData : shops.map(function(shop){
                return {
                  title: shop.shop_name,
                  address:shop.address,
                  location: {
                    lat : shop.latitude,
                    lng : shop.longitude
                  }
                }
              })
            })
            $scope.poiView.render();
          });
          $scope.$on('shop_chosed_event',function(e,idx,pos){
            console.log('get shop_chosed',idx);
            console.log('get pos',pos);

            if(!$scope.isChart) {
              // in modal
              $scope.poiView.showCurrent(idx,pos,$scope.map);
            }
            else {
               //in tab-chart
              console.log('in tab-chart map');
              var _pos = new qq.maps.LatLng(pos.lat, pos.lng);
              //$scope.map.panTo(new qq.maps.LatLng(pos.lat, pos.lng));
              var marker = new qq.maps.Marker({
                position: _pos,
                map: $scope.map
              });

              if($scope.marker){
                $scope.marker.setMap(null);
              }
              $scope.marker = marker;
              $scope.poiView.drawLast(pos,$scope.map);
            }
          });
        };

        lazyLoadQmap.get().then(function () {
          // Promised resolved
          $scope.initialize();
        }, function () {
          // Promise rejected
        });

      }
    };
  }])



/** WEBPACK FOOTER **
 ** ./js/epj-ionic.js
 **/