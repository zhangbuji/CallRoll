/**
 * Created by nanjolno on 2017/6/10.
 */

'use strict';
/**
 * 菜单控制
 * @param {[type]} $scope [description]
 * @param {[type]} $http  [description]
 * @param {[type]} $modal [description]
 */

function MajorCtrl ($scope, $http, $modal,constantIP){
    console.log("加载专业管理..."+constantIP);

    $scope.filterOptions = {
        filterText: "",
        useExternalFilter: true
    };
    $scope.totalServerItems = 0;
    $scope.pagingOptions = {
        pageSizes: [10, 50, 100],
        pageSize: 10,
        currentPage: 1
    };
    $scope.setPagingData = function(data, page, pageSize){
        var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
        $scope.myData = pagedData;
        $scope.totalServerItems = data.length;
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    };
    $scope.getPagedDataAsync = function (pageSize, page, searchText) {
        $http({
            method: 'POST',
            url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/getAllDdMajor'
        }).success(function(largeLoad) {
            var obj = $scope.gridOptions.selectedItems;
            obj.splice(0,obj.length);
            $scope.setPagingData(largeLoad.ddMajors, page, pageSize);
        });
    };

    $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage);

    $scope.$watch('pagingOptions', function (newVal, oldVal) {
        if (newVal !== oldVal || newVal.currentPage !== oldVal.currentPage) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);
    $scope.$watch('filterOptions', function (newVal, oldVal) {
        if (newVal !== oldVal) {
            $scope.getPagedDataAsync($scope.pagingOptions.pageSize, $scope.pagingOptions.currentPage, $scope.filterOptions.filterText);
        }
    }, true);

    $scope.gridOptions = {
        data: 'myData',
        i18n:'zh-cn',
        enablePaging: true,
        showFooter: true,
        showSelectionCheckbox: true,
        totalServerItems: 'totalServerItems',
        pagingOptions: $scope.pagingOptions,
        filterOptions: $scope.filterOptions,
        selectedItems: [],
        columnDefs: [
            {field:'dname', displayName:'名称'},
            {field:'major', displayName:'值'}
        ]
    };

    //新增
    $scope.insert = function(){
        $modal.open({
            templateUrl: "/templates/major/majorModal.html",
            controller: 'MajorInsertCtrl1',
            resolve: {
                grid: function(){ return $scope; }
            }
        });
    };

    //更新
    $scope.update = function(){
        var selectedItems = $scope.gridOptions.selectedItems;
        if(selectedItems.length != 1){
            alert("请选择一条记录");
            return;
        }
        $modal.open({
            templateUrl: "/templates/major/majorModal.html",
            controller: 'MajorUpdateCtrl',
            resolve:{
                grid: function(){ return $scope; }
            }
        });
    };

    //删除
    $scope.delete = function(){
        var selectedItems = $scope.gridOptions.selectedItems;
        if(selectedItems.length == 0){
            alert("请至少选择一条记录");
            return;
        }
        if(!confirm("删除是不可恢复的，你确认要删除吗？")){
            return;
        }
        var selectedItems = $scope.gridOptions.selectedItems;
        var ids = [];

        //var strJson="{";

        for(var i = 0; i < selectedItems.length; i++){
            ids.push(selectedItems[i]["dname"]);
        }
        var json = {};
        for(var i1=0;i1<ids.length;i1++)
        {
            json[i1]=ids[i1];
        }
        JSON.stringify(json);

        $http({
            method: 'POST',
            url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/deleteDdMajorByName',
            params: {
                "dname": json
            }
        }).then(function(results){
            //刷新列表
        }).then(function (response) {
            var grid = $scope;
            grid.getPagedDataAsync(grid.pagingOptions.pageSize, grid.pagingOptions.currentPage);
        });
    };
}

/**
 * 菜单新增控制
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} $http          [description]
 * @param {[type]} grid           [description]
 */
function MajorInsertCtrl($scope, $modalInstance, $http, grid,constantIP){

    $scope.majors={
    };
    $scope.ok = function () {
        $http({
            method: 'POST',/*-GET--*/
            url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/createDdMajor',
            data:{
                "dname": $scope.majors.dname,
                "major": $scope.majors.major
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            transformRequest: function(data) {
                return $.param(data);
            }
        }).success(function(results){
            //刷新列表
            grid.getPagedDataAsync(grid.pagingOptions.pageSize, grid.pagingOptions.currentPage);
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}
function MajorInsertCtrl1($scope, $modalInstance, $http, grid,constantIP){

    $scope.majors={
    };
    $scope.ok = function () {
        $http({
            method: 'POST',/*-GET--*/
            url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/createDdMajor',
            data:{
                "dname": $scope.majors.dname,
                "major": $scope.majors.major
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            transformRequest: function(data) {
                return $.param(data);
            }
        }).success(function(results){
            //刷新列表
            grid.getPagedDataAsync(grid.pagingOptions.pageSize, grid.pagingOptions.currentPage);
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}

/**
 * 菜单更新控制
 * @param {[type]} $scope         [description]
 * @param {[type]} $modalInstance [description]
 * @param {[type]} $http          [description]
 * @param {[type]} grid           [description]
 */
function MajorUpdateCtrl($scope, $modalInstance, $http, grid,$log,constantIP){
    console.log("iiiiiiiiiiiiiiiiiiiiii"+grid.gridOptions.selectedItems[0].Dname);
    var oldmajorname = "";

    console.log('http://'+constantIP+':8080/shhTest/ddMajoraction/getDdMajorStateByName');
    $http({
        method: 'GET',
        url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/getDdMajorStateByName',
        params: {"dname": grid.gridOptions.selectedItems[0].dname}
    }).success(function(results){
        //$scope.majors.Dname=results

        console.log(results);
        $log.log(results.ddMajor);
        oldmajorname = results.ddMajor.dname;
        $scope.majors = {};
        for(var key in results.ddMajor){
            $scope.majors[key] = results.ddMajor[key];
            console.log(key);
        }


    });

    $scope.ok = function () {
        $http({
            method: 'POST',
            url: 'http://'+constantIP+':8080/shhTest/ddMajoraction/updateDdMajorStateByName',
            data: {
                "oldname":oldmajorname,
                "dname": $scope.majors.dname,
                "major": $scope.majors.major
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            transformRequest: function(data) {
                return $.param(data);
            }
        }).success(function(results){
            //刷新列表
            $log.log(results.state);
            grid.getPagedDataAsync(grid.pagingOptions.pageSize, grid.pagingOptions.currentPage);
            $modalInstance.close();
        });
    };

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
}