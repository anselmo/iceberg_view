Went.Section={};

Went.Section.Circular = {
  add: function(_data){
    console.log(_data);
    this.empty();
    if(_data.length>0){
      var colorMode = document.body.querySelector('.js-color-mode').value;
      var _color = '#f675a5';
      var assetsViz = new Went.Chart.Circular(null, [_data], {target:"viz-target",size:[600,600], legendPos:[300,300], titlePos:[300,27],  valuePos:[300,260], titleFontSize:12, valueFontSize: 54, titleAlign:"middle", strokeWidth:40, r:200, delegate:{}, color: _color, colorMode: colorMode});
      this.print();
    }
  },

  empty: function(){
    document.body.querySelector('#viz-target').innerHTML = '';
    document.body.querySelector('#viz-text').value = '';
  },

  print: function(){
    document.body.querySelector('#viz-text').value = document.body.querySelector('#viz-target').innerHTML;
  }     
};

var index;
var dSet = [
  ["Homepage March Assets First", [["Html", 5 ],["JS", 26],["Css", 5],["Text",5], ["Image",36], ["Flash",5], ["Other",13]]],
  ["Homepage March Bytes First", [["Html", 21639 ],["JS", 219160],["Css", 55178],["Text",5], ["Image",770397], ["Flash",531746], ["Other",29252]]],
  ["Hotels Old Assets", [["Html", 4 ],["JS", 45],["Css", 5],["Text",2], ["Image",81], ["Flash",1], ["Other",1]]],
  ["Hotels Old Bytes", [["Html", 33244 ],["JS", 332626],["Css", 655185],["Text",2702], ["Image",332895], ["Flash",40258], ["Other",668]]],
  ["Hotels New Assets", [["Html", 3],["JS", 8],["Css", 1],["Text",2], ["Image",34], ["Flash",1], ["Other",3]]],
  ["Hotels New Bytes", [["Html", 9701 ],["JS",64473],["Css",58449 ],["Text",2489], ["Image",619795], ["Flash",56050], ["Other",1557]]]
];

var parseData = function(set){
  total = [0,1,2,3,4].reduce(function(p,c,i,arr){ return p + c;});
  return set.map(function(v){ return [v[0], (v[1]*total)/100]; });
};

var dataFor = function(i){
  cSet = dSet[i];
  return [cSet[0], parseData(cSet[1])];
};

var _callback = function(e){
  option = e.srcElement.querySelectorAll('option')[e.srcElement.selectedIndex];
  if(option.value){
    Went.Section.Circular.add(dataFor(option.value));
  }
};

ready(function() {
  
  var select = document.body.querySelector('.js-data-sel');
  var opt;
  dSet.forEach(function(d,i){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerText = d[0];
    select.appendChild(opt);
  });
  select.addEventListener('change', _callback);

});



