function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 180/xTimes,
      legendHeight = 80/yTimes;//just for zoom. the yTimes and xTimes all equal 1,so no use of them.

  // clipping to make sure nothing appears behind legend
  svg.append('clipPath')
    .attr('id', 'axes-clip')
    .append('polygon')
      .attr('points', (-margin.left)                 + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + (-margin.top)                 + ' ' +
                      (chartWidth - legendWidth - 1) + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + legendHeight                  + ' ' +
                      (chartWidth + margin.right)    + ',' + (chartHeight + margin.bottom) + ' ' +
                      (-margin.left)                 + ',' + (chartHeight + margin.bottom));

  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis);

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6/yTimes)
      .attr('dy', '.71em')
      .style('text-anchor', 'end')
      .text('Time (s)');

  var legend = svg.append('g')
    .attr('class', 'legend')
    .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');

  legend.append('rect')
    .attr('class', 'legend-bg')
    .attr('width',  legendWidth)
    .attr('height', legendHeight);

  legend.append('rect')
    .attr('class', 'parallel')
    .attr('width',  75)
    .attr('height', 10)
      .style('fill','#8dd3c7')
    .attr('x', 10)
    .attr('y', 10);

  legend.append('text')
    .attr('x', 90)
    .attr('y', 20)
      .attr('font-size',4)
    .text('parallel');

  legend.append('rect')
    .attr('class', 'interactive')
    .attr('width',  75)
    .attr('height', 10)
      .style('fill','#80b1d3')
    .attr('x', 10)
    .attr('y', 25);

  legend.append('text')
    .attr('x', 90)
    .attr('y', 35)
      .attr('font-size',4)
    .text('interactive');

  legend.append('rect')
      .attr('class', 'dimensionality')
      .attr('width',  75)
      .attr('height', 10)
      .style('fill','#b3de69')
      .attr('x', 10)
      .attr('y', 40);

  legend.append('text')
      .attr('x', 90)
      .attr('y', 50)
      .attr('font-size',4)
      .text('dimensionality');
  legend.append('rect')
      .attr('class', 'topological')
      .attr('width',  75)
      .attr('height', 10)
      .style('fill','#bebada')
      .attr('x', 10)
      .attr('y', 55);

  legend.append('text')
      .attr('x', 90)
      .attr('y', 65)
      .attr('font-size',4)
      .text('topological');


}
var smooth = 0.8;//to adjust the smooth of the Trend chart
function drawPaths (svg, data, x, y) {
  var upperOuterArea = d3.svg.area()
 //   .interpolate('basis')
      .interpolate('cardinal')
      .tension(smooth)
    .x (function (d) { return x(d.date) || 1; })
    .y0(function (d) { return y(d.pct95); })
    .y1(function (d) { return y(d.pct75); });
  var upperInnerArea = d3.svg.area()
 //   .interpolate('basis')
      .interpolate('cardinal')
      .tension(smooth)
    .x (function (d) { return x(d.date) || 1; })
    .y0(function (d) { return y(d.pct75); })
    .y1(function (d) { return y(d.pct50); });
  var lowerInnerArea = d3.svg.area()
 //   .interpolate('basis')
      .interpolate('cardinal')
      .tension(smooth)
    .x (function (d) { return x(d.date) || 1;})
    .y0(function (d) { return y(d.pct50); })
    .y1(function (d) { return y(d.pct25); });

  var lowerOuterArea = d3.svg.area()
 //   .interpolate('basis')
      .interpolate('cardinal')
      .tension(smooth)
    .x (function (d) { return x(d.date) || 1; })
    .y0(function (d) { return y(d.pct25); })
    .y1(function (d) { return y(d.pct05); });

  svg.datum(data);

  svg.append('path')
      .style('fill','#8dd3c7')
    .attr('class', 'area upper outer')
    .attr('d', upperOuterArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
      .style('fill','#bebada')
    .attr('class', 'area lower outer')
    .attr('d', lowerOuterArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
      .style('fill','#80b1d3')
    .attr('class', 'area upper inner')
    .attr('d', upperInnerArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
      .style('fill','#b3de69')
    .attr('class', 'area lower inner')
    .attr('d', lowerInnerArea)
    .attr('clip-path', 'url(#rect-clip)');
}
var locate = [];
var area = [];
function addMarker (marker, svg, chartHeight, x,y,length,data) {
  var radius = 0,
      xPos = x(marker.date),
      yPosStart = chartHeight - radius - 3,//just for animation
      yPosEnd =y(marker.yPos);//this is the true y position
  var markerG = svg.append('g')
      .attr('class', 'marker '+marker.type.toLowerCase())
      .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
      .attr('opacity', 0);
  var yPos = area[marker.group][4]-area[marker.group][3];
  var xPoss = area[marker.group][1]+area[marker.group][2];
  markerG.transition()
      //  .duration(1000)
      .attr('transform', 'translate(' + xPoss+ ', ' + yPos + ')')
      .attr('opacity', 1);
  markerG.append('text')
      .attr('id',marker.type)
      .attr('font-size',marker.value)
      .attr('x', radius)
      .attr('y', radius)
      .attr('height',marker.value)
      .style("fill",marker.color)
      .text(marker.type);
//,"","#bc80bd","#ad2358"
  var  el = document.querySelector("#"+marker.type);
  //console.log(xPos+" "+yPosEnd);
 // console.log(el.getAttribute('font-size')+" "+el.offsetWidth);
  setLocation(marker,el);
 //for(var i=0;i<=19;i++) {
 //var i = 12;
 //  for (var j = 0; j < area[i][0].length; j += 10) {
 //    for (var k = 0; k < area[i][0][j].length; k += 10) {
 //      if (area[i][0][j][k] == 0) {
 //        var point = svg.append('circle')
 //            .attr('cx', function (d) {
 //              return area[i][1] + j;
 //            })
 //            .attr('cy', function (d) {
 //              return area[i][4] - k;
 //            })
 //            .attr('r', 5);
 //      }
 //    }
 //  }
 //}
}
function setLocation(marker,el){
  var minFontSize = 0;
 // var wordWidth = el.offsetWidth;//scrollWidth
  //var wordWidth = el.clientWidth;
  //var wordWidth = document.getElementById(marker.type);
  //wordWidth = wordWidth.maxWidth;
  var wordWidth = el.getComputedTextLength();
 // var wordHeight = el.getAttribute('font-size');
  var wordHeight = el.scrollHeight;
  //var aspect = wordHeight+1/wordWidth;
  //el.setAttribute('font-size-adjust',aspect);
  el.setAttribute('x',wordWidth/2);
  el.setAttribute('y',wordHeight/2);
  var c=70, Mmax=10000,r;
  var startX = parseInt(area[marker.group][2]);
  var startY = parseInt(area[marker.group][3]);
  console.log(marker.type+" "+wordHeight+" "+wordWidth);
  //console.log(startX +" "+startY);
  //console.log(wordHeight);
  //el.setAttribute('font-size',wordHeight-1);
  //console.log(el.offsetWidth+" "+el.getAttribute('font-size'));
  //get r
  var group = marker.group;
  r = area[marker.group][2]+30>area[marker.group][3]+30?area[marker.group][2]+30:area[marker.group][3]+30;
  var posx,posy;
  for(var i=0;i<Mmax;i++) {
    posx = (Math.sin(2 * 3.1415926 * Math.sqrt(i / Mmax) * c) * (i / Mmax) * r);
    posy = (Math.cos(2 * 3.1415926 * Math.sqrt(i / Mmax) * c) * (i / Mmax) * r);
    posx = parseInt(posx);
    posy = parseInt(posy);
    //探索函数完成，接下来进行位置寻找放置及更新。
    var isOk = 1;
    var space=3;
    for(var j=0;j<wordWidth+space*2;j++){
      for(var k=0;k<wordHeight+space*2;k++){
          if (startX + posx + j <= space  || startX + posx + j >= area[marker.group][0].length - space ||
              (startY + posy + k) <= space || (startY + posy + k) >= area[marker.group][0][0].length - space|| area[marker.group][0][parseInt(startX + posx + j)][parseInt(startY + posy + k)] == 1)isOk = 0;
          if(isOk==0)break;
      }
      if(isOk==0)break;
    }
    if(isOk==1){
      var chgX = parseInt((wordWidth+space*2)/2)+posx;
      var chgY = parseInt((wordHeight+space*2)/2)+posy;
      for(var j = 0;j<wordWidth+space*2;j++){
        for(var k = 0;k<wordHeight+space*2.2;k++){
          area[marker.group][0][startX+posx+j][(startY+posy+k)]=1;
        }
      }
      el.setAttribute('x',chgX);
      el.setAttribute('y',-chgY);
      el.setAttribute('id',el.getAttribute('id')+'ed');

      isOk=2;
      break;
    }
  }
  if(isOk!=2){
    var temp = el.getAttribute('font-size')-1;
    if(temp>=minFontSize) {
      el.setAttribute('font-size', temp);
      arguments.callee(marker,el);
    }
    else{
      if(marker.group%5!=4){
        marker.group++;
        el.setAttribute('font-size',marker.value);
        arguments.callee(marker,el);
      }
      el.remove();
      //arguments.callee(marker,el);
    }
  }
}
function findPosition(PosPlatform,data,x,y){
  //the center of text is in the bottom of the center of it.
  //now we have the whole area
  var getArea = [];
  var pos=0,down,up;
  var areTemp = [];
  //var step = 0.2;
  //w = el.offsetWidth;
  //h = el.offsetHeight;
  //16.5.09 find a bug in this function of 'locate the position of the text'
for(var i=0;i<data.length;i++){
  if(x(data[i].date)== x(PosPlatform.date))pos = i;
}
  //to locate the position of the texts;
  if(PosPlatform.yPos>data[pos].pct25){
    if(PosPlatform.yPos>data[pos].pct50){
      if(PosPlatform.yPos>data[pos].pct75){
        if(pos==0)down=0;//in case pos is 0
        else{
          for(var j = pos-1;j>=0;j--){
            if((data[j].pct95-data[j+1].pct95)>0||data[j+1].pct95==0){
              down = j+1;
              break;
            }
          }
        }
        if(pos==data.length-1)up = data.length;//cause the upBond of the slice function is 1 bigger than actual upBond
        else{
          for(var j=pos+1;j<data.length;j++){
            if((data[j].pct95-data[j-1].pct95)>0||data[j-1].pct95==0){
              up = j;
              break;
            }
          }
        }
        getArea = data.slice(down,up);//now we got the area;
        getArea.forEach(function(d){
          areTemp.push([x(d.date),y(d.pct75), y(d.pct95)]);
        });
      }
      else{
        if(pos==0)down=0;//in case pos is 0
        else{
          for(var j = pos-1;j>=0;j--){
            if((data[j].pct75-data[j+1].pct75)>=0||data[j+1].pct75==0){
              down = j+1;
              break;
            }
          }
        }
        if(pos==data.length-1)up = data.length;
        else{
          for(var j=pos+1;j<data.length;j++){
            if((data[j].pct75-data[j-1].pct75)>0||data[j-1].pct75==0){
              up = j;
              break;
            }
          }
        }
        getArea = data.slice(down,up);//now we got the area;
        getArea.forEach(function(d){
          areTemp.push([x(d.date),y(d.pct50), y(d.pct75)]);
        });
      }
    }
    else{
      if(pos==0)down=0;//in case pos is 0
      else{
        for(var j = pos-1;j>=0;j--){
          if((data[j].pct50-data[j+1].pct50)>0||data[j+1].pct50==0){
            down = j+1;
            break;
          }
        }
      }
      if(pos==data.length-1)up = data.length;
      else{
        for(var j=pos+1;j<data.length;j++){
          if((data[j].pct50-data[j-1].pct50)>0||data[j-1].pct50==0){
            up = j;
            break;
          }
        }
      }
      getArea = data.slice(down,up);//now we got the area;
      getArea.forEach(function(d){
        areTemp.push([x(d.date),y(d.pct25), y(d.pct50)]);
      });
    }
  }else{
    if(pos==0)down=0;//in case pos is 0
    else{
      for(var j = pos-1;j>=0;j--){
        if((data[j].pct25-data[j+1].pct25)>0||data[j+1].pct25==0){
          down = j+1;
          break;
        }
      }
    }
    if(pos==data.length-1)up = data.length;
    else{
      for(var j=pos+1;j<data.length;j++){
        if((data[j].pct25-data[j-1].pct25)>0||data[j-1].pct25==0){
          up = j;
          break;
        }
      }
    }
    getArea = data.slice(down,up);//now we got the area;
    getArea.forEach(function(d){
      areTemp.push([x(d.date),y(d.pct05), y(d.pct25)]);
    });
    //el.setAttribute('x',length*(pos-1)+10);
  }//y(0)=440;
  //y(30) = 0;
  var w = areTemp[areTemp.length-1][0] - areTemp[0][0];
  w =  parseInt(w);
  var maxH = 440;
  var minH = 0;
  areTemp.forEach(function(d){
    if(d[1]>=minH)minH = d[1];
    if(d[2]<=maxH)maxH = d[2];
  });
  maxH = parseInt(maxH);
  minH = parseInt(minH);
  var h = minH-maxH;
 var array  = new Array();
  var tx, ty,temp=0;
 for(var i=0;i<w;i++){
   array[i] = new Array();
   for(var j = 0;j<h;j++){
     //locate the place of i
     for(var k = 0;k<areTemp.length-1;k++){
       if(i+areTemp[0][0]>=areTemp[k][0]&&(i+areTemp[0][0])<=areTemp[k+1][0]){
         var x1 = areTemp[k][0],x2 = areTemp[k+1][0],y1=areTemp[k][1],y2=areTemp[k+1][1],y3=areTemp[k][2],y4=areTemp[k+1][2];
         var k1 = (y2-y1)/(x2-x1),b1 = (y1*x2-x1*y2)/(x2-x1);
         var k2 = (y4-y3)/(x2-x1),b2 = (y3*x2-x1*y4)/(x2-x1);
      //   console.log(j+" "+(k1*(i+areTemp[0][0])+b1)+" "+(k2*(i+areTemp[0][0])+b2));
         if((minH-j)<=(k1*(i+areTemp[0][0])+b1)&&(minH-j)>=(k2*(i+areTemp[0][0])+b2)){
           if(temp<=(k1*(i+areTemp[0][0])+b1)-(k2*(i+areTemp[0][0])+b2)){
           temp = (k1*(i+areTemp[0][0])+b1)-(k2*(i+areTemp[0][0])+b2);
             if(i==0){
               tx = i;
               ty =440- minH+j/2;
             }else{
               tx = i;
               ty = 440-minH+j/2;
             }

           }
           array[i][j] = 0;
         }
         else{
           array[i][j] = 1;
         }
       }
     }
   }
 }//栅格化完毕
  area.push([array,areTemp[0][0],tx,ty,minH]);
}
function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x,y,length,data) {
  rectClip.transition()
   // .duration(1000*markers.length)
    .attr('width', chartWidth);
  var PositionPlatform = [
    {
      "date": "2000-01-01",
      "type": "topological",
      "yPos":0,
    },
    {
      "date": "2004-01-01",
      "type": "topological",
      "yPos":0,
    },
    {
      "date": "2007-01-01",
      "type": "topological",
      "yPos":0,
    },
    {
      "date": "2010-01-01",
      "type": "topological",
      "yPos":0,
    },
    {
      "date": "2013-01-01",
      "type": "topological",
      "yPos":0,
    },
    {
      "date": "2000-01-01",
      "type": "dimensionality",
      "yPos":2,
    },
    {
      "date": "2003-01-01",
      "type": "dimensionality",
      "yPos":2,
    },
    {
      "date": "2007-01-01",
      "type": "dimensionality",
      "yPos":3,
    },
    {
      "date": "2010-01-01",
      "type": "dimensionality",
      "yPos":5,
    },
    {
      "date": "2013-01-01",
      "type": "dimensionality",
      "yPos":4,
    },
    {
      "date": "2000-01-01",
      "type": "interactive",
      "yPos":4,
    },
    {
      "date": "2003-01-01",
      "type": "interactive",
      "yPos":5,
    },
    {
      "date": "2007-01-01",
      "type": "interactive",
      "yPos":5,
    },
    {
      "date": "2010-01-01",
      "type": "interactive",
      "yPos":9,
    },
    {
      "date": "2013-01-01",
      "type": "interactive",
      "yPos":9,
    },
    {
      "date": "2000-01-01",
      "type": "parallel",
      "yPos":12,
    },
    {
      "date": "2003-01-01",
      "type": "parallel",
      "yPos":10.5,
    },
    {
      "date": "2007-01-01",
      "type": "parallel",
      "yPos":15,
    },
    {
      "date": "2010-01-01",
      "type": "parallel",
      "yPos":23,
    },
    {
      "date": "2013-01-01",
      "type": "parallel",
      "yPos":19,
    }
  ];
  var PosPlatform = PositionPlatform.map(function (plat) {
    return {
      date: parseDate(plat.date),
      type: plat.type,
      yPos:plat.yPos,
    };
  });
  PosPlatform.forEach(function(d){
    findPosition(d,data,x,y);//get the area;
  });
  //console.log(area);
  markers.forEach(function (marker, i) {
   // console.log(length);
      addMarker(marker, svg, chartHeight, x,y,length,data);
  });
}
var yTimes = 1,xTimes = 1;//2.17 3.84
function makeChart (data, markers) {
  var svgWidth  = 960/xTimes,
      svgHeight = 500/yTimes,
      margin = { top: 20/yTimes, right: 20/xTimes, bottom: 40/yTimes, left: 40/xTimes },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.date; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([0, d3.max(data, function (d) { return d.pct95; })]);
  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10);

  var svg = d3.select('body').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);
  var length=x(markers[0].date);
  markers = markers.slice(1,markers.length+1);
  addAxesAndLegend(svg, xAxis, yAxis, margin, chartWidth, chartHeight);
  drawPaths(svg, data, x, y);
  startTransitions(svg, chartWidth, chartHeight, rectClip, markers, x,y,length,data);
}//makeChart

var parseDate  = d3.time.format('%Y-%m-%d').parse;
d3.json('./data/data.json', function (error, rawData) {
  if (error) {
    console.error(error);
    return;
  }

  var data = rawData.map(function (d) {
    return {
      date:  parseDate(d.date),
      pct05: d.pct05,
      pct25: d.pct25 / 1000,
      pct50: d.pct50 / 1000,
      pct75: d.pct75 / 1000,
      pct95: d.pct95/1000
    };
  });

  d3.json('./data/markers.json', function (error, markerData) {
    if (error) {
      console.error(error);
      return;
    }

    var markers = markerData.map(function (marker) {
      return {
        date: parseDate(marker.date),
        group:marker.group,
        type: marker.type,
        version: marker.version,
        yPos:marker.yPos/1000,
        value:marker.value,
        color:marker.color
      };
    });
    makeChart(data, markers);
  });
});
