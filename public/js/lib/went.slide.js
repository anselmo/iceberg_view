if(typeof Went==='undefined'){
  Went = {};
}

Went.Slide = function(_node,_args){
  this.args = _args;
  this.node = _node;
  this.nodes=null;
  this.currentNode=null;
  this.data = _args.data;
  this.size = _args.size || [106,106];
  this.element = null;
  this.img = null;
  this.id = null;
  this.current = null;
  this.target = document.body;
  this.init();
};

Went.Slide.prototype = {
  init: function(){
           this.prepare();
           this.id=Went.Utils.generateCode();
           this.build();
           this.current = Went.Dom.getChildIndex(this.node);
           this.add(this.node);
        },

  build: function(){
           var _this_=this;          
           this.element = document.createElement("div");
           this.element.className = "slide";
           this.element.setAttribute("id",this.id);
           this.target.appendChild(this.element);

           var handlers = document.createElement("div");
           handlers.setAttribute("class","handlers");
           this.element.appendChild(handlers);

           var rightHandler = document.createElement("div");
           rightHandler.className = "rgt";  

           var leftHandler = document.createElement("div");
           leftHandler.className = "lft";  

           var closeHandler = document.createElement("div");
           closeHandler.className = "cls";  

           handlers.appendChild(rightHandler);
           handlers.appendChild(leftHandler);
           handlers.appendChild(closeHandler);

           var rgtCtrl = new Went.Icon(rightHandler, {path:"arrow_right",size:[36,48], translate:[0,5],scale:[2,2],color: "#e1e1e1", stroke:"#a1a1a1"});
           var lftCtrl = new Went.Icon(leftHandler, {path:"arrow_left",size:[36,48], translate:[0,5],scale:[2,2],color: "#e1e1e1", stroke:"#a1a1a1"});
           var clsCtrl = new Went.Icon(closeHandler, {path:"remove",size:[36,36],scale:[1,1], stroke:"#e1e1e1", color: "#a1a1a1"});

           leftHandler.onclick=function(e){
             if((_this_.current-1)>=0){
               _this_.current-=1;
               _this_.add(_this_.nodes[_this_.current]);
             }
           };

           rightHandler.onclick=function(e){
             if((_this_.current+1)<=_this_.nodes.length){
               _this_.current+=1;
               _this_.add(_this_.nodes[_this_.current]);
             }
           };
           
           closeHandler.onclick=function(e){
             _this_.close();
           };
         },

  add: function(_node){
           if(!this.img){
             this.img = document.createElement("img");
             this.element.appendChild(this.img);
           }
           var src = _node.getAttribute("href");
           this.img.setAttribute("src", src);
           _node.className +=" visited";
         },

  prepare: function(){
              var parent = this.node.parentNode;
              this.nodes = [];
              for (var a = 0; a < parent.childNodes.length; a++){
                if (parent.childNodes[a].nodeType!==3){
                  this.nodes.push(parent.childNodes[a]);
                }
              }
              this.currentNode = Went.Dom.getChildIndex(this.node);
              console.log(this.nodes);
           },

  close: function(){
           this.target.removeChild(this.element);
         },

  next: function(){
         if((this.current+1)<this.targets.length){
           this.current ++;
           this.img.setattribute("src", this.data[this.current]);
         }
        },

  prev: function(){
          if((this.current - 1) >=0){
           this.current --;
           this.img.setattribute("src", this.data[this.current]);
          }
        }

};




