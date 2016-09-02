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
  var idContainer = "signature-pad";
  var idCanvas = "signatureCanvas";
  var margin = 10;
  ctrl.points = [];
  ctrl.canvasSignature = ctrl.canvasSignature || {};

  /**
   * Point object definition with velocityFrom() and distanceTo() functions.
   * Both the constructor and the prototype functions are a simple copy
   * of szimek original class
   * https://github.com/szimek/signature_pad
   */
  var Point = function(x, y, time) {
    this.x = x;
    this.y = y;
    this.time = time || new Date().getTime();
  };
  Point.prototype.velocityFrom = function(start) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time - start.time) : 1;
  };
  Point.prototype.distanceTo = function(start) {
    return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
  };

  /**
   * Clears the signature canvas and the points array
   * 
   * @return {void}
   */
  ctrl.clear = function() {
    ctrl.canvasSignature.clear();
    ctrl.points = [];
  }

  ctrl.addSignaturePoint = function(event) {
    var point = ctrl.createPoint(event, ctrl.canvasSignature._canvas);
    ctrl.points.push(point);
  }

  /**
   * Create a point using the given event (for the point coordinate)
   * and the canvas for bounding client rectangle
   * 
   * @param  {event}
   * @param  {canvas}
   * @return {Point}
   */
  ctrl.createPoint = function(event, canvas) {
    var rect = canvas.getBoundingClientRect();
    return new Point(
      event.clientX - rect.left,
      event.clientY - rect.top
    );
  }

  ctrl.init = function() {
    var container = document.getElementById(idContainer);
    var canvas = document.getElementById(idCanvas);
    canvas.style.margin = margin + "px";

    container.style.width = ctrl.width + "px";
    canvas.style.width = ctrl.width + "px";
    canvas.width = ctrl.width;
    container.style.height = ctrl.height + "px";
    canvas.style.height = ctrl.height + "px";
    canvas.height = ctrl.height;

    ctrl.canvasSignature = new SignaturePad(canvas, {
      // Callback function called every time the signature starts
      onBegin: function(event) {ctrl.addSignaturePoint(event)},
      // Callback function called every time the signature ends
      onEnd: function(event) {ctrl.addSignaturePoint(event)}
    });
    // Add listener for callback function to be called when the mouse moves (during signature)
    ctrl.canvasSignature._canvas.addEventListener("mousemove", function(event) {
      if (ctrl.canvasSignature._mouseButtonDown) {
        ctrl.addSignaturePoint(event);
      }
    });
    $scope.canvas = canvas;

    // Check width of the parent node in order to init the pad
    // only when the area is ready
    $scope.$watch('canvas.parentNode.offsetWidth',
      function(newValue, oldValue) {
        if (newValue > 0 && newValue != oldValue) {
          ctrl.init();
        }
      }, //listener 
      true //deep watch
    );

    function resizeCanvas() {
      var canvas = document.getElementById(idCanvas);

      // If canvas is not available yet, it stops
      if (!canvas) {
        return;
      }

      var offsetWidth = canvas.offsetWidth;
      var offsetHeight = canvas.offsetHeight;

      var canvasParent = canvas.parentNode;

      var width = canvasParent.offsetWidth - (margin * 2);
      canvas.width = width;
      canvas.style.width = width;

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
      'width': '@',
      'height': '@',
    },
    controller: 'signaturePadController',
    controllerAs: 'signaturePadCtrl',
    template: '<div id="signature-pad" class="m-signature-pad">' +
      '<div class="m-signature-pad--body">' +
      '<canvas id="signatureCanvas"></canvas>' +
      '</div>' +
      '<div class="m-signature-pad--footer">' +
      '<md-button type="button" class="button clear" ng-click="signaturePadCtrl.clear()">Pulisci</md-button>' +
      '</div>' +
      '</div>',
  }
})