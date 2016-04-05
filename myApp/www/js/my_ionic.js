/**
 * Created by fanghui on 2016/4/1.
 */
'use strict';

export function ensureRange(v, v1, v2) {
  if (v < v1) return v1;
  if (v > v2) return v2;
  return v;
}

export function mysql_real_escape_string (str) {
  return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
    case "\0":
      return "\\0";
    case "\x08":
      return "\\b";
    case "\x09":
      return "\\t";
    case "\x1a":
      return "\\z";
    case "\n":
      return "\\n";
    case "\r":
      return "\\r";
    case "\"":
    case "'":
    case "\\":
    case "%":
      return "\\"+char; // prepends a backslash to backslash, percent,
                        // and double/single quotes
    }
  });
}

export function isWeixin() {
  if(typeof window.isWeixinCached != 'undefined') return window.isWeixinCached;
  var ua = navigator.userAgent.toLowerCase();
  window.isWeixinCached = ua.match(/MicroMessenger/i)=="micromessenger";
  return window.isWeixinCached;
}

export function isIphone() {
  if (typeof window.isIphoneCached != 'undefined') return window.isIphoneCached;
  var ua = navigator.userAgent.toLowerCase();
  window.isIphoneCached = ua.match(/iphone/i)=="iphone";
  return window.isIphoneCached;
}

export function redirectOAuth(url, appid) {
  url = url.replace('#', '+');
  appid = appid || 'wxe5e1ebb94f05c1ae';
  if (isWeixin()) {
    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=http://'+config.product_host+'/api/wx/oauth&response_type=code&scope=snsapi_userinfo&state='+url+'#wechat_redirect';
    return true;
  }
}

export function getFileContent(file) {
  return new Promise(function(resolve) {
    var fr = new FileReader();
    fr.onloadend = function() {
      console.log('file content get: ', file, 'bytes: ', fr.result.length);
      resolve(fr.result);
    }
    fr.readAsDataURL(file);
  });
}

export function getImage(base64) {
  return new Promise(function(resolve, reject) {
    var img = new Image();
    img.onload = function(){
      console.log(`image for base64 loaded: ${base64.length} ${img.width}*${img.height}`);
      resolve(img);
    };
    img.src = base64;
  })
}

export function wxChooseImage(config) {
  return new Promise(function(resolve, reject) {
    var result = [];
    wx.chooseImage({
      count: config.count, // 默认9
      sizeType: config.sizeType, // 可以指定是原图还是压缩图，默认二者都有
      sourceType: config.sourceType, // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log('selected weixin images: ', res.localIds);
        var rd = Promise.resolve(null);
        $.each(res.localIds,function(i, localId) {
          rd = rd.then(function(){
            return new Promise(function(resolve, reject) {
              wx.uploadImage({
                localId: localId,
                success: function(r) {
                  var res = {localId:localId, serverId:r.serverId};
                  result.push(res);
                  console.log('upload complete:', res);
                  resolve(res);
                }
              });
            });
          });

        });
        rd.then(function(){
          console.log('wx choose res: ', result);
          resolve(result);
        })
      }
    });
  });
}

export function getSizeImage(file, width, height) {
  return new Promise(function(resolve) {
    if (!width && !height) {
      getFileContent(file).then((base64)=>{
        return resolve(base64);
    })
      return;
    }
    getFileContent(file).then(getImage).then((img) => {
      var w = img.width;
    var h = img.height;
    if (width) {
      height = height || width * h / w;
    }
    if (height) {
      width = width || height * w / h;
    }
    var can = document.createElement('canvas');
    can.width = width;
    can.height = height;
    var ctx = can.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h, 0, 0, width, height);
    var data = can.toDataURL('image/jpeg');
    console.log(`size image ${width}*${height} is ${data.length} bytes`);
    resolve(data);
  }).catch((err)=>{
      reject(err);
  })
  })
}

export function nowStr() {
  var d = new Date();
  return sprintf('%d-%02d-%02d %02d:%02d:%02d', d.getFullYear(), d.getMonth()+1, d.getDate(), d.getHours(), d.getMinutes(), d.getSeconds());
}

export function nowDate() {
  var d = new Date();
  return sprintf('%d-%02d-%02d', d.getFullYear(), d.getMonth()+1, d.getDate());
}

var extend = angular.extend;
var forEach = angular.forEach;
var isDefined = angular.isDefined;
var isNumber = angular.isNumber;
var isString = angular.isString;
var jqLite = angular.element;
var noop = angular.noop;

angular.module('my-ionic', [])
  .service('MyService', ['$rootScope','$ionicHistory','$timeout','$ionicViewSwitcher','$location', function($rootScope,$ionicHistory,$timeout,$ionicViewSwitcher,$location) {
    return {
      setupCommon: function() {
        $rootScope.showMyBack = function() {
          var bst = $ionicHistory.backView() ? $ionicHistory.backView().stateName.split('.')[0] : '';
          var cst = $ionicHistory.currentView().stateName.split('.')[0];
          return bst && bst != cst;
        }
        $rootScope.redirect = function (url) {
          console.log('redirect to ', url);
          location.href = '/api/wx/redirect?url='+encodeURIComponent(url);
          console.log('after redirect. should not be seen');
        };
        $rootScope.epjGo = function (path, search) {
          console.log('epjGo ', path, search);
          var ego = function(){
            $ionicViewSwitcher.nextDirection('forward');
            var p = $location.path();
            if (p!=path) {
              $location.path(path).search(search||{});
            }
          };
          if (!isIphone()) ego();
          else $timeout(ego, 10);
        };
        $rootScope.subapp = function() {
          return location.href.split('#')[1].split('/')[1];
        }
        $rootScope.epjBack = function () {
          var bgo = function(){
            $ionicViewSwitcher.nextDirection('back');
            if (!$ionicHistory.backView()) {
              console.log('path to: ', `/${$rootScope.subapp()}/index`);
              $location.path(`/${$rootScope.subapp()}/index`);
            } else {
              $ionicHistory.goBack();
            }
          };
          if (!isIphone()) bgo();
          else $timeout(bgo,10);
        };
      }
    }
  }])
  .directive('myTab', [
    '$compile',
    '$ionicConfig',
    '$ionicBind',
    '$ionicViewSwitcher',
    function($compile, $ionicConfig, $ionicBind, $ionicViewSwitcher) {

      //Returns ' key="value"' if value exists
      function attrStr(k, v) {
        return isDefined(v) ? ' ' + k + '="' + v + '"' : '';
      }
      return {
        restrict: 'E',
        require: ['^ionTabs', 'myTab'],
        controller: '$ionicTab',
        scope: true,
        compile: function(element, attr) {

          //We create the tabNavTemplate in the compile phase so that the
          //attributes we pass down won't be interpolated yet - we want
          //to pass down the 'raw' versions of the attributes
          var tabNavTemplate = '<my-tab-nav' +
            attrStr('ng-click', attr.ngClick) +
            attrStr('title', attr.title) +
            attrStr('icon', attr.icon) +
            attrStr('icon-on', attr.iconOn) +
            attrStr('icon-off', attr.iconOff) +
            attrStr('badge', attr.badge) +
            attrStr('badge-style', attr.badgeStyle) +
            attrStr('hidden', attr.hidden) +
            attrStr('disabled', attr.disabled) +
            attrStr('class', attr['class']) +
            '></my-tab-nav>';

          //Remove the contents of the element so we can compile them later, if tab is selected
          var tabContentEle = document.createElement('div');
          for (var x = 0; x < element[0].children.length; x++) {
            tabContentEle.appendChild(element[0].children[x].cloneNode(true));
          }
          var childElementCount = tabContentEle.childElementCount;
          element.empty();

          var navViewName, isNavView;
          if (childElementCount) {
            if (tabContentEle.children[0].tagName === 'ION-NAV-VIEW') {
              // get the name if it's a nav-view
              navViewName = tabContentEle.children[0].getAttribute('name');
              tabContentEle.children[0].classList.add('view-container');
              isNavView = true;
            }
            if (childElementCount === 1) {
              // make the 1 child element the primary tab content container
              tabContentEle = tabContentEle.children[0];
            }
            if (!isNavView) tabContentEle.classList.add('pane');
            tabContentEle.classList.add('tab-content');
          }

          return function link($scope, $element, $attr, ctrls) {
            var childScope;
            var childElement;
            var tabsCtrl = ctrls[0];
            var tabCtrl = ctrls[1];
            var isTabContentAttached = false;
            $scope.$tabSelected = false;

            $ionicBind($scope, $attr, {
              onSelect: '&',
              onDeselect: '&',
              title: '@',
              uiSref: '@',
              href: '@'
            });

            tabsCtrl.add($scope);
            $scope.$on('$destroy', function() {
              if (!$scope.$tabsDestroy) {
                // if the containing ionTabs directive is being destroyed
                // then don't bother going through the controllers remove
                // method, since remove will reset the active tab as each tab
                // is being destroyed, causing unnecessary view loads and transitions
                tabsCtrl.remove($scope);
              }
              tabNavElement.isolateScope().$destroy();
              tabNavElement.remove();
              tabNavElement = tabContentEle = childElement = null;
            });

            //Remove title attribute so browser-tooltip does not apear
            $element[0].removeAttribute('title');

            if (navViewName) {
              tabCtrl.navViewName = $scope.navViewName = navViewName;
            }
            $scope.$on('$stateChangeSuccess', selectIfMatchesState);
            selectIfMatchesState();
            function selectIfMatchesState() {
              if (tabCtrl.tabMatchesState()) {
                tabsCtrl.select($scope, false);
              }
            }

            var tabNavElement = jqLite(tabNavTemplate);
            tabNavElement.data('$ionTabsController', tabsCtrl);
            tabNavElement.data('$ionTabController', tabCtrl);
            tabsCtrl.$tabsElement.append($compile(tabNavElement)($scope));


            function tabSelected(isSelected) {
              if (isSelected && childElementCount) {
                // this tab is being selected

                // check if the tab is already in the DOM
                // only do this if the tab has child elements
                if (!isTabContentAttached) {
                  // tab should be selected and is NOT in the DOM
                  // create a new scope and append it
                  childScope = $scope.$new();
                  childElement = jqLite(tabContentEle);
                  $ionicViewSwitcher.viewEleIsActive(childElement, true);
                  tabsCtrl.$element.append(childElement);
                  $compile(childElement)(childScope);
                  isTabContentAttached = true;
                }

                // remove the hide class so the tabs content shows up
                $ionicViewSwitcher.viewEleIsActive(childElement, true);

              } else if (isTabContentAttached && childElement) {
                // this tab should NOT be selected, and it is already in the DOM

                if ($ionicConfig.views.maxCache() > 0) {
                  // keep the tabs in the DOM, only css hide it
                  $ionicViewSwitcher.viewEleIsActive(childElement, false);

                } else {
                  // do not keep tabs in the DOM
                  destroyTab();
                }

              }
            }

            function destroyTab() {
              childScope && childScope.$destroy();
              isTabContentAttached && childElement && childElement.remove();
              tabContentEle.innerHTML = '';
              isTabContentAttached = childScope = childElement = null;
            }

            $scope.$watch('$tabSelected', tabSelected);

            $scope.$on('$ionicView.afterEnter', function() {
              $ionicViewSwitcher.viewEleIsActive(childElement, $scope.$tabSelected);
            });

            $scope.$on('$ionicView.clearCache', function() {
              if (!$scope.$tabSelected) {
                destroyTab();
              }
            });

          };
        }
      };
    }])
  .directive('myTabNav', [function() {
    return {
      restrict: 'E',
      replace: true,
      require: ['^ionTabs', '^ionTab'],
      template:
      '<a ng-class="{\'tab-item-active\': isTabActive(), \'has-badge\':badge, \'tab-hidden\':isHidden()}" ' +
      ' ng-disabled="disabled()" class="tab-item">' +
      '<span class="badge {{badgeStyle}}" ng-if="badge">{{badge}}</span>' +
      '<i class="icon {{getIconOn()}}" ng-if="getIconOn() && isTabActive()"></i>' +
      '<i class="icon {{getIconOff()}}" ng-if="getIconOff() && !isTabActive()"></i>' +
      '<span class="tab-title" ng-bind-html="title"></span>' +
      '</a>',
      scope: {
        title: '@',
        icon: '@',
        iconOn: '@',
        iconOff: '@',
        badge: '=',
        hidden: '@',
        disabled: '&',
        badgeStyle: '@',
        'class': '@'
      },
      link: function($scope, $element, $attrs, ctrls) {
        var tabsCtrl = ctrls[0],
            tabCtrl = ctrls[1];

        //Remove title attribute so browser-tooltip does not apear
        $element[0].removeAttribute('title');

        $scope.selectTab = function(e) {
          e.preventDefault();
          tabsCtrl.select(tabCtrl.$scope, true);
        };
        if (!$attrs.ngClick) {
          $element.on('touchstart', function(event) {
            $scope.$apply(function() {
              $scope.selectTab(event);
            });
          });
        }

        $scope.isHidden = function() {
          if ($attrs.hidden === 'true' || $attrs.hidden === true) return true;
          return false;
        };

        $scope.getIconOn = function() {
          return $scope.iconOn || $scope.icon;
        };
        $scope.getIconOff = function() {
          return $scope.iconOff || $scope.icon;
        };

        $scope.isTabActive = function() {
          return tabsCtrl.selectedTab() === tabCtrl.$scope;
        };
      }
    };
  }])
  .directive('fileChange', function fileChange() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        fileChange: '&'
      },
      link: function link(scope, element, attrs, ctrl) {
        element.on('change', onChange);

        scope.$on('destroy', function () {
          element.off('change', onChange);
        });

        function onChange() {
          ctrl.$setViewValue(element[0].files[0]);
          scope.fileChange && scope.fileChange();
        }
      }
    };
  })
  .directive('fileChangeSized', function fileChange() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        fileChangeSized: '&',
        swidth: '=',
        sheight: '=',
      },
      link: function link(scope, element, attrs, ctrl) {
        element.on('change', onChange);

        scope.$on('destroy', function () {
          element.off('change', onChange);
        });

        function onChange() {
          getSizeImage(element[0].files[0], scope.swidth, scope.sheight).then(function(base) {
            ctrl.$setViewValue(base);
            scope.fileChangeSized && scope.fileChangeSized();
          })
        }
      }
    };
  })
  .filter('updateSrc', function() {
    return function (src, update_time) {
      if (src && src.startsWith('data:')) {
        return src;
      }
      let n = src ? src + '?_up='+update_time : '';
      return n.replace(' ','-').replace(/:/g,'-');
    }
  })
;
