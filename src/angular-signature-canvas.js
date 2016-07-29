/**!
 * Angular JS Directive for the szimek's signature pad
 * @author Christian Ascone <ascone.christian@gmail.com>
 * @version 0.0.1
 *
 * https://github.com/christianascone/angular-signature-canvas
 * Copyright (c) 2016 ; Licensed MIT
 */

angular.module('angular-signature-canvas', []);

angular.module('angular-signature-canvas').controller("signaturePadController", function($scope, $http) {
  var ctrl = this;

  ctrl.clear = function() {
    ctrl.canvasSignature.clear();
  }

  ctrl.init = function() {
    var canvas = document.querySelector("canvas");
    ctrl.canvasSignature = new SignaturePad(canvas);
    $scope.canvas = canvas;

    // Check width of the parent node in order to init the pad
    // only when the area is ready
    $scope.$watch('canvas.parentNode.offsetWidth',
      function(newValue, oldValue) {
        if(newValue > 0 && newValue != oldValue){
          ctrl.init();
        }
      }, //listener 
      true //deep watch
    );

    function resizeCanvas() {
      var id = "signatureCanvas";
      var canvas = document.getElementById(id);

      // If canvas is not available yet, it stops
      if(!canvas){
        return;
      }

      var offsetWidth = canvas.offsetWidth;
      var offsetHeight = canvas.offsetHeight;

      var canvasParent = canvas.parentNode;
      // ATTENZIONE: 10 è il margin del signatureCanvas
      var width = canvasParent.offsetWidth - (10*2);
      canvas.width = width;

    }

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
  };

  ctrl.init();

  ctrl.notifyDone = function() {
    ctrl.init();
  }

})

.directive("signaturePad", function() {
  return {
    restrict: 'AE',
    required: 'ngModal',
    bindToController: {
      'canvasSignature': '=?',
    },
    controller: 'signaturePadController',
    controllerAs: 'signaturePadCtrl',
    template: '<div id="signature-pad" class="m-signature-pad">' +
      '<div class="m-signature-pad--body">' +
      '<canvas width="1316" height="300" id="signatureCanvas" style="margin: 10px"></canvas>' +
      '</div>' +
      '<div class="m-signature-pad--footer">' +
      '<md-button type="button" class="button clear" ng-click="signaturePadCtrl.clear()">Pulisci</md-button>' +
      '</div>' +
      '</div>',
  }
})