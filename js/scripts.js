 var chillModule =angular
  .module('MyApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
  .controller('DemoCtrl', function($scope, $mdDialog) {
    $scope.user = {
      name: 'chill qq',
      email: '',
      phone: '',
      dependant: 'Dependants Under 18',
      loan: 18500,
      minTerm: 1,
      maxTerm: 3,
    };

    $scope.dependants = ('Dependants 1 2 3 4 5 6 7 8 9 10').split(' ').map(function(dependant) {
      return {abbrev: dependant};
    });

    $scope.items = [0, 1, 2, 3, 4, 5, 6, 7];
    $scope.selectedItem;
    $scope.getSelectedText = function() {
      if ($scope.selectedItem !== undefined) {
        if($scope.selectedItem === 1){
          return   $scope.selectedItem + " dependant";
        }else{
          return   $scope.selectedItem + " dependants";
        }
      } else {
        return "Dependants Under 18";
      }
    };
    $scope.myForm ='hide';
    $scope.successApp ='hide';

    //Minimum and Maximum Loan Terms by Loan value
    $scope.calculateTerms = function(user){
      var loanValue = $scope.user.loan;
      if(loanValue>=1500 && loanValue<=4999){ 
        $scope.user.minTerm = 1; 
        $scope.user.maxTerm = 3; 
        $scope.user.rate = 12.5;
      }else if(loanValue>=5000 && loanValue<=14999){ 
        $scope.user.minTerm = 1; 
        $scope.user.maxTerm = 5;
        $scope.user.rate = 10.9;
      }else if(loanValue>=15000 && loanValue<=60000){ 
        $scope.user.minTerm = 1; 
        $scope.user.maxTerm = 7;
        $scope.user.rate = 7.5;
      }
    }
    // Background Calculations for affordability

    // Income
    $scope.childBenefit = function(dependants){
      return (dependants*140);
    }
    $scope.totalIncome = function(user){
      return $scope.parseIntBase10(user.salary) + $scope.parseIntBase10(user.childBenefit);      
    }

    // Expenditure
    $scope.livingExpenses = function(user){
      var individual = 1400;
      var child = 250;
      return individual + (child*user.dependant);
    }
    $scope.repayments = function(user){
      return ($scope.parseIntBase10(user.rent) + $scope.parseIntBase10(user.otherpayments));
    }

    // Net Disposable Income 
    $scope.netDisposableIncome = function(user){
      return (user.totalIncome - (user.livingExpenses + user.repayments));
    }

    // Monthly Repayment
    $scope.monthlyPayment = function(user){
      var decimalRate = ((user.rate / 100)/12);
      var months = (user.maxTerm * 12);

      // console.log("decimal rate:" + decimalRate);
      // console.log("months:" + months);

      return ( decimalRate + (decimalRate / ( Math.pow((1+decimalRate), months) -1)) ) * $scope.parseIntBase10(user.loan);
    }

    $scope.applyNow = function() {
      if($scope.user.loan < 1500 || $scope.user.loan > 60000){

        $scope.showAlert("","Please, select a new value","the range for loan aplication is between €1,500 to €60,000");
        $scope.user.loan = 30000;
      }else{
        $scope.myForm = !$scope.myForm;
        $scope.myLoan = !$scope.myLoan;
        $scope.calculateTerms();
        console.log($scope.user); 
      }
      
    };

    $scope.whatComesIn = function()
    {
      
      $scope.user.dependant = $scope.selectedItem;
      $scope.user.childBenefit = $scope.childBenefit($scope.user.dependant);
      $scope.user.totalIncome = $scope.totalIncome($scope.user);
      console.log($scope.user); 
      $scope.nextTab();
      
    };
    $scope.whatGoesOut = function()
    {
      $scope.user.livingExpenses = $scope.livingExpenses($scope.user);
      $scope.user.repayments = $scope.repayments($scope.user);
      $scope.user.NDI = $scope.netDisposableIncome($scope.user);
      $scope.user.monthlyPayment = $scope.monthlyPayment($scope.user);
      console.log($scope.user); 
      $scope.nextTab();
    };
    $scope.getInTouch = function () {
      console.log($scope.user); 
      

      console.log("Loan requested: €" + $scope.user.loan);
      console.log("Max Term Allowed (months): " + ($scope.user.maxTerm * 12 ));
      console.log("Monthly Repayment: " + $scope.user.monthlyPayment);
      console.log("Total Income: €" + $scope.user.totalIncome);
      console.log($scope.user.NDI);
      if($scope.user.monthlyPayment >= $scope.user.NDI){
          $scope.imagePath = 'images/sadface.gif';
      }else{
          $scope.imagePath = 'images/success.png';
      }
      $scope.myForm = !$scope.myForm;
      $scope.successApp = !$scope.successApp;
      

      // $scope.nextTab();
    };

    $scope.max = 2;
    $scope.min = 0;
    $scope.selectedTab = 0;
    $scope.nextTab = function() {
    var Tab = ($scope.selectedTab == $scope.max) ? 0 : $scope.selectedTab + 1;
    $scope.selectedTab = Tab;
    };
    $scope.parseIntBase10 = function(text){
      return parseInt(text,10);
    }

    $scope.prevTab = function() {
    var Tab = ($scope.selectedTab == $scope.min) ? 0 : $scope.selectedTab - 1;
    $scope.selectedTab = Tab;
    };

    $scope.customFullscreen = false;
    $scope.showAlert = function(ev, title, content) {
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    $mdDialog.show(
      $mdDialog.alert()
        .parent(angular.element(document.querySelector('#popupContainer')))
        .clickOutsideToClose(true)
        .title(title)
        .textContent(content)
        .ariaLabel('Alert Dialog Demo')
        .ok('Got it!')
        .targetEvent(ev)
    );};

    


  }).config(function($mdThemingProvider) {
    $mdThemingProvider.theme('dark-grey').backgroundPalette('grey').dark();
    $mdThemingProvider.theme('dark-orange').backgroundPalette('orange').dark();
    $mdThemingProvider.theme('dark-purple').backgroundPalette('deep-purple').dark();
    $mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
});
  chillModule.$inject = ['$scope'];
  chillModule.directive('format', ['$filter', function ($filter) {
    return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ctrl) {
            if (!ctrl) return;


            ctrl.$formatters.unshift(function (a) {
                return $filter(attrs.format)(ctrl.$modelValue)
            });


            ctrl.$parsers.unshift(function (viewValue) {
                var plainNumber = viewValue.replace(/[^\d|\-+|\.+]/g, '');
                elem.val($filter(attrs.format)(plainNumber));
                return plainNumber;
            });
        }
    };
}]);