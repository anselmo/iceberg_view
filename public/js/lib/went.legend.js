if(typeof Went==='undefined'){
  Went = {};
}

Went.Legend = function(_target, _data, _args){
  this.args = _args;
  this.target = _target;
  this.targetElement = document.getElementById(this.target);
  this.container=null;
  this.data=_data;
  this.plot = _args.plot;
  this.init();
};

Went.Legend.prototype = {
  init: function(){
          this.build();
        },

  build: function(){
           this.container = document.createElement("div");
           this.container.setAttribute("class","legend"); 
           this.targetElement.appendChild(this.container);
           var ul = document.createElement("ul");
           this.container.appendChild(ul);
           for (var a=0; a<this.data.length; a++){
             this.addSet(this.data[a], ul);
           }
         },
  addSet: function(data, target){
            var li = document.createElement("li");
            var h3 = document.createElement("h3");
            var h4 = document.createElement("h4");
           h3.innerText = data[0];
       if(h3.textContent!==null){
                h3.textContent = data[0];
             }else{
                h3.innerText = data[0];
             } 
            li.appendChild(h3);
            li.appendChild(h4);
            target.appendChild(li);
            var colors = new Went.Color(data[2].color).analogic(data[1].length,10);
            for (var b=0; b<data[1].length; b++){
              var d = data[1][b];
              d.options.fill = colors[b];
              d.options.stroke = colors[b];
              this.addItem(data[1][b],h4, b+1==data[1].length);
            }
          },

  addItem: function(data, target, isLast){
             var span = document.createElement("span");   
             var text = (isLast)? data.title : data.title + ", ";
     if(span.textContent!==null){
               span.textContent = text;
             }else{
               span.innerText = text;
             }            
             target.appendChild(span);
             this.setBehaviour(span, data);
             if(data.options.active){
               this.show(span,data);
             }
           },

  show:function(el,data){
         var _this_ = this;
         var id=_this_.plot.addTrack(data);
         if(id){
           data.track_id=id;
           el.style.color=data.options.fill;
         }
       },

  hide:function(el,data){
         var _this_ = this;
         _this_.plot.removeTrackById(data.track_id);
         data.track_id = null;
         el.style.color="";
       },

  setBehaviour: function(el, data){
                  var _this_= this;
                  el.onclick= function(){
                    if(!data.track_id){
                      _this_.show(el,data);
                    } else {
                      _this_.hide(el,data);
                    }  
                  };
                }

};


