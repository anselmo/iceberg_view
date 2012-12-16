if(typeof Went==='undefined'){
  Went = {};
}  
if(typeof Went.Chart==='undefined'){
  Went.Chart={};
}  

Went.Chart.Controller = function(_data,_args){
  this.args = _args;
  this.data = _data;
  this.target = null;
  this.size = _args.size;
  this.element = null;
  this.handler = null;
  this.handlers = [];
  this.className = (_args.className) ? "ctrl " + _args.className : "ctrl";
  this.chart = null;
  this.current = 0;
  this.init();
};

Went.Chart.Controller.prototype = {
  init: function (){
    this.build();
    // this.addHandler();
    this.addChart(this.data[this.current]);
    // this.setHandlersState();
  },

  setHandlersState: function(){
    for(var a=0; a<this.handlers.length; a++){
      var h = this.handlers[a]; 
      if (a==this.current){
        h.attr({"fill":"#FF5E99", stroke:"#FF5E99"});
      } else{
        h.attr({"fill":"#ccc", stroke: "#ccc"});
      }
    }
  },

  build : function (){
    this.target = document.getElementById(this.args.target);
    this.element = document.createElement("div");
    this.element.className = "ph" ;
    this.element.setAttribute("id",Went.Utils.generateCode()) ;
    this.target.appendChild(this.element);
    // var p = Raphael(this.target, 200, 100);
    this.handler = document.createElement("div");
    this.handler.className = "ctrl" ;
    this.handler.setAttribute("id",Went.Utils.generateCode()) ;
    this.target.appendChild(this.handler);
    // var c = p.circle(50, 50, 40);
  },

  addChart: function(data){
    if(data[1]=="radar"){
     this.chart = new Went.Chart.Radar(data[0],data[2],{size:this.size, pos:[this.size[0]/2,this.size[1]/2], color: data[3].color || "#d0500b", activeColor:data[3].activeColor, r: this.size[1]/2,target:this.element.getAttribute("id"), grid:true, "grid-color":"#e3e3e3"});
    }
  },

  addHandler: function(){
    var s = [this.size[0], 10];
    var ctrl = Raphael(this.handler.getAttribute("id"), s[0],s[1]);
    var i=0;
    var xpos = (s[0]/2) - ((this.data.length*12)/2);
    while(i<this.data.length){
      var h=ctrl.circle(xpos,5,4).attr({fill:"#fff", "fill-opacity":1, stroke:"#bbb"});
      this.handlers.push(h);
      this.setHandlerBehaviour(h,i);
      xpos += 12; 
      i++;
    }
  },

  removeChart: function(data){
    if (this.chart){this.chart.remove();}
  },

  setHandlerBehaviour: function(hdlr,i){
    var _this_ = this;
    hdlr.click(function (e) {
      if (_this_.current != i){
        _this_.current = i;
        _this_.removeChart();
        _this_.addChart(_this_.data[_this_.current]);
        _this_.setHandlersState();
      } 
    });

  }




};


