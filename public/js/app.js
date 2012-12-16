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
var dRows = ['/Home(f)','/Themes(f)','/London(f)','/London/Things-To-Do(f)','/London/Hotels(f)','/Shop(f)','/ThornTree(f)','/Search(f)','/Home(r)','/Themes(r)','/London(r)','/London/Things-To-Do(r)','/London/Hotels(r)','/Shop(r)','/ThornTree(r)','/Search(r)'];
var dSet = [
  [767,2641,8696,79,1386],
  [651,2218,14090,99,2424],
  [1688,4500,8167,109,761],
  [1428,4370,10680,103,1119],
  [2916,5591,7900,125,698],
  [1680,3920,7710,84,1018],
  [490,2686,4930,80,592],
  [650,4516,7513,76,515],
  [786,2573,4882,26,427],
  [671,2138,8672,30,434],
  [1926,1807,4238,28,148],
  [1701,3571,4690,17,55],
  [3518,5447,6652,13,34],
  [1980,2909,4910,14,40],
  [515,2239,4628,29,159],
  [703,2436,5880,53,277]
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

    // var radarValues1 = [["ttfb",200],["PageSpeed",84],["startRender",2912],["onLoad",1250],["reqTotal",82],["bytesTotal",208]];
    // var radarValues2 = [["ttfb",200],["startRender",291],["onLoad",250],["bytesTotal",208],["reqTotal",82]];

