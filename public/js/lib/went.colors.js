if(typeof Went==='undefined'){
  Went = {};
}

//My Color SwissArmy knifes, based on #rgbcolorlite
Went.Color = function(_c) {
  this.color_string = _c;
  this.r = null;
  this.g = null;
  this.b = null;
  this.ok = false;      
  this.color_defs = [
  {
    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
      example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
      process: function (bits){
        return [
          parseInt(bits[1]),
        parseInt(bits[2]),
        parseInt(bits[3])
          ];
      }
  },
  {
    re: /^(\w{2})(\w{2})(\w{2})$/,
    example: ['#00ff00', '336699'],
    process: function (bits){
      return [
        parseInt(bits[1], 16),
      parseInt(bits[2], 16),
      parseInt(bits[3], 16)
        ];
    }
  },
  {
    re: /^(\w{1})(\w{1})(\w{1})$/,
    example: ['#fb0', 'f0f'],
    process: function (bits){
      return [
        parseInt(bits[1] + bits[1], 16),
      parseInt(bits[2] + bits[2], 16),
      parseInt(bits[3] + bits[3], 16)
        ];
    }
  }
  ];
  this.init();

};  

Went.Color.prototype = {
  init:function(){
         if (this.color_string.charAt(0) == '#') { // remove # if any
           this.color_string = this.color_string.substr(1,6);
         }    
         this.color_string = this.color_string.replace(/ /g,'');
         this.color_string = this.color_string.toLowerCase();
         this.process();
       },
  process:function(){
            for (var i = 0; i < this.color_defs.length; i++) {
              var re = this.color_defs[i].re;
              var processor = this.color_defs[i].process;
              var bits = re.exec(this.color_string);
              if (bits) {
                channels = processor(bits);
                this.r = channels[0];
                this.g = channels[1];
                this.b = channels[2];
                this.ok = true;
              }      
            }
            this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
            this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
            this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);
          },
  toRGB :function () {
           return [this.r,this.g,this.b];
         },
  toHex :function () {
           var r = this.r.toString(16);
           var g = this.g.toString(16);
           var b = this.b.toString(16);
           if (r.length == 1){  r = '0' + r; }
           if (g.length == 1){  g = '0' + g; }
           if (b.length == 1){  b = '0' + b; }
           return '#' + r + g + b;
         },
  rbgWithAlpha: function(a){
                  return "rgba("+this.r+","+this.g+","+this.b+","+a+")";
                },
  toHSV: function(){
           var red = this.r, green = this.g, blue = this.b; 
           var hue, saturation, brightness; 
           var max = Math.max(red, green, blue), min = Math.min(red, green, blue); 
           var delta = max - min; 
           brightness = max / 255; 
           saturation = (max !== 0) ? delta / max : 0;
           if (saturation === 0){
             hue = 0; 
           } else { 
             var rr = (max - red) / delta; 
             var gr = (max - green) / delta; 
             var br = (max - blue) / delta; 
             if (red == max){  hue = br - gr; } 
             else if (green == max){ hue = 2 + rr - br;}
             else{hue = 4 + gr - rr;
               hue /= 6;}
               if (hue < 0){ hue++;} 
           } 
           return [Math.round(hue * 360), Math.round(saturation * 100), Math.round(brightness * 100)];    
         },
  hsvToRGB: function(hsb){
              var br = Math.round(hsb[2] / 100 * 255); 
              if (hsb[1] === 0){ 
                return [br, br, br]; 
              } else { 
                var hue = hsb[0] % 360; 
                var f = hue % 60; 
                var p = Math.round((hsb[2] * (100 - hsb[1])) / 10000 * 255); 
                var q = Math.round((hsb[2] * (6000 - hsb[1] * f)) / 600000 * 255); 
                var t = Math.round((hsb[2] * (6000 - hsb[1] * (60 - f))) / 600000 * 255); 
                switch (Math.floor(hue / 60)){ 
                  case 0: return [br, t, p]; 
                  case 1: return [q, br, p]; 
                  case 2: return [p, br, t]; 
                  case 3: return [p, q, br]; 
                  case 4: return [t, p, br]; 
                  case 5: return [br, p, q]; 
                } 
              }
            },
  analogic: function(_size, _step){
              var hsv = this.toHSV();
              var a;
              a = hsv[0];
              var step = _step || 10;
              var _colorArray = [this.toHex()];
              for (var i=1; i < _size; i++) {
                a = hsv[0] - step*i;
                if (a<0){ a = (360 - Math.abs(a)); }
                if (a>360){ a = (a%360); }
                _colorArray.push(this.hsvToHex([a, hsv[1],hsv[2]]));
              }
              return _colorArray;
            },
  mono: function(_size, _step){
          var hsv = this.toHSV();
          var a;
          v = hsv[2];
          var step = _step || 10;
          var _colorArray = [this.toHex()];
          for (var i=1; i < _size; i++) {
            v = hsv[2] - step*i;
            if (v<0){  v = (100 - Math.abs(v)); }
            if (v>100){ v = (v%100); }
            _colorArray.push(this.hsvToHex([hsv[0], hsv[1], v]));
          };
          return _colorArray;
        },
  divide: function(_size){
            var hsv = this.toHSV();
            var a;
            a = hsv[0];
            var step = 360/_size;
            var _colorArray = [this.toHex()];
            for (var i=1; i < _size; i++) {
              a = hsv[0] - step*i;
              if (a<0){  a = (360 - Math.abs(a)); }
              if (a>360){  a = (a%360); }
              _colorArray.push(this.hsvToHex([a, hsv[1],hsv[2]]));
            }
            return _colorArray;
          },
  darker: function(size){
            var hsv = this.toHSV();
            return this.hsvToHex([hsv[0], hsv[1], (hsv[2]-size||20<0)?0:hsv[2]-size||20]);
          },
  hsvToHex: function(hsv){
              var rgb=this.hsvToRGB(hsv);
              var r = rgb[0].toString(16);
              var g = rgb[1].toString(16);
              var b = rgb[2].toString(16);
              if (r.length == 1){  r = '0' + r; }
              if (g.length == 1){  g = '0' + g; }
              if (b.length == 1){  b = '0' + b; }
              return '#' + r + g + b;
            }

};
