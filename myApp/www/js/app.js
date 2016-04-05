// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngResource','MyUtil','my-ionic', 'mySvrShare','restService'])
.config(['$ionicConfigProvider',function($ionicConfigProvider) {
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.navBar.alignTitle('center');
  $ionicConfigProvider.views.swipeBackEnabled(false);
  $ionicConfigProvider.platform.android.views.transition('none');
}])
.run(['$ionicPlatform',function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
}])

.config(['$stateProvider', '$urlRouterProvider',function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    template: require('../templates/tabs.html')
  })

  // Each tab has its own nav history stack:

  .state('tab.chart', {
    url: '/chart',
    cache: false,
    views: {
      'tab-chart': {
        template: require('../templates/tab-chart.html'),
        controller: 'ChartCtrl'
      }
    }
  })
  .state('tab.product', {
    url: '/product',
    views: {
      'tab-product': {
        template: require('../templates/tab-product.html'),
        controller: 'ProductCtrl'
      }
    }
  })
  .state('full.product-detail', {
    url: '/product-detail/:id',
    views: {
      'full': {
        template: require('../templates/full-product-detail.html'),
        controller: 'ProductDetailCtrl'
      }
    }
  })
  .state('full.product-goods', {
    url: '/product-goods/:id',
    views: {
      'full': {
        template: require('../templates/full-product-goods.html'),
        controller: 'ProductGoodsCtrl'
      }
    }
  })
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        template: require('../templates/tab-account.html'),
        controller: 'AccountCtrl'
      }
    }
  })
  .state('full.account-my', {
    url: '/account-my',
    views: {
      'full': {
        template: require('../templates/tab-account-my.html'),
        controller: 'AccountMyCtrl'
      }
    }
  })
  .state('full.account-order', {
    url: '/account-order',
    views: {
      'full': {
        template: require('../templates/tab-account-order.html'),
        controller: 'AccountOrderCtrl'
      }
    }
  })
  .state('full.account-glass', {
    url: '/account-glass',
    views: {
      'full': {
        template: require('../templates/tab-account-glass.html'),
        controller: 'AccountGlassCtrl'
      }
    }
  })
  .state('full.about', {
    url: '/about',
    views: {
      'full': {
        template: require('../templates/full-about.html'),
        controller: 'AboutCtrl'
      }
    }
  })
  .state('full.order-detail', {
    url: '/order-detail/:id',
    views: {
      'full': {
        template: require('../templates/full-order-detail.html'),
        controller: 'OrderDetailCtrl'
      }
    }
  })
  .state('full', {
    url: '/full',
    abstract: true,
    template: require('../templates/full.html')
  })
  .state('full.try', {
    url: '/try/:goods_id',
    views: {
      'full': {
        template: require('../templates/full-try.html'),
        controller: 'TryCtrl'
      }
    }
  })
  .state('full.star', {
    url: '/star',
    views: {
      'full': {
        template: require('../templates/full-star.html'),
        controller: 'StarCtrl'
      }
    }
  })
  .state('full.buy', {
    url: '/buy',
    views: {
      'full': {
        template: require('../templates/full-buy.html'),
        controller: 'BuyCtrl'
      }
    }
  })
  .state('full.pay', {
    url: '/pay',
    cache: false,
    views: {
      'full': {
        template: require('../templates/full-pay.html'),
        controller: 'PayCtrl'
      }
    }
  })
  //queue
  .state('full.queue-client', {
    url: '/queue-client/:queueId',
    views: {
      'full': {
        template: require('../templates/queue-client.html'),
        controller: 'QueueClientCtrl'
      }
    }
  })
  .state('full.queue-staff', {
    url: '/queue-staff/:queueId',
    views: {
      'full': {
        template: require('../templates/queue-staff.html'),
        controller: 'QueueStaffCtrl'
      }
    }
  })
  //corp coupon
  .state('full.coupon-get', {
    url: '/coupon-get/:qid',
    views: {
      'full': {
        template: require('../templates/coupon-get.html'),
        controller: 'CouponGetCtrl'
      }
    }
  })
  .state('full.erp-services', {
    url: '/erp-services',
    views: {
      'full': {
        template: require('../templates/full-erp-services.html'),
        controller: 'ErpServiceCtrl'
      }
    }
  })
  .state('full.erp-service-detail', {
    url: '/erp-service-detail/:id',
    views: {
      'full': {
        template: require('../templates/full-erp-service-detail.html'),
        controller: 'ErpServiceDetailCtrl'
      }
    }
  })
  .state('full.erp-order-detail', {
    url: '/erp-order-detail/:id',
    views: {
      'full': {
        template: require('../templates/full-erp-order-detail.html'),
        controller: 'ErpOrderDetailCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/product');

}]);
