if(typeof Went==='undefined'){
  Went = {};
}

Went.Icon = function(_target, _args){
  this.target = _target;
  this.args = _args;
  this.size = _args.size || [16,16];
  this.id=null;
  this.path = _args.path;
  this.icon=null;
  this.rph = null;
  this.init();
};

Went.Icon.prototype = {
  init: function(){
          this.id=Went.Utils.generateCode();
          this.target.setAttribute("id",this.id);
          this.rph = Raphael(this.target, this.size[0], this.size[1]);
          this.build();
        },

  build: function(){
           if(this.rph){this.rph.clear();}
           var path=Went.Path[this.path];
           this.icon = this.rph.path(path);
           this.icon.attr({fill: this.args.color || "#000", stroke: this.args.stroke || null});
           if(this.args.scale){
             this.icon.scale(this.args.scale[0],this.args.scale[1]);
           }
           if(this.args.translate){
             this.icon.translate(this.args.translate[0],this.args.translate[1]);
           }
         },

  update: function(attr){
            if(attr.path){this.path = attr.path;}
            this.build();
          }
};



