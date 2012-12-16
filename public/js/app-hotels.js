Went.Section={};

Went.Section.Radar = {
  add: function(_title,_data){
    this.empty();
    if(_data.length>0){
      var set = [[_title.toUpperCase(),"radar",_data,{ activeColor:"#FF5E99",color:"#dddddd"}]];
      var eduCtrl = new Went.Chart.Controller(set,{ target:"viz-education", size:[600, 600]});
      this.print();
    }
  },

  empty: function(){
    document.body.querySelector('#viz-education').innerHTML = '';
    document.body.querySelector('#viz-text').value = '';
  },

  print: function(){
    document.body.querySelector('#viz-text').value = document.body.querySelector('.ph').innerHTML;
  }     
};

var index;
var col = ["ttfb","startRender",'onLoad',"reqTotal","bytesTotal"];
var dRows = ['/London/Hotels(f)','/London/Hotels(r)','New/London/Hotels(f)','New/London/Hotels(r)'];
var dSet = [
  [2895,5145,8401,138,788],
  [3128,4920,5662,18,72],
  [237,3060,5005,44,730],
  [165,615,815,4,10]
];

var dataForIndex = function(i){
  m = dSet[i];
  return m.map(function(a,i){return [col[i],a];});
};

ready(function() {
  
  var select = document.body.querySelector('.js-data-sel');
  
  var opt;
  dRows.forEach(function(a,i){
    opt = document.createElement('option');
    opt.value = i;
    opt.innerText = a;
    select.appendChild(opt);
  });

  select.addEventListener('change', function(e){
    option = e.srcElement.querySelectorAll('option')[e.srcElement.selectedIndex];
    if(option.value){
      Went.Section.Radar.add(dRows[option.value][0],dataForIndex(option.value));
    }
  });

});
