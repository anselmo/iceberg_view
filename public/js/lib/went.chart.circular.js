if(typeof Went==='undefined'){
  Went = {};
}
if(typeof Went.Chart==='undefined'){
  Went.Chart={};
}


Went.Chart.Circular = function(_title, _data, _args){
  this.options = _args;
  this.title=_title;
  this.data = _data;
  this.target = _args.target;
  this.items = [];
  this.values = [];
  this.size = _args.size || [280,280];
  this.r = _args.r || 120;
  this.valueFontSize = _args.valueFontSize || 64;
  this.titleFontSize = _args.titleFontSize || 18;
  this.legendFontSize = _args.legendFontSize || 18;
  this.colors = null;
  this.color = _args.color || "#e1e1e1";
  this.strokeWidth = _args.strokeWidth || 12;
  this.activeColor = "#FF5E99";
  this.titlePos= _args.titlePos || [this.size[0]/2,10];
  this.valuePos= _args.valuePos || [this.size[0]/2,this.size[1]/2];
  this.legendPos= _args.legendPos || [this.size[0]/2,this.size[1]/2];
  this.titleAlign = _args.titleAlign || "middle";
  this.current = 0;
  this.delegate = _args.delegate; 

  this.rph= null;
  this.ctrl = null;
  this.titleText = null;
  this.valueText = null;
  this.legendText = null;
  this.defaultAttrs= {stroke: "#ccc", opacity: 0.5,"stroke-width":12};
  this.active = null;

  this.total = null;

  this.init();
};

Went.Chart.Circular.prototype = {
  init: function(){
          this.prepare();
          var currentSet = this.data[this.current];
          this.title = currentSet[0];
          this.setColorMode(currentSet);
          for(var a=0; a<currentSet[1].length; a++){
            var _ang = (360/100)*currentSet[1][a][2];
            var item = {name:currentSet[1][a][0], angle:_ang, value:currentSet[1][a][2], element:null};
            this.items.push(item);
            this.values.push(_ang);
          }
          this.rph = Raphael(this.target, this.size[0], this.size[1]);
          this.build();
        },

  prepare: function(value){
             var total;
             for(var h=0;h<this.data.length;h++){
               total=0;
               for(var a=0; a<this.data[h][1].length; a++){
                 var f = this.data[h][1][a];
                 total += Number(f[1]);
               }
               for(var v=0; v<this.data[h][1].length; v++){
                 var j = this.data[h][1][v];
                 j.push(((100 * j[1])/total).toFixed(1));
               }
             }
           },

  build : function (){
            var t = this.rph.circle(this.size[0]/2,this.size[1]/2,this.r);
            t.attr({stroke: "#ccc", opacity: 0.5,"stroke-width":this.strokeWidth});
            var arcs = this.pathsFor([this.size[0]/2,this.size[1]/2],this.values,this.r,3);
            for(var a=0; a<arcs.length; a++){
              var l = this.rph.path(arcs[a]).attr({"stroke":this.colors[a], "stroke-width":this.strokeWidth});
              this.items[a].element=l;
              this.setBehaviour(l,a);
            }
            this.printTitle();
            if (this.options.active){
              this.select(this.options.active);
            }
          },

  onSelect : function(_i){
               if (this.active == _i ){
                 item = this.items[this.active];
                 item.element.attr({stroke: this.colors[this.active]});
                 this.active = null;
                 this.clearPrint();
                 if(this.delegate && this.delegate.onClear){this.delegate.onClear(_i);}
               } else {
                 if (this.active!==null){
                   this.items[this.active].element.attr({stroke: this.colors[this.active]});
                 }
                 this.active = _i;
                 item = this.items[this.active];
                 item.element.attr({stroke: this.activeColor});
                 this.print(item.name.toUpperCase(),item.value + "%");
                 if(this.delegate && this.delegate.onSelect){this.delegate.onSelect(_i);}
               }
             },

  select : function(i){
             this.onSelect(i);
           },

  setBehaviour: function (el,_i){
                  var _this_=this;
                  var item;
                  el.click(function (e) {
                    _this_.onSelect(_i);
                  });
                  el.mouseover(function (e) {
                    this.attr({"stroke-width": _this_.strokeWidth + 2 });
                  });
                  el.mouseout(function (e) {
                    this.attr({"stroke-width": _this_.strokeWidth});
                  });
                },
  clearPrint: function(){
                if (this.valueText){this.valueText.remove();}
                if (this.legendText){this.legendText.remove();}
              },
  print: function(_text,_value){
           // this.clearPrint();
           // if (_value){ this.valueText = this.rph.text(this.valuePos[0], this.valuePos[1], _value).attr({fill:"gray","font-family":"ff-enzo-web-1", "font-size":this.valueFontSize, "font-weight":200});}
           // this.legendText = this.rph.text(this.legendPos[0], this.legendPos[1], _text).attr({fill:"gray", "font-family":"ronnia-1", "font-size":this.legendFontSize, "font-weight":700});
         },

  printTitle: function(){
                this.titleText = this.rph.text(this.titlePos[0], this.titlePos[1], this.title).attr({"text-anchor":this.titleAlign, fill:"gray", "font-family":"ronnia-1", "font-size":this.titleFontSize, "font-weight":700});
                // this.print(this.data[this.current][0].toUpperCase());
              },

  pathsFor: function(center, set, r, sep){
              var start=0;
              var result = [];

              for(var i=0; i<set.length; i++){
                var ang = set[i];
                var a = start+ang;
                var arc = this.arcPath(center[0], center[1], r, start, a);
                start=a;
                result.push(arc);
              }
              return result;
            },
  //based on raphael.js sample http://raphaeljs.com/polar-clock.html
  arcPath : function(cx,cy,r,start,end){
              start=(start*Math.PI)/180;
              end=(end*Math.PI)/180;
              var xp1 = (r * Math.cos(start));
              var yp1 = (r * Math.sin(start));
              var xp2 = (r * Math.cos(end));
              var yp2 = (r * Math.sin(end));
              arcDef = [];
              arcDef.push("M "  + Number(cx + xp1).toFixed(3)+"," + Number(cy + yp1).toFixed(3) );
              arcDef.push("A " + r + "," + r + " 0 " + ((end-start > Math.PI) ? 1 : 0) + ",1 " + Number(cx + xp2).toFixed(3) + "," + Number(cy + yp2).toFixed(3) );
              return arcDef.join(" ");
            },

  setColorMode : function(currentSet){

    switch(this.options.colorMode){
      case 'divide':
        this.colors = new Went.Color(this.color).divide(12);
        break;
      case 'analogic':
        this.colors = new Went.Color(this.color).analogic(currentSet[1].length,6);
        break;
      case 'mono':
        this.colors = new Went.Color(this.color).mono(currentSet[1].length,10);
        break;
      case 'darker':
        this.colors = new Went.Color(this.color).darker(currentSet[1].length,6);
        break;
      default:
        this.colors = new Went.Color(this.color).mono(currentSet[1].length,10);
        break;
    }
  
  },



};

