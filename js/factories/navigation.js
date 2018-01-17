var adminURL = "";
if (isproduction) {
    // adminURL = "http://www.wohlig.co.in/demo/index.php";
    adminurl = "http://localhost/boxxitAngularPhp/backend/request.php";    
} else {
    adminurl = "http://localhost/boxxitAngularPhp/backend/request.php";
    // adminURL = "https://opportunist-toleran.000webhostapp.com/backend/request.php";    
    // adminURL = "http://localhost:8080/backend/request.php";
    
}
var imgurl = adminurl + "/upload/";

var imgpath = imgurl + "readFile";
var uploadurl = imgurl;



myApp.factory('NavigationService', function ($http) {
    var navigation = [{
            name: "Category",
            classis: "activeColor",
            sref: "#/category",
            icon: "phone"
        },
        {
            name: "Sub Category",
            classis: "activeColor",
            sref: "#/sub-category",
            icon: "phone"
        },
        {
            name: "Products",
            classis: "activeColor",
            sref: "#/products",
            icon: "phone"
        }
    ];

    return {
        getnav: function () {
            return navigation;
        },

        parseAccessToken: function (data, callback) {
            if (data) {
                $.jStorage.set("accessToken", data);
                callback();
            }
        },

        removeAccessToken: function (data, callback) {
            $.jStorage.flush();
        },

        profile: function (callback, errorCallback) {
            var data = {
                accessToken: $.jStorage.get("accessToken")
            };
            $http.post(adminurl + 'user/profile', data).then(function (data) {
                data = data.data;
                if (data.value === true) {
                    $.jStorage.set("profile", data.data);
                    callback();
                } else {
                    errorCallback(data.error);
                }
            });
        },

        makeactive: function (menuname) {
            for (var i = 0; i < navigation.length; i++) {
                if (navigation[i].name == menuname) {
                    navigation[i].classis = "activeColor";
                } else {
                    navigation[i].classis = "";
                }
            }
            return menuname;
        },

        delete: function (url, data, callback) {
            $http({
                method: "POST",
                url: adminurl + url,
                data: data
            }).then(function (data) {
                callback(data.data);
            });
        },

        getOneCategory: function (id, callback) {
            $http({
                method: "POST",
                url: adminurl + "/categories/getOne",
                data: {
                    "_id": id
                }
            }).then(function (data) {
                callback(data.data);
            });
        },

        getAllCategories: function (callback) {
            $http({
                method: "POST",
                url: adminurl + "/categories/getAll"
            }).then(function (data) {
                callback(data.data);
            });
        },

        saveCategory: function (url, data, callback) {
            $http({
                method: "POST",
                url: url,
                data: data
            }).then(function (data) {
                callback(data.data);
            });
        },

        getOneSubCategory: function (id, callback) {
            $http({
                url: adminurl + "/sub_categories/getOneById",
                method: "POST",
                data:{
                    "id":id
                }
            }).then(function (subCat) {
                console.log("sub category------", subCat.data);
                callback(subCat.data);
            })
        },

        getAllSubCategories: function (callback) {
            $http({
                url: adminurl + "/sub_categories/getAll",
                method: "POST"

            }).then(function (subCat) {
                console.log("sub category------", subCat.data);
                callback(subCat.data);
            })
        },

        getAllByCat:function(data,callback){
            $http({
                url: adminurl + "/sub_categories/getAllByCat",
                method: "POST",
                data:data
            }).then(function (subCat) {
                console.log("sub categories------", subCat.data);
                callback(subCat.data);
            })
        },

        saveSubCategory: function (url, data, callback) {
            $http({
                method: "POST",
                url: url,
                data: data
            }).then(function (data) {
                callback(data.data);
            });
        },

        getOneProduct:function (id, callback) {
            $http({
                url: adminurl + "/products/getOneById",
                method: "POST",
                data:{
                    "id":id
                }
            }).then(function (prod) {
                console.log("product------", prod.data);
                callback(prod.data);
            })
        },

        getAllProducts: function (callback) {
            $http({
                url: adminurl + "/products/getAll",
                method: "POST"
            }).then(function (prod) {
                console.log("products------", prod.data);
                callback(prod.data);
            })
        },

        saveProducts: function (url, data, callback) {
            $http({
                method: "POST",
                url: url,
                data: data
            }).then(function (data) {
                callback(data.data);
            });
        },





    };
});