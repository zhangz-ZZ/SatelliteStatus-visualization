(function () {

    "use strict";
    angular.module("YGStatusAPP")
        .factory("APIServices", APIServices);
    APIServices.$inject = ['$http'];

    function APIServices($http) {
        var baseIP = "http://10.24.34.171:3010";
        var self = {
            getImgUrl: getImgUrl
        };

        return self;

        //添加区域配置
        function getImgUrl(_date, successFn, errorFn) {
            $http({
                "method": "GET",
                "url": baseIP + '/recv_data/' + _date
            }).then(successFn, errorFn);
        };


    }
})();