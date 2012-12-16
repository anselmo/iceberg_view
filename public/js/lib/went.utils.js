var ready = ( function () {
  function ready( f ) {
    if( ready.done ){return f();}

    if( ready.timer ) {
      ready.ready.push(f);
    } else {
      window.addEventListener('load',isDOMReady, true );

      ready.ready = [ f ];
      ready.timer = setInterval(isDOMReady, 13);
    }
  }

  function isDOMReady() {
    if( ready.done ){return false;}

    if( document && document.getElementsByTagName && document.getElementById && document.body ) {
      clearInterval( ready.timer );
      ready.timer = null;
      for( var i = 0; i < ready.ready.length; i++ ) {
        ready.ready[i]();
      }
      ready.ready = null;
      ready.done = true;
    }
  }

  return ready;
})();


if(typeof Went==='undefined'){
  Went = {};
}  
Went.Utils = {
  generateCode: function(){
    var result, i, j;
    result = '';
    for (j = 0; j < 6; j++) {
      i = Math.floor(Math.random() * 16).toString(16);
      result = result + i;
    }
    return result;       
  }
};

// paths for svg icos
Went.Path = {
  open:"M8,0C3.582,0,0,3.582,0,8c0,4.418,3.582,8,8,8s8-3.582,8-8C16,3.582,12.418,0,8,0z M12.269,9.281H9.281v2.988H6.719V9.281H3.731V6.719h2.988V3.73h2.562v2.989h2.988V9.281z",
  close:"M8,0C3.582,0,0,3.582,0,8c0,4.418,3.582,8,8,8c4.418,0,8-3.582,8-8C16,3.582,12.418,0,8,0z M12.27,9.281H3.731V6.719h8.539V9.281z",
  pic: "M2.5,4.833v22.334h27V4.833H2.5zM25.25,25.25H6.75V6.75h18.5V25.25zM11.25,14c1.426,0,2.583-1.157,2.583-2.583c0-1.427-1.157-2.583-2.583-2.583c-1.427,0-2.583,1.157-2.583,2.583C8.667,12.843,9.823,14,11.25,14zM24.251,16.25l-4.917-4.917l-6.917,6.917L10.5,16.333l-2.752,2.752v5.165h16.503V16.25z",
  circle: "M8,0C3.582,0,0,3.582,0,8c0,4.418,3.582,8,8,8c4.418,0,8-3.582,8-8C16,3.582,12.418,0,8,0z",
  arrow_right:"M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z",
  arrow_left: "M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z",
  remove: "M24.778,21.419 19.276,15.917 24.777,10.415 21.949,7.585 16.447,13.087 10.945,7.585 8.117,10.415 13.618,15.917 8.116,21.419 10.946,24.248 16.447,18.746 21.948,24.248z"
};

// A better type of => http://snipplr.com/view/1996/typeof--a-more-specific-typeof/
var is={
  Null:function(a){
    return a===null;
  },
  Undefined:function(a){
    return a===undefined;
  },
  nt:function(a){
    return(a===null||a===undefined);
  },
  Function:function(a){
    return(typeof(a)==='function')?a.constructor.toString().match(/Function/)!==null:false;
  },
  String:function(a){
    return(typeof(a)==='string')?true:(typeof(a)==='object')?a.constructor.toString().match(/string/i)!==null:false;
  },
  Array:function(a){
    return(typeof(a)==='object')?a.constructor.toString().match(/array/i)!==null||a.length!==undefined:false;
  },
  Boolean:function(a){
    return(typeof(a)==='boolean')?true:(typeof(a)==='object')?a.constructor.toString().match(/boolean/i)!==null:false;
  },
  Date:function(a){
    return(typeof(a)==='date')?true:(typeof(a)==='object')?a.constructor.toString().match(/date/i)!==null:false;
  },
  HTML:function(a){
    return(typeof(a)==='object')?a.constructor.toString().match(/html/i)!==null:false;
  },
  Number:function(a){
    return(typeof(a)==='number')?true:(typeof(a)==='object')?a.constructor.toString().match(/Number/)!==null:false;
  },
  Object:function(a){
    return(typeof(a)==='object')?a.constructor.toString().match(/object/i)!==null:false;
  },
  RegExp:function(a){
    return(typeof(a)==='function')?a.constructor.toString().match(/regexp/i)!==null:false;
  }
};

var type={
  of:function(a){
    for(var i in is){
      if(is[i](a)){
        return i.toLowerCase();
      }
    }
  }
};

// from http://snippets.dzone.com/posts/show/2437
[].indexOf || (Array.prototype.indexOf = function(v,n){
  n = (n==null)?0:n; var m = this.length;
  for(var i = n; i < m; i++)
  if(this[i] == v)
  return i;
return -1;
});

//Based on Treesaver Dom Object
Went.Dom = {
  getElementsByClassName : function(className, root) {
    if (!root) {
      root = document;
    }
    var result = [];
    var allElements = root.getElementsByTagName('*'),
        classPattern = new RegExp('(^|\\s)' + className + '(\\s|$)');
    for(var a=0; a<allElements.length; a++){
      var child = allElements[a];
      if (classPattern.test(child.className)) {
        result.push(child);
      }
    }
    return result;
  },

  hasClassName : function(el,name){
    var names=el.className.split(" ");
    for(var a=0; a<names.length; a++){
      if (names[a]==name){return true;}
    }
  },

  addClass: function(el,name){
    this.updateClasses(el,name,true);
  },
  removeClass: function(el,name){
    this.updateClasses(el,name,false);
  },
  updateClasses: function(el,name,mode){
    console.log(el)
      var _classes=el.className.split(" ");
    var _new_classes=[];  
    for(var l=0; l<_classes.length; l++){
      if(_classes[l]!=name){
        _new_classes.push(_classes[l]);
      }
    }
    if(mode){
      _new_classes.push(name);
    }
    el.className = _new_classes.join(" ");
  },

  next: function(elem) {
    do {
      elem = elem.nextSibling;
    } while (elem && elem.nodeType != 1);
    return elem;                
  },


  getChildIndex : function(element){
    var parent = element.parentNode;
    var children = [];
    for (var a = 0; a < parent.childNodes.length; a++){
      if (parent.childNodes[a].nodeType!==3){
        children.push(parent.childNodes[a]);
      }
    }
    for (var i = 0; i < children.length; i++){
      if (children[i]===element){
        return i;
      }
    }
  }

};



