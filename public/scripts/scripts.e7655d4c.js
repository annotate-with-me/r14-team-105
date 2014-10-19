"use strict";angular.module("annotatewithmeApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch"]).config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/main.html",controller:"MainCtrl"}).when("/sessions/:sessionId",{templateUrl:"views/annotate.html",controller:"AnnotationCtrl"}).otherwise({redirectTo:"/"})}]),angular.module("annotatewithmeApp").controller("MainCtrl",["$scope","$location","$timeout",function(a,b,c){a.joinSession=function(a){a&&c(function(){b.path("/sessions/"+a)})}}]),angular.module("annotatewithmeApp").controller("AboutCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("annotatewithmeApp").controller("AnnotationCtrl",["$scope","AnnotationsService",function(a,b){a.annotations=[];var c=function(){a.$$phase||a.$apply()},d=function(b){angular.forEach(b,function(b){var c=b.value;a.annotations.push(c),anno.addAnnotation(c)}),c()};a.addHighlight=function(a){anno.highlightAnnotation(a)},a.removeHighlight=function(){anno.highlightAnnotation()},a.$on("annotorious-ready",function(){b.getAnnotations(d)}),anno.addHandler("onAnnotationCreated",function(d){b.createAnnotation(a.annotations.length,d),a.annotations.push(d),c()}),anno.addHandler("onAnnotationRemoved",function(d){b.deleteAnnotation(d.id),a.annotations.splice(a.annotations.indexOf(d),1),c()}),anno.addHandler("onAnnotationUpdated",function(d){a.annotations=a.annotations.filter(function(a){var c=$.extend(!0,c,a),e=$.extend(!0,e,d);return delete c.text,delete e.text,JSON.stringify(c)==JSON.stringify(e)?(b.updateAnnotation(a.id,d),!1):!0}),a.annotations.push(d),c()})}]),angular.module("annotatewithmeApp").directive("annotorious",["$rootScope","$timeout",function(a,b){return{restrict:"A",link:function(c,d){b(function(){anno.makeAnnotatable(d[0]),a.$broadcast("annotorious-ready")},1e3)}}}]),angular.module("annotatewithmeApp").service("AnnotationsService",["Utilities","Constants",function(a,b){var c=new Lawnchair({name:b.annotations_db}),d={persisted:!1};this.createAnnotation=function(b,e){var f=a.uuid();c.save({key:f,value:$.extend(!0,e,d,{id:f})})},this.getAnnotations=function(a){c.all(a)},this.updateAnnotation=function(a,b){c.remove(a),b.persisted=!1,c.save({key:a,value:b})},this.deleteAnnotation=function(a){c.remove(a)},this.deleteAll=function(){c.nuke()},this.getAllUnpersisted=function(a){c.where("record.value.persisted == false",a)}}]),angular.module("annotatewithmeApp").factory("LawnchairFactory",["$window","$log","$parse",function(a,b,c){return function(d,e){function f(a){try{return s(a)}catch(b){return null}}function g(a){return new Lawnchair({name:d},a)}function h(c,d){d=d.toString(),angular.isObject(c)&&c!==p[d]?(p[d]=p[d]||{},angular.extend(p[d],c)):p[d]=c;var e={key:d,value:t(p[d])};try{g(function(){this.save(e)})}catch(f){("QUOTA_EXCEEDED_ERR"===f.name||"NS_ERROR_DOM_QUOTA_REACHED"===f.name)&&a.localStorage.clear(),b.info("LocalStorage Exception ==> "+f.message)}}function i(a){return q.length=0,_.each(a,function(a){q.push(a)}),q}function j(a,b){a&&angular.isObject(a)&&p[b]&&p[b]!==a?angular.extend(p[b],a):p[b]=a}function k(a,b){return b&&(angular.isObject(b.value)&&angular.isObject(a)?angular.extend(a,u(b.value)):a=u(b.value),j(a,b.key)),a}function l(a){return g(function(){this.all(function(b){angular.forEach(b,function(a){j(a.value,a.key)}),a&&a(p)})}),p}function m(a){return i(l(function(b){i(b),a&&a(q)}))}function n(a){delete p[a],g(function(){this.remove(a)})}function o(a){if(p[a])return p[a];var b={};return s.assign(b,a),b}var p={},q=[],r=e&&e.isArray,s=c(e&&e.entryKey?e.entryKey:"id"),t=e&&e.transformSave?e.transformSave:angular.identity,u=e&&e.transformLoad?e.transformLoad:angular.identity,v={collection:p,save:function(a,b,c){if(a||(a=p,b=null),angular.isArray(a)?angular.forEach(a,function(a,b){h(a,f(a)||b)}):b||a&&f(a)?h(a,b||f(a)):angular.forEach(a,h),c){var d=angular.isArray(a)?_.chain(a).map(f).map(String).value():_.keys(a);_.chain(p).keys().difference(d).each(n),_.chain(p).filter(function(a){return!f(a)}).keys().each(n)}r&&i(p)},batch:function(a,b,c){var d=_.chain(a).map(function(a){return o(a)}).value();return b&&angular.isArray(b)?(b.length=0,_.each(d,function(a){b.push(a)})):b=d,g(function(){this.get(a,function(a){if(a)for(var d=a.length-1;d>=0;d--)b[d]=k(b[d],a[d]);c&&c(b)})}),b},get:function(a,b){var c=o(a);return g(function(){this.get(a,function(a){a&&(c=k(c,a)),b&&b(c)})}),c},all:r?m:l,remove:n,nuke:function(){g(function(){this.nuke()})},destroy:function(){for(var a in p)delete p[a];g(function(){this.nuke()})}};return v}}]),angular.module("annotatewithmeApp").service("Utilities",["$window",function(a){function b(){return Math.floor(65536*(1+Math.random())).toString(16).substring(1)}var c=!1,d=function(a){c=a,$rootScope.$broadcast("event:network-connectivity",a)};return c=a.navigator.onLine,a.addEventListener("online",function(){d(!0)},!1),a.addEventListener("offline",function(){d(!1)},!1),{uuid:function(){return b()+b()+"-"+b()+"-"+b()+"-"+b()+"-"+b()+b()+b()},isOnline:function(){return c}}}]),angular.module("annotatewithmeApp").constant("Constants",{base_url:"http://boiling-spire-5369.herokuapp.com/",annotations_db:"annotations"});