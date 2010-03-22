angularDirective("ng-init", function(expression){
  return function(){
    this.$eval(expression);
  };
});

angularDirective("ng-eval", function(expression){
  return function(){
    this.$addEval(expression);
  };
});

angular.directive("ng-bind", function(expression){
  return function(element) {
    this.$watch(expression, function(value){
      element.text(value);
    });
  };
});

angular.directive("ng-bind-attr", function(expression){
  return function(element){
    this.$watch(expression, bind(element, element.attr));
  };
});

angular.directive("ng-non-bindable", function(){
  this.descend(false);
});

angular.directive("ng-repeat", function(expression, element){
  var reference = this.reference("ng-repeat: " + expression),
      r = element.removeAttr('ng-repeat'),
      template = this.compile(element),
      path = expression.split(' in '),
      lhs = path[0],
      rhs = path[1];
  var parent = element.parent();
  element.replaceWith(reference);
  return function(){
    var children = [],
        currentScope = this;
    this.$addEval(rhs, function(items){
      var index = 0, childCount = children.length, childScope, lastElement = reference;
      foreach(items, function(value, key){
        if (index < childCount) {
          // reuse existing child
          childScope = children[index];
        } else {
          // grow children
          childScope = template(element.clone(), currentScope);
          childScope.init();
          childScope.scope.set('$index', index);
          childScope.element.attr('ng-index', index);
          lastElement.after(childScope.element);
          children.push(childScope);
        }
        childScope.scope.set(lhs, value);
        childScope.scope.updateView();
        lastElement = childScope.element;
        index ++;
      });
      // shrink children
      while(children.length > index) {
        children.pop().element.remove();
      }
    });
  };
}, {exclusive: true});


/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////
/////////////////////////////////////////




//Styling
//
//ng-class
//ng-class-odd, ng-class-even
//ng-style
//ng-show, ng-hide


angular.directive("action", function(expression, element){
  return function(){
    var self = this;
    jQuery(element).click(function(){
      self.$eval(expression);
    });
  };
});

//ng-watch
// <div ng-watch="$anchor.book: book=Book.get();"/>
angular.directive("watch", function(expression, element){
  var watches = {
    'lhs':'rhs'
  }; // parse
  return function(){
    this.$watch(watches);
  };
});

//widget related
//ng-validate, ng-required, ng-formatter
//ng-error