(function () {
    "use strict";
    angular
        .module("YGStatusAPP")
        .controller("YGCompareCtrl", ['$scope','$http','APIServices', YG_StatusMonitoring]);



    function YG_StatusMonitoring($scope,$http, APIServices) {
        var self = $scope;

        //===========================声明的参数===================================
        //定义当前系统时间
        var _date = moment.utc().format("YYYYMMDD");
        //var _date = "20180123";

        //定义历史当前显示当前为第几组和总共有几组
        self.hestoryNumNow="";
        self.hestoryNumAll="";

        self.timerStatus = "false";

        //初始化数据传输
        function initDataPicker() {
            $(document).ready(function () {
                $("#sv-datarangepicker-input").daterangepicker({
                        "singleDatePicker": true,
                        "showDropdowns": true,
                        //"timePicker": true,
                        //"timePicker24Hour": true,
                        "autoApply": true,
                        "drops": "down",
                        endDate: new Date(),
                        maxDate: new Date(),
                        locale: {
                            format: 'YYYY-MM-DD',
                            daysOfWeek: ["日", "一", "二", "三", "四", "五", "六"],
                            monthNames: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
                        }
                    },
                    function (start, end, label) {
                        self.timerStatus="false";
                        console.log(self.timerStatus);
                        var selectDateStr = start.format("YYYYMMDD");
                        GF4_get(selectDateStr);
                        clearInterval(timerDate);

                    }
                );
            });
        }

        //==============================================================
        var GF4_get=function(real_time){
            //var real_time="20180123";
            APIServices.getImgUrl(real_time, function successCallback(res) {
                if (res.status === 200) {
                    //console.log(res.data);
                    /*实时数据*/
                    $scope.real=res.data.real;
                    //计算百分数
                    $scope.progress=Number(res.data.real.progress)*100+"%";

                    $scope.history=res.data.history;
                    //计算个数
                    $scope.historyNum=$scope.history.length;
                    self.hestoryNumNow=$scope.historyNum;
                    self.hestoryNumAll=$scope.historyNum;
                    /*历史数据*/
                    $scope._history=$scope.history[$scope.historyNum-1];
                }
            },function(err)
            {
                console.log(err);
            });

        }

        self.historyLeft = function(){
            if(self.hestoryNumNow>1 && self.hestoryNumNow<=self.hestoryNumAll){
                self.hestoryNumNow=self.hestoryNumNow-1;
            }else if(self.hestoryNumNow=="1"){
                self.hestoryNumNow=self.hestoryNumAll-1;
            }
            //console.log(self.hestoryNumNow,self.hestoryNumAll);
            $scope._history=$scope.history[self.hestoryNumNow];
        }

        self.historyRight = function(){
            if(self.hestoryNumNow>=1 && self.hestoryNumNow<self.hestoryNumAll-1){
                self.hestoryNumNow=self.hestoryNumNow+1;
            }else if(self.hestoryNumNow>=self.hestoryNumAll-1){
                self.hestoryNumNow=1;
            }
            console.log(self.hestoryNumNow,self.hestoryNumAll);
            $scope._history=$scope.history[self.hestoryNumNow];
        }

        //初始化
        function initGF4(_date) {
            initDataPicker();
            GF4_get(_date);
        }

        initGF4(_date);

        //定义定时器
        var timerDate = setInterval(function(){
            self.timerStatus="true";
            var real_time = moment.utc().format("YYYYMMDD");
            //var real_time = "20180123";
            GF4_get(real_time);
        }, 1000);

        /*关闭定时器*/
        //clearInterval(timerDate);

        /*自动监视*/
        self.automaticFun = function () {
            if(self.timerStatus=="false"){
                self.timerStatus=="true";
                var timerDate = setInterval(function(){
                    var real_time = moment.utc().format("YYYYMMDD");
                    GF4_get(real_time);
                }, 1000*40);
            }
            else if(self.timerStatus=="true"){
                console.log("自动监视已启动！！！");
            }

        }
    }
})();