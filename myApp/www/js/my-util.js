angular.module('MyUtil', [])
  .factory('MHttp', function($http) {
    return {
      get: function (url) {
        var o = {};
        o.$promise = $http.get(url);
        o.$resolved = false;
        o.$promise.then(function(data) {
          for (var k in data.data) {
            o[k] = data.data[k];
          }
          o.$resoved = true;
        });
        return o;
      },
      query: function (url) {
        var o = [];
        o.$promise = $http.get(url);
        o.$resolved = false;
        o.$promise.then(function(data) {
          for (var k in data.data) {
            o.push(data.data[k]);
          }
          o.$resoved = true;
        });
        return o;
      },
    }
  })
;
