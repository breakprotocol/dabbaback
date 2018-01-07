myApp.controller('CategoryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("category");
  $scope.menutitle = NavigationService.makeactive("Category");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();

  $scope.formData = {};
  $scope.formData.page = 1;
  $scope.formData.type = '';
  $scope.formData.keyword = '';

  $scope.searchInTable = function (data) {
    $scope.formData.page = 1;
    if (data.length >= 2) {
      $scope.formData.keyword = data;
      $scope.viewTable();
    } else if (data.length == '') {
      $scope.formData.keyword = data;
      $scope.viewTable();
    }
  }

  // TABLE VIEW 
  $scope.getAllCategories = function () {
    // $scope.search = $scope.formData.keyword;
    NavigationService.getAllCategories(function (data) {
      console.log(data);
      $scope.items = data;
      $scope.totalItems = data.length;
      // $scope.maxRow = data.data.options.count;
    });
  }

  $scope.getAllCategories();
  // TABLE VIEW END

  // DELETE
  $scope.confDel = function (data) {
    $scope.deleteId = data;
    $scope.modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal/delete.html',
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      scope: $scope
    });
  };

  $scope.noDelete = function () {
    $scope.modalInstance.close();
  }

  $scope.delete = function (id) {
    // console.log(data);
    var url = "/categories/delete";
    var obj = {};
    obj.id = id;
    NavigationService.delete(url, obj, function (data) {
      if (data == '1' || data == "true") {
        toastr.success('Successfully Deleted', 'Sponsor Page');
        $scope.modalInstance.close();
        $scope.getAllCategories();
      } else {
        toastr.error('Something Went Wrong while Deleting', 'Sponsor Page');
      }
    });
  }
  // DELETE END
});

myApp.controller('DetailCategoryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("detailcategory");
  $scope.menutitle = NavigationService.makeactive("Special Award");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.title = 'Create';
  $scope.formData = {};
  if ($stateParams.id) {
    $scope.title = "Edit";
    NavigationService.getOneCategory($stateParams.id, function (data) {
      console.log("data", data);
      $scope.formData = {
        "_id": data[0]._id,
        "name": data[0].name,
        "priority": data[0].priority
      }
    });

  }


  // SAVE
  $scope.saveData = function (data) {
    var url = "";
    if ($stateParams.id) {
      //edit
      url = adminurl + "/categories/update"
    } else {
      //create
      url = adminurl + "/categories/create"
    }


    NavigationService.saveCategory(url, data, function (data) {
      if (data == '1' || data == 'true') {
        toastr.success("Data saved successfully", 'Success');
        $scope.formData._id = "";
        $scope.formData.name = "";
        $scope.formData.priority = "";
      } else {

      }
    });
  }
  // SAVE END

  $scope.onCancel = function (sendTo) {

    $state.go(sendTo);
  };
});

myApp.controller('SubCategoryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("subcategory");
  $scope.menutitle = NavigationService.makeactive("Sub Category");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.formData = {};
  $scope.formData.page = 1;
  $scope.formData.type = '';
  $scope.formData.keyword = '';

  $scope.searchInTable = function (data) {
    $scope.formData.page = 1;
    if (data.length >= 2) {
      $scope.formData.keyword = data;
      $scope.viewTable();
    } else if (data.length == '') {
      $scope.formData.keyword = data;
      $scope.viewTable();
    }
  }

  // TABLE VIEW 
  $scope.getAllSubCategories = function () {
    // $scope.search = $scope.formData.keyword;
    NavigationService.getAllSubCategories(function (data) {
      console.log(data);
      $scope.items = data;
      $scope.totalItems = data.length;
      // $scope.maxRow = data.data.options.count;
    });
  }

  $scope.getAllSubCategories();
  // TABLE VIEW END



  // DELETE
  $scope.confDel = function (data) {
    $scope.deleteId = data;
    $scope.modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal/delete.html',
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      scope: $scope
    });
  };


  $scope.noDelete = function () {
    $scope.modalInstance.close();
  }

  $scope.delete = function (id) {
    // console.log(data);
    var url = "/sub_categories/delete";
    var obj = {};
    obj.id = id;
    console.log(obj);
    NavigationService.delete(url, obj, function (data) {
      if (data == '1' || data == "true") {
        toastr.success('Successfully Deleted', 'Sponsor Page');
        $scope.modalInstance.close();
        $scope.getAllSubCategories();
      } else {
        toastr.error('Something Went Wrong while Deleting', 'Sponsor Page');
      }
    });
  }
  // DELETE END
});

myApp.controller('DetailSubCategoryCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("detailsubcategory");
  $scope.menutitle = NavigationService.makeactive("Special Award");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.title = 'Create';
  $scope.formData = {};
  $scope.category = {
    'selectedCategory': {}
  };
  NavigationService.getAllCategories(function (data) {
    console.log(data);
    $scope.categories = data;
    // $scope.maxRow = data.data.options.count;
  });

  if ($stateParams.id) {
    $scope.title = "Edit";
    NavigationService.getOneSubCategory($stateParams.id, function (data) {
      console.log("data", data);
      $scope.formData = {
        "id": data[0]._id,
        "name": data[0].sub_cat_name,
        "category": data[0].cat_id
      };

      $scope.category = {
        "selectedCategory": {
          "id": data[0].cat_id,
          "name": data[0].cat_name
        }
      }
    });
  }


  $scope.saveData = function (data) {
    var url = "";
    data.category = $scope.category.selectedCategory.id;
    if ($stateParams.id) {
      //edit
      url = adminurl + "/sub_categories/update"
      var callback = function (data) {
        if (data == '1' || data == 'true') {
          toastr.success("Data updated successfully", 'Success');
        }
      }
    } else {
      //create
      url = adminurl + "/sub_categories/create"
      var callback = function (data) {
        if (data == '1' || data == 'true') {
          toastr.success("Data saved successfully", 'Success');
          $scope.formData._id = "";
          $scope.formData.name = "";
          $scope.formData.priority = "";
        }
      }
    }
    NavigationService.saveSubCategory(url, data, callback);
  }

  $scope.onCancel = function (sendTo) {

    $state.go(sendTo);
  };
});

myApp.controller('ProductsCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("products");
  $scope.menutitle = NavigationService.makeactive("Products");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.configData = {};

  // TABLE VIEW 
  $scope.getAllProducts = function () {
    // $scope.search = $scope.formData.keyword;
    NavigationService.getAllProducts(function (data) {
      console.log(data);
      $scope.items = data;
      $scope.totalItems = data.length;
      // $scope.maxRow = data.data.options.count;
    });
  }

  $scope.getAllProducts();
  // TABLE VIEW END

  // DELETE
  $scope.confDel = function (data) {
    $scope.deleteId = data;
    $scope.modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'views/modal/delete.html',
      backdrop: 'static',
      keyboard: false,
      size: 'sm',
      scope: $scope
    });
  };

  $scope.noDelete = function () {
    $scope.modalInstance.close();
  }

  $scope.delete = function (id) {
    // console.log(data);
    var url = "/products/delete";
    var obj = {};
    obj.id = id;
    console.log(obj);
    NavigationService.delete(url, obj, function (data) {
      if (data == '1' || data == "true") {
        toastr.success('Successfully Deleted', 'Sponsor Page');
        $scope.modalInstance.close();
        $scope.getAllProducts();
      } else {
        toastr.error('Something Went Wrong while Deleting', 'Sponsor Page');
      }
    });
  }

});

myApp.controller('DetailProductsCtrl', function ($scope, TemplateService, NavigationService, $timeout, $stateParams, $state, toastr, $uibModal) {
  //Used to name the .html file
  $scope.template = TemplateService.changecontent("detailproducts");
  $scope.menutitle = NavigationService.makeactive("Special Award");
  TemplateService.title = $scope.menutitle;
  $scope.navigation = NavigationService.getnav();
  $scope.formData = {};
  $scope.subCategory = {
    "selectedSubCategory": {}
  }
  NavigationService.getAllCategories(function (data) {
    console.log(data);
    $scope.categories = data;
    // $scope.maxRow = data.data.options.count;
  });

  $scope.searchSubCategories = function (_id) {
    var obj = {
      "category": _id
    }
    console.log(obj);
    NavigationService.getAllByCat(obj, function (data) {
      $scope.subCategories = data;
    })
  }

  if ($stateParams.id) {
    $scope.title = "Edit";
    NavigationService.getOneProduct($stateParams.id, function (data) {
      console.log("data", data);
      $scope.searchSubCategories(data[0].cat_id);
      $scope.formData = {
        "id": data[0]._id,
        "name": data[0].prod_name,
        "priority": data[0].prod_priority,
        "status": data[0].prod_status,
        "link": data[0].prod_link
      };

      $scope.category = {
        "selectedCategory": {
          "id": data[0].cat_id,
          "name": data[0].cat_name
        }
      }

      $scope.subCategory = {
        "selectedSubCategory": {
          "id": data[0].sub_cat_id,
          "name": data[0].sub_cat_name
        }
      }
    });
  }


  $scope.saveData = function (data) {
    var url = "";
    data.sub_categories = $scope.subCategory.selectedSubCategory.id;
    if ($stateParams.id) {
      //edit
      url = adminurl + "/products/update"
      var callback = function (data) {
        if (data == '1' || data == 'true') {
          toastr.success("Data updated successfully", 'Success');
        }
      }
    } else {
      //create
      url = adminurl + "/products/create"
      var callback = function (data) {
        if (data == '1' || data == 'true') {
          toastr.success("Data saved successfully", 'Success');
          $scope.formData._id = "";
          $scope.formData.name = "";
          $scope.formData.priority = "";
          $scope.forData.satus = "";
          $scope.subCategories.selectedSubCategory = {};
        }
      }
    }
    NavigationService.saveProducts(url, data, callback);
  }

  $scope.onCancel = function (sendTo) {

    $state.go(sendTo);
  };
});