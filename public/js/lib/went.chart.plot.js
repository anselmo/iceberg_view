if(typeof Went==='undefined'){
  Went = {};
}
if(typeof Went.Chart==='undefined'){
  Went.Chart={};
}


Went.Chart.Plot = function(_args){
  this.args = _args;
  this.title=_args.options.title;
  this.target = _args.options.target;
  this.width = null;
  this.height = null;
  this.max = _args.max || 5;
  this.data = _args.data || [];
  this.targetElement = document.getElementById(this.target);
  this.rph= null;
  this.plotElms = [];
  this.xSetElm = null;
  this.ySetElm = null;
  this.msg = null;
  this.tracks = [];
  this.position = [_args.options.position,_args.options.position] || [0,0];
  this.size = [_args.options.w || this.targetElement.offsetWidth, _args.options.h || this.targetElement.offsetHeight];
  this.offset = _args.options.offset || [0,0,0,0];
  this.slots = null;

  this.colors = null;
  this.init();
};

Went.Chart.Plot.prototype = {
  init: function(){
          this.rph = Raphael(this.target,this.size[0],this.size[1]);
          this.width = this.size[0]-(this.offset[0]+this.offset[2]);
          this.height = this.size[1]-(this.offset[1]+this.offset[3]);
          this.slots = [];
          this.build();
        },

  build: function(){
           this.addBoundingBox();
           this.addXAxis();
           for(var a=0; a<this.data.length; a++){
             this.addTrack(this.data[a]);
           }
         },

  remove: function(){
            this.rph.remove();
          },

  addBoundingBox: function(){
                    var bb=this.rph.rect(this.offset[0],this.offset[1],this.width, this.height);                
                    bb.attr({fill: this.args.options.style.background, stroke:"transparent"});
                  },

  addYAxis: function(){

            },

  addXAxis: function(){
              var st = this.rph.set(50,0);
              var categories = this.args.xAxis.categories;
              var catW = this.size[0]/categories.length;
              for(var a=0; a<categories.length; a++){
                var c= categories[a];
                var sp = catW*a;
                if (a!==0){
                  var path = "M " + sp + "," + 0 + " l " + 0 + "," + this.height;
                  var r= this.rph.path(path);
                  r.attr({stroke:this.args.xAxis.stroke});
                  st.push(r);
                }
                // add support for text offset
                var tp = [sp+7,14];
                var t= this.rph.text(tp[0],tp[1], c);
                t.attr({fill:this.args.xAxis.textColor, "font-size":14, "font-family":"ronnia-1", "text-anchor":"start" });
                st.push(t);
              }
            },

  addPlot: function(_data){
             var code = Went.Utils.generateCode(), points = [], path = null;
             var w = (this.size[0]/this.args.xAxis.categories.length)/4;
             var start = _data.start.split("/");
             var s = this.args.xAxis.categories.indexOf(Number(start[0]))*4|| 0;
             var x = w*(s+Number(start[1])), sp = x;
             for(var a=0;a<_data.values.length; a++){
               // 100 should be the maximum size - offset padding, or max and min limits
               var yp = (this.height*_data.values[a])/100;
               var y = this.height - yp;
               if (!path){ 
                 path = "M" + x + "," + y; 
               }else{
                 path += " L" + x + "," + y ;
               }  
               points.push([x,y]);
               if (a+1!==_data.values.length){x += w;}
             }
             path += " L" + x + "," + this.height + " L" + sp + "," + this.height + " z";  
             var p=this.rph.path(path);
             p.attr({stroke:_data.options.stroke || _data.options.fill, fill: _data.options.fill, opacity:0});
             var fillSet = this.fillArea(points,_data.options);
             fillSet.push(p);
             return fillSet; 
           },

  fillArea: function(points, options){
              var lineSet = [];
              var step = options.step || 4;
              for (var a=0; a<points.length; a++){
                var c=points[a] , n=points[a+1];
                if (n){
                  var xd = (n[0]-c[0]), yd = (n[1]-c[1]), h =  Math.sqrt(Math.pow(xd,2)+Math.pow(yd,2));
                  var sin = yd/h, cos = xd/h, dist = n[0]-c[0];
                  var p = 0;
                  while(p+step<dist){
                    var th = cos/(p+step);
                    var ty = sin/th;
                    var tx = c[0] + p + step;
                    var path = "M" + tx + "," + this.height;
                    path+= " l" + 0 +  ","  + -(this.height-(c[1]+ty)) ;
                    var z=this.rph.path(path);
                    z.attr({stroke:options.stroke || options.fill, opacity:0.5});
                    p += step;
                    lineSet.push(z);
                  }
                }
              }
              return lineSet;
            },

  removeTrackById: function(code){
                     var track = null;
                     var _tracks_ = [];
                     for(var a=0; a<this.tracks.length; a++){
                       if (this.tracks[a][1]==code){
                         track = this.tracks[a]; 
                       } else {
                         _tracks_.push(this.tracks[a]);
                       }
                     }
                     var yp = track[2][0].attrs.y;
                     this.slots.push(yp-20);
                     this.removeTrack(track);
                     this.tracks=_tracks_;

                   },

  removeTrack: function(track){
                this.removeMsg();
                if (track[0]==1){
                  var plots = track[2][3];
                  this.removePlots(plots);
                }
                for(a=0; a<3; a++){
                  track[2][a].remove();
                }
               },

  removePlots: function(plots){
                 var i=0;
                 while(i<plots.length){
                   plots[i].remove();
                   i++;
                 }
               },

  showMsg: function(text){
             this.msg = this.rph.text(this.width/2,340,text);
             this.msg.attr({fill: "#e3e3e3", "font-size":16, "font-family":"ronnia-1", "text-anchor":"middle" });
           },

  removeMsg : function(){
                if(this.msg){
                  // this.msg.node.parentNode.removeChild(this.msg.node);
                  this.msg.remove();
                  // this.msg=null;
                }
              },
  addTrack: function(_data){
              if( this.tracks.length+1>this.max){
                this.showMsg("Max Tracks Reached");
                return false;
              } else {
                this.removeMsg();
              }
              var code = Went.Utils.generateCode();
              var w = this.size[0]/(this.args.xAxis.categories.length*4);
              var start = _data.start.split("/"), end = _data.end.split("/");
              var is = this.args.xAxis.categories.indexOf(Number(start[0]))*4 || 0;
              var ie = this.args.xAxis.categories.indexOf(Number(end[0]))*4 || 0;
              var xp = (w*is)+(start[1]*w);
              var xw = ((w*ie)+(end[1]*w))-xp;
              var tl = this.tracks.length-1;
              var yp;
              if(this.slots.length>0){
                yp = this.slots.pop()+20;
              } else {
                yp = (this.height-80);
                yp = yp-(tl*20);
              }
              // yp = (tl%2===0)? yp+(tl*20) : yp-(tl*20);
              var p = this.rph.rect(xp, yp, xw, _data.height || 15, 1);
              p.attr({"class":"track", fill: _data.options.fill, stroke: _data.options.stroke, "stroke-width":0.5, opacity:0.5});
              p.node.setAttribute("class","track");

              var l = this.rph.path("M" + xp + ","+ (yp+15) + " l0," + 15 );
              l.attr({stroke: _data.options.stroke, "stroke-width":0.5});
              var t = this.rph.text(xp+4,yp+8,_data.title.toUpperCase());
              t.attr({fill:_data.options.textColor || "#000", "font-size":12, "font-family":"ronnia-1", "text-anchor":"start" });
              var trackSet = [0,code,[p,l,t]];
              if (_data.data){
                if(!_data.data.options){_data.data.options = {};}
                _data.data.options.fill =  _data.options.fill;
                
                this.setTrackBehaviour(p,_data, trackSet);
              }
              this.tracks.push(trackSet);
              return code;
            },


  setTrackBehaviour: function(el, _d, trackSet){
                       var _this_ = this;
                       el.click(function(e){
                         _d.data.start=_d.start;
                         if (_d.data){
                           if(trackSet[0]===0){
                             trackSet[0]=1;
                             var plotSet=_this_.addPlot(_d.data);
                             trackSet[2][0].attr({opacity:1});
                             trackSet[2].push(plotSet);
                           } else {
                             trackSet[0]=0;
                             var plots = trackSet[2][3];
                             _this_.removePlots(plots);
                             trackSet[2][0].attr({opacity:0.5});
                             trackSet[2].pop();
                           }
                         }
                       });
                     }

};

