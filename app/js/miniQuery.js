/*!
 * minQuery
 */

 function replaceClasses(classList, classToRemove){
  var newClassesString = '';
  for(i=0; i<classList.length; i++){
    if(classList[i] !== classToRemove){
      newClassesString += classList[i] + ' ';
    }
  }
  return newClassesString;
}

function getSelectorType(selector){
  var type;
  if (selector[0] == '#') {
    type = 'id';
  } else if (selector[0] == '.') {
    type = 'class';
  } else {
    type = 'tag';
  }
  return type;
}

 // create SweetSelector module / namespace to work in
 // create a select() method
 // --determine first character of select() arg
 //  if # search by ID, if . search by CLASS, else search by TAG-NAME

 var SweetSelector = (function () {
  var selection_result;
  return {
    select: function(selector) {
      var selectorType = getSelectorType(selector);
      if (selectorType == 'id') {
        selection_result = document.getElementById(selector.slice(1, selector.length));
      } else if (selectorType == 'class') {
        selection_result = document.getElementsByClassName(selector.slice(1, selector.length));
      } else {
        selection_result = document.getElementsByTagName(selector);
      }
      return selection_result;
    }
  }
})();


// create DOM module to work in
// create 4 methods
  // hide() : set css display to 'none'
  // show(): set css display to 'initial'
  // addClass() : Add a class to class-string
  // removeClass() : Remove class from class-string

  var DOM = (function(){
    var dom_result, selectorType, domElement;


    var hide = function(selector) {
      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);
      if (selectorType == 'id'){
        domElement.style.display = 'none';
      }else{
        for(i = 0; i < domElement.length; i++){
          domElement[i].style.display = 'none';
        }
      }
    }

    var show = function(selector) {
      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);
      if (selectorType == 'id'){
        domElement.style.display = 'initial';
      }else{
        for(i = 0; i < domElement.length; i++){
          domElement[i].style.display = 'initial';
        }
      }
    }

    var addClass = function(selector, className){
      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);
      if (selectorType == 'id'){
        domElement.className += " " + className;
      }else{
        for(i = 0; i < domElement.length; i++){
          domElement[i].className += " " + className;
        }
      }
    }

    var removeClass = function(selector, className){
      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);
      var classList;

      if (selectorType == 'id'){
        classList = domElement.className.split(' ');
        domElement.className = replaceClasses(classList, className);
      }else{
        for(i = 0; i < domElement.length; i++){
          classList = domElement[i].className.split(' ');
          domElement[i].className = replaceClasses(classList, className);
        }
      }
    }

    return {
      hide: hide,
      show: show,
      addClass: addClass,
      removeClass: removeClass
    }

  })();

  var EventDispatcher = (function () {
    var selectorType, domElement, event;

    var on = function(selector, eventName, behavior) {
      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);

      if (selectorType == 'id') {
        domElement.addEventListener(eventName, behavior);

      }else {
        for(i = 0; i < domElement.length; i++) {
          domElement[i].addEventListener(eventName, behavior);
        }
      }
    }

    var trigger = function(selector, eventName) {
      event = new Event(eventName);

      selectorType = getSelectorType(selector);
      domElement = SweetSelector.select(selector);

      if (selectorType == 'id') {
        domElement.dispatchEvent(event);

      }else {
        for(i = 0; i < domElement.length; i++) {
          domElement[i].dispatchEvent(event);
        }
      }
    }

    return {
      on: on,
      trigger: trigger
    }
  })();

  var AjaxWrapper = (function() {
    var xmlRequest = new XMLHttpRequest();

    var request = function(routeObject) {
      xmlRequest.open(routeObject.type, routeObject.url);
      xmlRequest.send();
      return this;
    }

    var then = function(responseFunction){
      xmlRequest.addEventListener('load', responseFunction);
      return this;
    }

    var otherCatch = function(errorFunction){
      xmlRequest.addEventListener('error', errorFunction);
      return this;
    }

    return {
      request: request,
      then: then,
      catch: otherCatch
    }
  })();

  var miniQuery = function(selector) {
    var domElement = SweetSelector.select(selector);
    var elementLength = domElement.length;

    domElement.hide = function () {
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          domElement[i].style.display = 'none';
        }
      } else {
        domElement.style.display = 'none';
      }
    }

    domElement.show = function () {
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          domElement[i].style.display = 'initial';
        }
      } else {
        domElement.style.display = 'initial';
      }
    }

    domElement.addClass = function (newClass) {
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          domElement[i].className += " " + newClass;
        }
      } else {
        domElement.className += " " + newClass;
      }
    }

    domElement.removeClass = function (oldClass) {
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          classList = domElement[i].className.split(' ');
          domElement[i].className = replaceClasses(classList, oldClass);
        }
      } else {
        classList = domElement.className.split(' ');
        domElement.className = replaceClasses(classList, oldClass);
      }
    }

    domElement.on = function (eventName, behavior){
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          domElement[i].addEventListener(eventName, behavior);
        }
      } else {
        domElement.addEventListener(eventName, behavior);
      }
    }

    domElement.trigger = function (eventName, behavior){
      var event = new Event(eventName);
      if (!!elementLength) {
        for (i = 0; i < elementLength; i++) {
          domElement[i].dispatchEvent(event);
        }
      } else {
        domElement.dispatchEvent(event);
      }
    }

    return domElement;

  };

  miniQuery.ajax = function (options){
    var xmlRequest = new XMLHttpRequest();
    return AjaxWrapper.request(options).then(options.success).catch(options.fail);
  }

  miniQuery.ready = function (callback){
    document.addEventListener('DOMContentLoaded', callback.call());
  }

  var $ = miniQuery;
