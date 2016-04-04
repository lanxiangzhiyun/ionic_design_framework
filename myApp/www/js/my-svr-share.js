angular.module('mySvrShare', ['restService'])
  .service('SvrShare', function($http,MHttp,$log,$location,$ionicActionSheet,$rootScope,$state,BaseService,$timeout,$ionicPopup,$ionicHistory,$ionicModal,$ionicLoading,UserService,MyService){
    return {
      setupSharedFuncs: function() {
        MyService.setupCommon();
        $rootScope.pre = pre || '';
        $rootScope.parseFloat = parseFloat;
        $rootScope.$location = $location;
        $rootScope.$ionicHistory = $ionicHistory;
        $rootScope.isInWX = isWeixin();
        $rootScope.getLocal = function(key) {
          return localStorage[$rootScope.storagePrefix+key];
        }
        $rootScope.setLocal = function(key, value) {
          localStorage[$rootScope.storagePrefix+key] = value;
        }
        $rootScope.sfScan=function(){
          console.log('scan2 called');
          if(!isWeixin()){
            $rootScope.epjGo('/sfull/product/574');
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
              $rootScope.epjGo('/sfull/product/'+goods_id)
            }
          });

        }
        $rootScope.configWeixin = function() {
          var murl = encodeURIComponent(location.href.split('#')[0]);
          $.ajax({
            url: '/api/wx/get_sign?url='+murl,
            success: function(jdata){
              var jres = jdata;
              if (typeof jres == 'string')
                jres = JSON.parse(jdata);
              $log.debug("returned sign is: ", jres);
              $log.debug('get sign succ',jres);
              wx.config({
                debug: false,
                appId: jres.appId,
                timestamp: jres.timestamp,
                nonceStr: jres.nonceStr,
                signature: jres.signature,
                jsApiList: [
                  // 所有要调用的 API 都要加到这个列表中
                  'checkJsApi',
                  'openLocation',
                  'getLocation',
                  'onMenuShareTimeline',
                  'onMenuShareAppMessage',
                  'showMenuItems',
                  'previewImage',
                  'chooseImage',
                  'scanQRCode',
                  'uploadImage'
                ]
              });
              wx.ready(function(){
                $rootScope.wx_ready = true;
                $rootScope.updateOnWxShare&& $rootScope.updateOnWxShare();
                wx.error(function (res) {
                  //alert('wx error ' + JSON.stringify(res));
                  BaseService.showFlashMessage('微信发生错误');
                });
              });
            }
          });
        }
      },
      setupLogin : function(scope){
      scope.newuser = {};
      scope.verify_code = {};
      var $scope = scope.$new();
      $scope.isPhoneNum=function(phone_num){
        return /^1[3|5|7|8][0-9]\d{8}$/.test(phone_num);
      };
      $scope.count = 0;
      $scope.buttonText = '获取验证码';
      $scope.send_sms=function(e){
        console.log('send phone_num',scope.newuser.user_phone);
        var phone_to_vf=scope.newuser.user_phone;
        if(phone_to_vf==undefined || phone_to_vf=='')
          return;
        if (!(/^1[3|5|7|8][0-9]\d{8}$/.test(phone_to_vf))) {
          // e.preventDefault();
          //alert('手机号码格式不正确');
          BaseService.showFlashMessage('手机号码格式不正确，请重新填写');
          return;
        }
        $.ajax({
          url:'/api/call/util/mobile_verify?mobile='+phone_to_vf,
          success:function(data){
            console.log(data);
            if(data.vrcode!=undefined){
              localStorage.sms_vrcode=data.vrcode;
            }
          }
        });
        function retrySms() {
          $scope.count--;
          if ($scope.count == 0) {
            $scope.buttonText = '获取验证码';
          } else {
            $scope.buttonText = ''+$scope.count+'秒重试';
            $timeout(retrySms, 6000);
          }
        }
        $scope.count = 60;
        $timeout(retrySms, 6000);
      };
      return function(cb){
        return new Promise(function(resolve,reject) {
          $ionicPopup.show({
            templateUrl: 'templates/modal-login.html',
            subTitle: '请输入手机号码',
            scope: $scope,
            buttons: [
              { text: '取消' },
              {
                text: '<b>保存</b>',
                type: 'button-positive',
                onTap: function(e) {
                  console.log('input: ',scope.verify_code.code,' expected:',localStorage.sms_vrcode);
                  if (scope.verify_code.code != localStorage.sms_vrcode) {
                    e.preventDefault();
                    alert('请输入正确的验证码');
                    //BaseService.showFlashMessage('请输入正确的验证码','popup-danger');
                  } else {
                    return scope.newuser;
                  }
                }
              }
            ]
          }).then(function(res){
            console.log('input user',res);
            if(res!=undefined){
              UserService.signup(res.user_phone,cb).then(function(user) {
                resolve(user);
              });
            }
          });
        })
      }
    },
      setupStarCtrl: function($scope, clip){
        $scope.star_photo = $ionicModal.fromTemplate(require('../templates/modal-star-photo.html'), {
          scope: $scope
        })
        $scope.pinyins = [];
        $scope.stars = {};
        $http.get(pre+'/api/call/util/stars').then(function(data){
          var s = data.data;
          for (var i in s) {
            var py = pinyin.getFullChars(s[i]).slice(0,1).toUpperCase();
            if (!$scope.stars[py]) {
              $scope.stars[py] = [];
            }
            $scope.stars[py].push(s[i]);
          }
          for (var k in $scope.stars) {
            $scope.pinyins.push(k);
            $scope.pinyins.sort();
          }
        });
        $scope.showStar = function (star) {
          $scope.images = MHttp.query(pre+'/api/call/util/stars?star='+star);
          $scope.star_photo.show();
        };
        $scope.photoSelect = function (img) {
          $scope.star_photo.hide();
          clip(img);
        };
      },
      setupShowResult: function($scope) {
        {
          var pre = $rootScope.storagePrefix || '';
          localStorage[pre+'facePos'] = localStorage[pre+'facePos'] || JSON.stringify({"success":1,"rotate":0.21081313529359,"glass_length":206.30991390302,"x_center":145.96036,"x_face_left":81.427236,"x_face_right":300.682416,"y_center":226.41413,"y_face_left":223.36593378,"y_face_right":275.09644378});
          function isForGlass(x, y) {
            var s = JSON.parse(localStorage[pre+'facePos']);
            var glass_length = s.glass_length;
            var y_offset = glass_length * 0.12;
            var offX = parseInt(localStorage[pre+'offsetX']) || 0;
            var offY = parseInt(localStorage[pre+'offsetY']) || 0;
            var glass_height = $scope.gpng && $scope.gpng.height * glass_length / $scope.gpng.width || glass_length / 2;

            var x1 = s.x_center + offX - glass_length / 2;
            var x2 = s.x_center + offX + glass_length / 2;
            var y1 = s.y_center + offY - y_offset;
            var y2 = s.y_center + offY - y_offset + glass_height;
            y = y-$scope.try.header_height;
            var margin = 20;
            x1 -= margin; x2 += margin; y1 -= margin; y2 += margin;
            var res = x > x1 && x < x2 && y>y1 && y<y2;
            console.log('isForGlass: ', res, x1, x2, x, y1, y2, y);
            return res;
          }
          var beginX = 0;
          var beginY = 0;
          var beginOffX = 0;
          var beginOffY = 0;
          $("#faceContainer").on("touchstart", function (event) {
            $log.debug("face touchstart called");
            if (!isForGlass(event.originalEvent.changedTouches[0].pageX, event.originalEvent.changedTouches[0].pageY)) {
              beginX = 0;
              beginY = 0;
              return;
            }
            event.preventDefault();
            event.stopPropagation();
            beginX = event.originalEvent.changedTouches[0].pageX;
            beginY = event.originalEvent.changedTouches[0].pageY;
            beginOffX = parseInt(localStorage[pre+'offsetX']) || 0;
            beginOffY = parseInt(localStorage[pre+'offsetY']) || 0;
          });
          $("#faceContainer").bind("touchmove", function (event) {
            if (beginX == 0 && beginY == 0)
              return;
            event.preventDefault();
            event.stopPropagation();
            var x = event.originalEvent.changedTouches[0].pageX;
            var y = event.originalEvent.changedTouches[0].pageY;
            var dx = x - beginX;
            var dy = y - beginY;
            var range = 30;
            var offX = ensureRange(beginOffX + dx, -range, range);
            var offY = ensureRange(beginOffY + dy, -range, range);
            localStorage[pre+'offsetX'] = offX;
            localStorage[pre+'offsetY'] = offY;
            //$log.debug('touchmove: ', x, y, beginX, beginY, dx, dy, offX, offY);
            $scope.showResult(true);
          });

          $('#try_cont').bind('touchmove',function(e){
            e.preventDefault();
          })
        }

        return function (glassUnchanged) {
          if (!$rootScope.current || !$rootScope.current.id) {
            console.log('no current set, show result returned');
            return;
          }
          var s = JSON.parse(localStorage[pre+'facePos']);

          function skewX(ctx, rad) {
            ctx.transform(1, 0, Math.tan(rad), 1, 0, 0);
          }

          function glassReady() {
            var gpng = $scope.gpng;
            var lpng = $scope.lpng;
            var canvas = $scope.canvas || document.getElementById("glass");
            var ctx = $scope.canvasCtx || canvas.getContext('2d');
            $scope.canvas = canvas;
            $scope.canvasCtx = ctx;
            var dr = window.devicePixelRatio;
            var w = $scope.try.width * dr;
            var h = $scope.try.height * dr;
            canvas.width = w;
            canvas.height = h;
            ctx.clearRect(0, 0, w, h);

            //common
            var glass_length = s.glass_length;
            var y_offset = glass_length * 0.12;
            var offX = parseInt(localStorage[pre+'offsetX']) || 0;
            var offY = parseInt(localStorage[pre+'offsetY']) || 0;
            var r = glass_length / gpng.width;
            var lower_y = r * parseInt($rootScope.current.lower_left_y);
            var upper_y = r * parseInt($rootScope.current.upper_left_y);
            //var leg_height = lower_y - upper_y;
            //var leg_y2 = parseInt($rootScope.current.leg_y2);
            //if (leg_y2 == 0) leg_y2 = leg_height;
            //leg_height *= lpng.height / leg_y2;
            //var leg_off = upper_y + leg_height / 2;
            var face_height = lower_y - upper_y;
            var leg_y1 = parseInt($rootScope.current.leg_y1);
            var leg_y2 = parseInt($rootScope.current.leg_y2);
            var leg_dy = leg_y2 - leg_y1;
            if (leg_dy == 0) leg_dy = face_height;
            var leg_height = face_height * lpng.height / leg_dy;
            var leg_off = upper_y + leg_height / 2 - leg_y1 / leg_dy * face_height;

            function debugFill(x, y, color) {
              if (!$rootScope.test) return;
              //var weight = 1;
              //ctx.fillStyle = color;
              //ctx.fillRect(x, y, weight, weight);
            }

            //left leg
            var ox = glass_length / 2;
            var oy = y_offset - leg_off;
            var otheta = Math.atan(oy / ox);
            var oz = Math.sqrt(ox * ox + oy * oy);
            var nldx = oz * Math.cos(otheta + s.rotate);
            var nldy = oz * Math.sin(otheta + s.rotate);

            var lx = -nldx + s.x_center + offX;
            var ly = -nldy + s.y_center + offY;

            var ldx = s.x_face_left - lx;
            var ldy = s.y_face_left - ly;
            var ldz = Math.sqrt(ldx * ldx + ldy * ldy);
            var lrotate = Math.atan(ldy / ldx);
            if (ldx < 0) {
              lrotate += Math.PI;
            }
            ctx.save();
            ctx.translate(lx * dr, ly * dr);
            ctx.rotate(lrotate);
            skewX(ctx, -s.rotate + lrotate);
            if (ldx < 0) ctx.scale(1, -1);
            var lleg_height = leg_height * Math.cos(-s.rotate + lrotate);
            //ctx.drawImage(lpng, 0, -lleg_height/2, ldz, lleg_height);
            sampleDraw(ctx, lpng, 0, -lleg_height / 2 * dr, ldz * dr, lleg_height * dr);
            debugFill(0, -lleg_height / 2 * dr, '#00ff00');
            debugFill(0, lleg_height / 2 * dr, '#00ff00');
            ctx.restore();

            //right leg
            var nrdx = oz * Math.cos(-otheta + s.rotate);
            var nrdy = oz * Math.sin(-otheta + s.rotate);
            var rx = nrdx + s.x_center + offX;
            var ry = nrdy + s.y_center + offY;
            var rdx = s.x_face_right - rx;
            var rdy = s.y_face_right - ry;
            var rdz = Math.sqrt(rdx * rdx + rdy * rdy);
            var rrotate = Math.atan(rdy / rdx);
            if (rdx < 0) {
              rrotate += Math.PI;
            }
            ctx.save();
            ctx.translate(rx * dr, ry * dr);
            ctx.rotate(rrotate);
            skewX(ctx, -s.rotate + rrotate);
            if (rdx < 0)    ctx.scale(1, -1);
            var rleg_height = leg_height * Math.cos(-s.rotate + rrotate);
            //ctx.drawImage(lpng, 0, -rleg_height/2, rdz, rleg_height);
            sampleDraw(ctx, lpng, 0, -rleg_height / 2 * dr, rdz * dr, rleg_height * dr);
            debugFill(0, -rleg_height / 2 * dr, '#00ff00');
            debugFill(0, rleg_height / 2 * dr, '#00ff00');
            ctx.restore();

            //face
            var x_center = s.x_center;
            var y_center = s.y_center;
            var rotate = s.rotate;
            var rate = glass_length / gpng.width;//obj.width;
            var glass_height = gpng.height * rate;//obj.height * rate;
            ctx.save();
            ctx.translate((x_center + offX) * dr, (y_center + offY) * dr);
            ctx.rotate(rotate);
            //ctx.drawImage(gpng, -glass_length/2, -y_offset, glass_length, glass_height);
            sampleDraw(ctx, gpng, -glass_length / 2 * dr, -y_offset * dr, glass_length * dr, glass_height * dr);
            debugFill(-glass_length / 2 * dr, -y_offset + upper_y * dr, '#ff0000');
            debugFill(-glass_length / 2 * dr, -y_offset + lower_y * dr, '#ff0000');
            debugFill(0, 0, '#ff0000');
            debugFill(glass_length / 2 * dr - 1, -y_offset * dr + upper_y * dr, '#ff0000');
            debugFill(glass_length / 2 * dr - 1, -y_offset * dr + lower_y * dr, '#ff0000');
            ctx.restore();
          }

          if (glassUnchanged) {
            glassReady();
          } else {
            var gpng = new Image();
            gpng.src = $rootScope.pre+$rootScope.current.img_face;
            var lpng = new Image();
            lpng.src = $rootScope.pre+$rootScope.current.img_leg;
            $scope.loading += 2;
            var loaded = 0;
            var png_loaded = function () {
              $scope.loading -= 1;
              loaded++;
              if (loaded < 2) return;
              $scope.$apply();
              glassReady();
            };
            gpng.onload = png_loaded;
            lpng.onload = png_loaded;
            $scope.gpng = gpng;
            $scope.lpng = lpng;
            $scope.sizedGpng = $scope.sizedLpng = null;
          }
          function sampleDraw(ctx, img, x, y, width, height) {
            return ctx.drawImage(img, x, y, width, height);
            var rimg = img == $scope.gpng ? $scope.sizedGpng : $scope.sizedLpng;
            if (!rimg) {
              var oc = document.createElement('canvas'),
                octx = oc.getContext('2d');
              var roc = document.createElement('canvas'),
                roctx = roc.getContext('2d');

              oc.width = img.width;
              oc.height = img.height;
              octx.drawImage(img, 0, 0, oc.width, oc.height);
              var w = oc.width, h = oc.height;
              var steps = Math.ceil(Math.log(img.width / Math.max(width, 125)) / Math.log(2));
              console.log('steps of resize draw is: ', steps);
              for (var i = 0; i < steps; i++) {
                w = parseInt(w * 0.5);
                h = parseInt(h * 0.5);
                roc.width = w;
                roc.height = h;
                roctx.drawImage(oc, 0, 0, w, h);
                octx.clearRect(0, 0, w, h);
                octx.drawImage(roc, 0, 0, w, h);
                console.log('i: ', i, ' steps: ', steps, oc.toDataURL());
              }
              roc.width = width;
              roc.height = Math.abs(height);
              roctx.drawImage(oc, 0, 0, w, h, 0, 0, width, Math.abs(height));
              if (img == $scope.gpng) {
                $scope.sizedGpng = rimg = roc;
              } else {
                $scope.sizedLpng = rimg = roc;
              }
            }
            ctx.drawImage(rimg, x, y, width, height);
          }
        };
      },

      setupClipImage: function(scope) {
        var pre = $rootScope.storagePrefix || '';
        var $scope = scope.$new();
        var file1 =document.getElementById('faceUpload');
        $scope.clipImageModal = $ionicModal.fromTemplate(require('../templates/modal-clip-image.html'), {
          scope:$scope,
        })
        var rotate = 0;
        function refreshModal(no_apply) {
          var nimg = $scope.nimg;
          var iw = nimg.width;
          var ih = nimg.height;
          var bw = $rootScope.try.width; //b表示下方的box
          var bh = $rootScope.try.doc_height- $rootScope.try.header_height;
          var marginh, marginw, cw, ch, rh, rw;
          var rotatew, rotateh;
          if (rotate == 0 || rotate == 2) {
            rotatew = iw;
            rotateh = ih;
          } else {
            rotatew = ih;
            rotateh = iw;
          }
          var iwh = rotatew/rotateh;
          var bwh = bw/bh;
          marginh = 0;
          marginw = 0;
          if (iwh > bwh) { //使用box宽度来展现图像
            var rh1 = bw / iwh;
            marginh = Math.floor((bh - rh1) / 2);
          } else {
            var rw1 = bh * iwh;
            marginw = Math.floor((bw - rw1) / 2);
          }
          rh = Math.floor(bh - 2*marginh); //r表示显示图像的最终区域
          rw = Math.floor(bw - 2*marginw);
          var tw = $scope.try.width;
          var th = $scope.try.height;
          var cwh = tw / th; //c为剪裁框
          var rwh = rw / rh;
          cw = rw;
          ch = rh;
          if (rwh > cwh) { //使用r的高度
            cw = Math.floor(rh * cwh);
          } else {
            ch = Math.floor(rw / cwh);
          }
          var pos1 = {
            bw: bw,
            bh: bh,
            marginh: marginh,
            marginw: marginw,
            header_height: $rootScope.try.header_height,
            cw: cw,
            ch: ch,
            cl: Math.floor((rw-cw)/2),
            ct: Math.floor((rh-ch)/2),
            rh: rh,
            rw: rw,
            iw: iw,
            ih: ih,
            rotate: rotate,
            rotatew: rotatew,
            rotateh: rotateh,
          };
          $log.debug('pos1', JSON.stringify(pos1));
          $scope.pos1 = pos1;
          var canvas = document.getElementById("img");
          var ctx = canvas.getContext("2d");
          canvas.width = rw;
          canvas.height = rh;
          //http://www.runoob.com/try/try.php?filename=tryhtml5_canvas_drawimage
          //ctx.rotate(Math.PI/2);
          //ctx.drawImage(img, 0, 0, 220, 277, 0, -138, 110, 138);

          //ctx.rotate(Math.PI);
          //ctx.drawImage(img, 0, 0, 220, 277, -110, -138, 110, 138);

          //ctx.rotate(Math.PI * 3 / 2);
          //ctx.drawImage(img, 0, 0, 220, 277, -110, 0, 110, 138);

          if (rotate == 0) {
            ctx.drawImage(nimg, 0, 0, iw, ih, 0, 0, rw, rh);
          } else if (rotate == 1) {
            ctx.rotate(Math.PI / 2);
            ctx.drawImage(nimg, 0, 0, iw, ih, 0, -rw, rh, rw);
          } else if (rotate == 2) {
            ctx.rotate(Math.PI);
            ctx.drawImage(nimg, 0, 0, iw, ih, -rw, -rh, rw, rh);
          } else {
            ctx.rotate(Math.PI * 3 / 2);
            ctx.drawImage(nimg, 0, 0, iw, ih, -rh, 0, rh, rw);
          }
          $log.debug("image draw by ", rotate, pos1);
          if (!no_apply)
            $scope.$apply();
          var beginX = 0;
          var beginY = 0;
          var beginCl = 0;
          var beginCt = 0;
          $("#cutBox").on("touchstart", function(event) {
            $log.debug("touchstart called");
            event.preventDefault();
            event.stopPropagation();
            beginX=event.originalEvent.changedTouches[0].pageX;
            beginY=event.originalEvent.changedTouches[0].pageY;
            beginCl = pos1.cl;
            beginCt = pos1.ct;
          });
          $("#cutBox").bind("touchmove", function (event) {
            //$log.debug("touchmove called pos1:" + JSON.stringify(pos1));
            event.preventDefault();
            event.stopPropagation();
            var x = event.originalEvent.changedTouches[0].pageX;
            var y = event.originalEvent.changedTouches[0].pageY;
            var dx = x - beginX;
            var dy = y - beginY;
            if (pos1.rh != pos1.ch) { //高度不同，可以移动高度
              var nt = beginCt + dy;
              pos1.ct = ensureRange(nt, 0, rh - pos1.ch);
            } else {
              var nl = beginCl + dx;
              pos1.cl = ensureRange(nl, 0, rw - pos1.cw);
            }
            $scope.$apply();
          });
          $("#cutBox").bind("touchend", function (event) {
            event.preventDefault();
            event.stopPropagation();
          });
        }
        function imgReady(nimg) {
          $log.debug('nimg ready, reader result len is: ' + nimg.src.length);
          if (nimg.src.length < 30*1024) {
            $log.debug('nimg is:', nimg.src);
          }
          nimg.hidden = 1;
          $scope.nimg = nimg;
          rotate = 0;
          refreshModal();
        }
        $scope.rotateRight = function() {
          $log.debug("rotate right called");
          rotate += 1;
          rotate %= 4;
          refreshModal(1);
        };
        $scope.cancelImage = function () {
          $scope.clipImageModal.hide();
        };
        $scope.saveImage = function() {
          var pos1 = $scope.pos1;
          $log.debug("save image, pos: " + JSON.stringify(pos1));
          var output = document.createElement("canvas");
          var ctx = output.getContext("2d");
          var tw = $scope.try.width;
          var th = $scope.try.height;
          output.width = tw;
          output.height = th;
          //我被浮点型坑了，一定要用整形值
          var s = th / pos1.ch;
          var img1 = document.getElementById('img');
          ctx.drawImage(img1, 0, 0, parseInt(pos1.rw), parseInt(pos1.rh), parseInt(-pos1.cl*s), parseInt(-pos1.ct*s), parseInt(pos1.rw*s), parseInt(pos1.rh*s));

          var data = output.toDataURL("image/png");
          $log.debug('image clipped length is ' + data.length);
          $log.debug(data);
          if (data.length < 10*1024) {
            $log.error('result image error, length ', data.length);
            //alert('剪裁失败，请重新选择照片');
            BaseService.showFlashMessage('剪裁失败，请重新选择照片','popup-danger');
            $scope.clipImageModal.hide();
            return;
          }
          if (data.length > 1024*1024) {
            //alert('剪裁后的图片太大，请重新选择图片');
            BaseService.showFlashMessage('剪裁后的图片太大，请重新选择照片','popup-danger');
            $scope.clipImageModal.hide();
            return;
          }
          document.getElementById('origin-img').src = "";
          $ionicLoading.show({template:"人脸识别中...."});
          var file_name = new Date().getTime();
          $http.post('/api/call/face/face_pp?file_name='+file_name, {data:data})
            .then(function(jdata){
              $ionicLoading.hide();
              $scope.clipImageModal.hide();
              var jres = jdata.data;
              if (typeof jres == 'string')
                jres = JSON.parse(jres);
              $log.debug("returned obj is: ", jres);
              if (!jres.success) {
                //alert('图像识别失败，请重新选择图片');
                BaseService.showFlashMessage('图像识别失败，请重新选择照片','popup-danger');
                return;
              }
              var strdata=JSON.stringify(jres);
              localStorage[pre+'facePos'] = strdata;
              localStorage[pre+'faceImage'] = data;
              localStorage[pre+'faceImageName'] = file_name;
              localStorage[pre+'offsetX'] = 0;
              localStorage[pre+'offsetY'] = 0;
              $('#face').attr('src', data);
              $scope.clipDone();
            });
        };
        return function(src, clipDone) {
          console.log('clipImage called');
          $scope.clipDone = clipDone || function(){};
          $scope.clipImageModal.show().then(
            function () {
              $log.debug("modalShowed called");
              $rootScope.iconShow = false;
              var nimg = document.getElementById('origin-img');
              nimg.onload = function(){
                imgReady(nimg);
              };
              nimg.src = src;
            });
        };
      },
    }
  })



/** WEBPACK FOOTER **
 ** ./js/epj-svr-share.js
 **/
