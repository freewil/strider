
app.controller('CollaboratorsCtrl', ['$scope', function ($scope) {
  function remove(ar, item) {
    ar.splice(ar.indexOf(item), 1);
  }
  $scope.new_email = '';
  $scope.new_access = 0;
  $scope.collaborators = window.collaborators || [];
  $scope.remove = function (item) {
    item.loading = true;
    $scope.clearMessage();
    $.ajax({
      url: '/' + $scope.project.name + '/collaborators/',
      type: 'DELETE',
      data: {email: item.email},
      success: function(data, ts, xhr) {
        remove($scope.collaborators, item);
        $scope.success(item.email + " is no longer a collaborator on this project.", true);
      },
      error: function(xhr, ts, e) {
        item.loading = false;
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error deleting collaborator: " + data.errors[0], true);
        } else {
          $scope.error("Error deleting collaborator: " + e, true);
        }
      }
    });
  };
  $scope.add = function () {
    var data = {
      email: $scope.new_email,
      access: $scope.new_access || 0,
      gravatar: $scope.gravatar($scope.new_email),
      owner: false
    };

    $.ajax({
      url: '/' + $scope.project.name + '/collaborators/',
      type: "POST",
      data: data,
      dataType: "json",
      success: function(res, ts, xhr) {
        $scope.new_access = 0;
        $scope.new_email = '';
        if (res.created) {
          $scope.collaborators.push(data);
        }
        $scope.success(res.message, true, !res.created);
      },
      error: function(xhr, ts, e) {
        if (xhr && xhr.responseText) {
          var data = $.parseJSON(xhr.responseText);
          $scope.error("Error adding collaborator: " + data.errors[0], true);
        } else {
          $scope.error("Error adding collaborator: " + e, true);
        }
      }
    });
  };
}]);
