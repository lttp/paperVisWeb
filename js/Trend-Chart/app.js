function addAxesAndLegend (svg, xAxis, yAxis, margin, chartWidth, chartHeight) {
  var legendWidth  = 200/xTimes,
      legendHeight = 100/yTimes;

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

  //var legend = svg.append('g')
  //  .attr('class', 'legend')
  //  .attr('transform', 'translate(' + (chartWidth - legendWidth) + ', 0)');
  //
  //legend.append('rect')
  //  .attr('class', 'legend-bg')
  //  .attr('width',  legendWidth)
  //  .attr('height', legendHeight);
  //
  //legend.append('rect')
  //  .attr('class', 'outer')
  //  .attr('width',  75)
  //  .attr('height', 20)
  //  .attr('x', 10)
  //  .attr('y', 10);
  //
  //legend.append('text')
  //  .attr('x', 115)
  //  .attr('y', 25)
  //  .text('5% - 95%');
  //
  //legend.append('rect')
  //  .attr('class', 'inner')
  //  .attr('width',  75)
  //  .attr('height', 20)
  //  .attr('x', 10)
  //  .attr('y', 40);
  //
  //legend.append('text')
  //  .attr('x', 115)
  //  .attr('y', 55)
  //  .text('25% - 75%');
  //
  //legend.append('path')
  //  .attr('class', 'median-line')
  //  .attr('d', 'M10,80L85,80');
  //
  //legend.append('text')
  //  .attr('x', 115)
  //  .attr('y', 85)
  //  .text('Median');
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
  findPosition(marker,data,x,y);//get the area;
  var radius = 0,
      xPos = x(marker.date),
      yPosStart = chartHeight - radius - 3,//just for animation
      yPosEnd =y(marker.yPos);//this is the true y position
  var markerG = svg.append('g')
      .attr('class', 'marker '+marker.type.toLowerCase())
      .attr('transform', 'translate(' + xPos + ', ' + yPosStart + ')')
      .attr('opacity', 0);
  markerG.transition()
      //  .duration(1000)
      .attr('transform', 'translate(' + xPos + ', ' + yPosEnd + ')')
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
  var el = document.querySelector("#"+marker.type);
  //var te = document.getElementsByTagName('text');
  //console.log(te);
  setLocation(el,marker,length,xPos,yPosEnd,markerG,svg);
  //get its position
 // el.setAttribute('x',100);
 area= area.slice(0,0);
}
var addup={
  "date":2000-01-01,
   h:0
};
function setLocation(el,marker,length,xPos,yPosEnd,markerG,svg){
  var w, h,pos;
  var step = 0.2;
  w=el.offsetWidth;
  h=el.offsetHeight;
  //w=el.offsetWidth;
  //h=el.offsetHeight;
  var deltX = 0.0;
  var deltY = 0.0;
  var x=[],y=[];
  x[0] = xPos-w*5/8;x[1]=xPos+w*5/8;x[3]=xPos-w*5/8;x[2]=xPos+w*5/8;
  y[0] = yPosEnd+h/4;y[1]=yPosEnd+h/4;y[3]=yPosEnd-h;y[2]=yPosEnd-h;
  var test = d3.svg.line()
      .x(function(d,i){return x[i];})
      .y(function(d,i){return y[i];})


  for(var i=0;i<area.length;i++){
    if(area[i][0]==xPos){
      pos=i;break;
    }
  }
  if(locate.length==0){
    el.setAttribute('y', -area[pos][2] + area[pos][1]);
    for(var i=0;i<4;i++)y[i]+=-area[pos][2] + area[pos][1];
    locate.push(h);
    addup.date = marker.date;
    addup.h = h;
  }
  else
  {
    if(Date.parse(addup.date)==Date.parse(marker.date)){
      el.setAttribute('y', -area[pos][2] + area[pos][1]-addup.h);
      for(var i=0;i<4;i++)y[i]+=-area[pos][2] + area[pos][1]-addup.h;
      addup.h+=h;
    }else{
      el.setAttribute('y', -area[pos][2] + area[pos][1]);
      for(var i=0;i<4;i++)y[i]+=-area[pos][2] + area[pos][1];
      addup.date = marker.date;
      addup.h = h;
    }
    locate.push(h);
  }
  console.log(addup);
  function f(x,y){
    
  }
  //svg.append('path')
  //    .attr('class', 'test')
  //    .attr('d',test)
  //    .attr('clip-path', 'url(#rect-clip)');
  //el.setAttribute("x",10);
}
function findPosition(marker,data,x,y){
  //the center of text is in the bottom of the center of it.
  //now we have the whole area
  var getArea = [];
  var w,h;
  var pos,down,up;
  //var step = 0.2;
  //w = el.offsetWidth;
  //h = el.offsetHeight;
for(var i=0;i<data.length;i++){
  if(x(data[i].date)== x(marker.date))pos = i;
}
  //to locate the position of the texts;
  if(marker.yPos>data[pos].pct25){
    if(marker.yPos>data[pos].pct50){
      if(marker.yPos>data[pos].pct75){
        if(pos==0)down=0;//in case pos is 0
        else{
          for(var j = pos-1;j>=0;j--){
            if((data[j].pct95-data[j+1].pct95)>=0){
              down = j+1;
              break;
            }
          }
        }
        if(pos==data.length-1)up = data.length;
        else{
          for(var j=pos+1;j<data.length;j++){
            if((data[j].pct95-data[j-1].pct95)>=0){
              up = j;
              break;
            }
          }
        }
        getArea = data.slice(down,up);//now we got the area;
        getArea.forEach(function(d){
          area.push([x(d.date),y(d.pct75), y(d.pct95)]);
        });
      }
      else{
        if(pos==0)down=0;//in case pos is 0
        else{
          for(var j = pos-1;j>=0;j--){
            if((data[j].pct75-data[j+1].pct75)>=0){
              down = j+1;
              break;
            }
          }
        }
        if(pos==data.length-1)up = data.length;
        else{
          for(var j=pos+1;j<data.length;j++){
            if((data[j].pct75-data[j-1].pct75)>=0){
              up = j;
              break;
            }
          }
        }
        getArea = data.slice(down,up);//now we got the area;
        getArea.forEach(function(d){
          area.push([x(d.date),y(d.pct50), y(d.pct75)]);
        });
      }
    }
    else{
      if(pos==0)down=0;//in case pos is 0
      else{
        for(var j = pos-1;j>=0;j--){
          if((data[j].pct50-data[j+1].pct50)>=0){
            down = j+1;
            break;
          }
        }
      }
      if(pos==data.length-1)up = data.length;
      else{
        for(var j=pos+1;j<data.length;j++){
          if((data[j].pct50-data[j-1].pct50)>=0){
            up = j;
            break;
          }
        }
      }
      getArea = data.slice(down,up);//now we got the area;
      getArea.forEach(function(d){
        area.push([x(d.date),y(d.pct25), y(d.pct50)]);
      });
    }
  }else{
    if(pos==0)down=0;//in case pos is 0
    else{
      for(var j = pos-1;j>=0;j--){
        if((data[j].pct25-data[j+1].pct25)>=0){
          down = j+1;
          break;
        }
      }
    }
    if(pos==data.length-1)up = data.length;
    else{
      for(var j=pos+1;j<data.length;j++){
        if((data[j].pct25-data[j-1].pct25)>=0){
          up = j;
          break;
        }
      }
    }
    getArea = data.slice(down,up);//now we got the area;
    getArea.forEach(function(d){
      area.push([x(d.date),y(d.pct05), y(d.pct25)]);
    });
    //el.setAttribute('x',length*(pos-1)+10);
  }

}
function startTransitions (svg, chartWidth, chartHeight, rectClip, markers, x,y,length,data) {
  rectClip.transition()
   // .duration(1000*markers.length)
    .attr('width', chartWidth);
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
