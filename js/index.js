var FixedLabels = {
  "label.country": "Country",
  "label.country.plural": "Countries",
  "label.country.breadcrumb": "Settings > Localization > ",
  "label.button.new": "<i class=\"fa fa-fw fa-plus\"></i> New",
  "label.button.cancel": "<i class=\"fa fa-fw fa-undo\"></i> Cancel",
  "label.button.remove": "<i class=\"fa fa-fw fa-trash-o\"></i> Remove",
  "label.button.duplicate": "<i class=\"fa fa-fw fa-copy\"></i> Duplicate",
  "label.button.save": "<i class=\"fa fa-fw fa-floppy-o\"></i> Save",
  "label.search": "Search",
  "label.search.placeholder": "Search ...",
  "label.resultlist": "Result List",
  "label.country.name": "Name",
  "label.country.abrev": "Abreviation",
  "label.country.code": "Country Code",
  "label.createdAt": "Created At",
  "label.lastUpdated": "Last Updated"
};

var RESTServiceEmulator = (function() {
  var scope = this;
  var nextCode = 1;
  var data = [{
    "id": nextCode++,
    "name": "Brazil",
    "abrev": "BRL",
    "code": "55",
    "createdAt": new Date(),
    "createdBy": "João Paulo Varandas",
    "updatedAt": new Date(),
    "updatedBy": "Other user"
  }, {
    "id": nextCode++,
    "name": "United States of America",
    "abrev": "USA",
    "code": "1"
  }, {
    "id": nextCode++,
    "name": "Mexico",
    "abrev": "MEX",
    "code": "33"
  }, {
    "id": nextCode++,
    "name": "Uruguay",
    "abrev": "URU",
    "code": "3"
  }, {
    "id": nextCode++,
    "name": "Argentina",
    "abrev": "ARG",
    "code": "27"
  }];
  
  function icontains(obj, filter) {
    var ifilter = filter.toLowerCase();
    for (var k in obj) {
      
      if (typeof(obj[k]) == "string" && obj[k].toLowerCase().indexOf(ifilter) > -1) return true;
    }
    
    return false
  }

  scope["find"] = function(filter) {
    if (filter == null) return $.extend(true, [], data);
    var rs = [];
    for (var k in data) {
      if(icontains(data[k], filter)) rs.push(data[k])
    }
    return $.extend(true, [], rs);
  }

  scope["get"] = function(id) {
    for (var k in data) {
      if (data.id == id) return data;
    }

    throw "error.notfound";
  }

  scope["set"] = function(o, cb) {
    if (o.id != null) {
      for (var k in data) {
        if (data[k].id == o.id) {
          data[k] = o;
          cb();
          return o;
        }
      }

      throw "error.notfound";
    } else {
      o.id = nextCode++;
      data.push[o];
    }
  }

  scope["remove"] = function(id, cb) {
    for (var k in data) {
      if (data.id == id) {
        cb();
        return data.splice(k, 1);
      }
    }

    throw "error.notfound";
  }

  return this;
})();

(function() {
  console.clear();

  var country = angular.module('country', []);
  country.controller('CountryController', ['$scope', function($scope) {
    $scope.list = RESTServiceEmulator.find();
    $scope.data = null;
    $scope.selected = null;
    $scope.search = null;

    $scope.translate = function(label) {
      return FixedLabels[label];
    }
    
    $scope.find = function() {
      $scope.list = RESTServiceEmulator.find($scope.search);
    }
        
    $scope.new = function() {
      $scope.selected = {};
    }
    
    $scope.edit = function(row) {
      $scope.selected = $.extend({}, row);
    }
    
    $scope.cancel = function() {
      $scope.selected = null;
    }

    $scope.remove = function(element) {
      RESTServiceEmulator.remove(element.id, $scope.afterSave);
      
      $scope.selected = null;
    }

    $scope.duplicate = function(element) {
      $scope.selected.id = null;
    }

    $scope.save = function(element) {
      RESTServiceEmulator.set(element, $scope.afterSave);
    }
    
    $scope.afterSave = function(data) {
      $scope.selected = null;
       
      $scope.find();
    }


    
    
  }]);
  
  country.filter('unsafe', function($sce) {
    console.log(typeof($sce));
    return $sce.trustAsHtml;
  });




  $(document).ready(function() {
    $('[data-toggle="tooltip"]').tooltip();
  });

})();