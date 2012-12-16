if(typeof Went==='undefined'){
  Went = {};
}
if(typeof Went.Chart==='undefined'){
  Went.Chart={};
}

Went.Chart.Normalize = {
  medians:  {
    ttfb: 500,
    startRender: 2765,
    onLoad: 9523,
    reqTotal: 82,
    bytesTotal: 835,
    numDomains: 13,
    PageSpeed: 84,
    reqImg: 49,
    reqJS: 13,
    reqCss: 3
  },

  maxData: function(k,coef){
    return this.medians[k] * coef;
  },

  normalPoint: function( value, max, dim){
    return (value*dim)/max;
  },

  normal: function(kind, value, dim, coef){
    coef = coef || 1;
    return this.normalPoint(value, this.maxData(kind, coef), dim);
  }
};

Went.Chart.Radar = function(_title, _data, _args){

  this.args = _args;
  this.title=_title;
  this.target = _args.target;
  
  this.data = _data;
  this.items = [];
  this.values = [];
  this.paths = [];
  this.conf = {};
  if(type.of(this.data[this.data.length-1])=="object"){ 
    this.conf=this.data.pop();
  }
  this.position = [_args.pos[0],_args.pos[1]+15] || [140,180];
  this.r = _args.r;
  this.size =_args.size||[this.r[0]*2, this.r[1]*2];
  this.fontSize = _args.fontSize || 72;
  this.strokeWidth = _args.strokeWidth || 12;

  this.rph= null;
  this.titleText = null;
  this.tipValue = null;
  this.tipText = null;
  this.parts = [];
  this.defaultAttrs= {stroke: "#ccc", opacity: 0.5,"stroke-width":12};
  this.color= _args.color || "#da7979";
  this.activeColor = _args.activeColor ||"#ed7498";
  this.colors = null;
  this.selectIndex = _args.selectIndex || 0;

  this.data = this.normalize(this.data);
  this.active = null;
  this.init();
};

Went.Chart.Radar.prototype = {
  init: function(){
          this.setPoints();
          this.setPaths();
          this.rph = Raphael(this.target,this.size[0],this.size[1]+25);
          this.colors = new Went.Color(this.color).mono(this.data.length,3);
          this.draw();
          this.printTitle(this.title);

          if (this.conf.marks){
            this.drawMarkers();
          }
          if (this.args.grid){
            this.drawGrid();
            this.drawMedian();
          }
        },

  normalize : function(d){
        var _a, _v;
        var normalized = [];
        for(_a=0; _a<d.length; _a++){
          _v = Went.Chart.Normalize.normal(d[_a][0],d[_a][1], this.size[0]/2, this.size[0]);
          d[_a][1] = _v;
          normalized.push(d[_a]);
        }
        return normalized;
  },

  remove: function(){
            this.rph.remove();
          },

  setPoints: function(){
               var angle = 270;
               var increment = 360/this.data.length;
               var pos = this.position;
               var a;
               for(a=0; a<this.data.length; a++){
                 var d = this.data[a];
                 var r = this.r * d[1];
                 var x = (r * Math.cos((angle*Math.PI)/180));
                 var y = (r * Math.sin((angle*Math.PI)/180));
                 var xx = (this.r * Math.cos((angle*Math.PI)/180));
                 var yy = (this.r * Math.sin((angle*Math.PI)/180));
                 var p = [x,y,xx,yy];
                 this.values.push(p);
                 angle += increment;
               }
             },

  setPaths : function(){
               var len=this.values.length;
               for(var b=0; b<len; b++){
                 var p=[];
                 p.push("M" + this.position[0] + "," +this.position[1]);
                 p.push("l" + this.values[b][0] + "," + this.values[b][1]);
                 var next = (b+1==len)? 0 : b+1;
                 p.push("L" + (this.position[0] + this.values[next][0]) + "," + (this.position[1]+this.values[next][1]));
                 this.paths.push(p.join(" "));
               }
             },


  drawGrid: function(){
              var attrs = {stroke: "#ccc", opacity: 0.5,"stroke-width":1};
              var len = this.data.length;
              for(var a=0; a<len; a++){
                var t = this.rph.circle(this.position[0],this.position[1],this.r*this.data[a][1]);
                t.attr(attrs);
              }
              len= this.values.length;
              for(var i=0; i<len; i++){
                var p = [];
                p.push("M " + this.position[0] +  "," + this.position[1]);
                p.push("l "+this.values[i][2]+ ","+this.values[i][3]);
                var l = this.rph.path(p.join(" ")).attr({"stroke":"#e3e3e3", "stroke-width":1});
              }
            },

  
  drawMedian: function(){
              var attrs, t;
              attrs = {stroke: "red", opacity: 0.2,"stroke-width":2, "stroke-dasharray":["--"]};
              t = this.rph.circle(this.position[0],this.position[1],this.r/2);
              t.attr(attrs);
            },

  drawMarkers: function(){
                 var attrs = {"stroke-dasharray":["-"], stroke: "green", opacity:0.6,"stroke-width":2};
                 var len = this.conf.marks.length;
                 for(var a=0; a<len; a++){
                   attrs.title = this.conf.marks[a][0];
                   attrs.stroke = this.conf.marks[a][2];
                   var t = this.rph.circle(this.position[0],this.position[1],(this.r/100)*this.conf.marks[a][1]);
                   t.attr(attrs);
                   t.toFront();
                 }
               },

  draw : function (){
           for(var a=0; a<this.paths.length; a++){
             var clr= new Went.Color(this.colors[a]).mono(2,10)[1];
             var l = this.rph.path(this.paths[a]).attr({"fill-opacity":0.1, "stroke-opacity":0.8,  opacity:0.5, fill:"0-"+this.colors[a]+"-"+ clr, stroke:clr, "stroke-width":1});
             this.parts.push(l);
             this.setBehaviour(l,a);
           }
         },

  select : function(i){
                     this.reset();
                     if (this.active===i){
                       this.active = null;
                       this.clearTipPrint();
                     } else { 
                       this.active = i;
                       this.parts[i].attr({"fill":this.activeColor});
                       this.printTip(this.data[i]);
                     }
           },

  setBehaviour:function(el,i){
                 var _this_ = this;
                 el.click(function (e) {
                   _this_.select(i);
                 });
               },

  reset : function(){

                     for(var a=0; a<this.parts.length; a++){
                       var p = this.parts[a];
                          p.attr({"fill": this.colors[a]});
                     }

          },

  printTip: function(d){
                this.clearTipPrint(); 
                var x = (this.size[0]/2);
                this.tipText = this.rph.text(x,15, d[0] + " " + d[1]).attr({fill:this.activeColor,"text-anchor":"middle","font-family":"ff-enzo-web-1", "font-size":20, "font-weight":600});
                // this.tipValue = this.rph.text(x,45, d[1]+"%").attr({fill:"gray", "text-anchor":"middle","font-family":"ff-enzo-web-1", "font-size":18, "font-weight":300});
              },

  clearTipPrint: function(){
                if (this.tipValue){this.tipValue.remove();}
                if (this.tipText){this.tipText.remove();}
              },
  clearPrint: function(){
                if (this.titleText){this.titleText.remove();}
              },
  printTitle: function(_text){
                this.clearPrint();
                this.titleText = this.rph.text(this.size[0]/2,this.size[1]+15, _text).attr({fill:"gray", "font-family":"ff-enzo-web-1, ronnia-1", "font-size":14, "font-weight":700});
              }

};

