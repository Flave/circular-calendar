var width = 2100,
  height = 2100,
  margin = {top: 150, right: 150, bottom: 150, left: 150},
  startDay = new Date(2017, 0, 1);


function draw(startDay) {
  var endDay, 
      days,
      angleStep,
      canvas,
      container,
      dayOfMonthFormatter,
      dayOfWeekFormatter,
      monthFormatter,
      defs,
      radius,
      dayOfTheYear,
      monthLabelOffset = -40;


  dayOfMonthFormatter = d3.timeFormat('%d');
  dayOfWeekFormatter = d3.timeFormat('%a');
  dayOfTheYear = getDayOfTheYear(startDay)
  monthFormatter = d3.timeFormat('%B');
  canvas = d3.select('#canvas');
  endDay = new Date(startDay);
  endDay.setYear(startDay.getFullYear() + 1);
  days = d3.timeDay.range(startDay, endDay);
  angleStep = Math.PI * 2 / (days.length);
  radius = (width - margin.left - margin.right) / 2;

  canvas
    .attr('width', width)
    .attr('height', height);

  container = canvas.selectAll('g.container')
    .data([0])
    .enter()
    .append('g')
    .attr('class', 'container')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // DEFS
  defs = container.selectAll('defs')
    .data([0])
    .enter()
    .append('defs');

  // TEXT CIRCLE PATH
  defs
    .selectAll('path')
    .data([0])
    .enter()
    .append('path')
    .attr('d', function() {
      var angle = Math.PI * 1.5 + Math.PI / 6,
          x = Math.cos(angle) * (radius - monthLabelOffset),
          y = Math.sin(angle) * (radius - monthLabelOffset) + radius - monthLabelOffset;
      return 'M 0 0 A' + radius + ' ' + radius + ' 0, 0, 1, ' + x + ' ' + y;
    })
    .attr('id', 'text-circle');
    

  // CIRCLES
/*  container
    .append('circle')
    .attr('class', 'note-circle')
    .attr('r', radius - 55)
    .attr('cx', radius)
    .attr('cy', radius)
    .style('fill', 'none');*/

/*  container
    .append('circle')
    .attr('class', 'note-circle')
    .attr('r', radius - 68)
    .attr('cx', radius)
    .attr('cy', radius)
    .style('fill', 'none');*/


  // GROUP
  day = container.selectAll('day')
    .data(days)
    .enter()
    .append('g')
    .attr('transform', placeOnCircle);


  // DAY NUMBER
  day
    .append('text')
    .text(dayOfMonthFormatter)   
    .attr('fill', function(d, i) {
      return '#000';
      return i===0 ? '#f00' : '#000'
    })
    .attr('transform', function(d, i) {
      var dayOfYear = getDayOfTheYear(d);
      if(dayOfYear < 181)
        return 'rotate(' + 90 + ') translate(-15, -6)';
      return 'rotate(' + -90 + ') translate(15, 13)';
    })
    .attr('class', function(d, i) {
      var dayOfYear = getDayOfTheYear(d),
          className = setWeekdayClass(d) + setMonthClass(d);
      if(dayOfYear < 181)
        className += ' first-half-year';
      return className;
    })
    .classed('day-number', true);

  // DAY NUMBER
  day
    .append('text')
    .text(function(d, i) {
      return dayOfWeekFormatter(d).slice(0, 1);
    })
    .attr('fill', function(d, i) {
      return '#000';
      return i===0 ? '#f00' : '#000'
    })
    .attr('transform', function(d, i) {
      var dayOfYear = getDayOfTheYear(d);
      if(dayOfYear < 181)
        return 'rotate(' + 90 + ') translate(-43, -6)';
      return 'rotate(' + -90 + ') translate(43, 13)';
    })
    .attr('class', function(d, i) {
      var dayOfYear = getDayOfTheYear(d),
          className = setWeekdayClass(d) + setMonthClass(d);
      if(dayOfYear < 181)
        className += ' first-half-year';
      return className;
    })
    .classed('day-name', true);

  // MONTH NAME
/*  day
    .append('use')
    .attr('xlink:href', '#text-circle')
    .style('stroke', '#000')
    .style('fill', 'none')
    .attr('transform', 'translate(0, -68)')
    .filter(function(d) {
      return d.getDate() !== 1;
    })
    .remove();*/

/*  var monthName = day
    .append('text')
    .attr('transform', 'translate(0, -60)')
    .attr('class', 'month-name');

  monthName
    .append('textPath')
    .attr('startOffset', "50%")
    .attr('xlink:href', '#text-circle')
    .append('tspan')
    .style('font-size', '20px')
    .style('font-family', 'Brandon Grotesque')
    .text(monthFormatter);

  monthName
    .filter(function(d) {
      return d.getDate() !== 1;
    })
    .remove();*/

  var monthName = day
    .append('text')
    .attr('transform', 'translate(0, -65)')
    .attr('class', 'month-name')
    .style('font-size', '20px')
    .style('text-transform', 'uppercase')
    .style('font-family', 'Brandon Grotesque')
    .text(function(d, i) {
      return monthFormatter(d).toUpperCase();
    });

  monthName
    .filter(function(d) {
      return d.getDate() !== Math.floor(getDaysInMonth(d) / 2);
    })
    .remove();


  // LINE
  day
    .append('path')
    .attr('d', 'M18 2 L 18 17')
    .attr('class', setWeekdayClass)
    .classed('day-line', true)
    .classed('daily', true);

  day
    .append('path')
    .attr('d', 'M18 80 L 18 190')
    .attr('class', setWeekdayClass)
    .classed('day-line', true)
    .classed('weekly', true);

  day
    .append('path')
    .attr('d', 'M-2 -65 L -2 -77')
    .attr('class', setMonthClass)
    .classed('day-line', true)
    .classed('monthly', true)
    .filter(function(d, i) {
      return d.getDate() !== 1;
    })
    .remove();

  container
    .selectAll('text')
    .style('font-family', 'Brandon Grotesque');

  container
    .selectAll('textPath')
    .style('font-family', 'Brandon Grotesque');


  function setWeekdayClass(d, i) {
    var day = d.getDay(),
        className = '';
    className += dayOfWeekFormatter(d).toLowerCase() + ' ';
    className += (day === 0 || day === 6) ? 'weekend ' : 'weekday ';
    return className;
  }

  function setMonthClass(d, i) {
    var date = d.getDate();
    return (date === 1) ? 'first-of-month' : 'regular-date';
  }


  function placeOnCircle(d, i, selection) {
    var index = (i + dayOfTheYear) % 365,
        translate, rotate, transform;
    transform = getCircleTransform(index);
    translate = 'translate(' + transform.x + ',' + transform.y + ')';
    rotate = 'rotate(' + transform.rotation + ')';
    return translate + ' ' + rotate;
  }

  function getCircleTransform(i, _r) {
    var angle, x, y, rotation, r;
    angle = angleStep * i + (Math.PI / 2);
    r = _r ? _r : radius;
    rotation = (angle * 360) / (2 * Math.PI) + 90;
    x = Math.cos(angle) * radius + radius;
    y = Math.sin(angle) * radius + radius;

    return {x: x, y: y, rotation: rotation};
  }
}


function getDaysInMonth(d) {
  var start = new Date(d),
      end = new Date(d);

  start.setDate(1)
  end.setDate(15);
  end.setMonth(start.getMonth() + 1)
  end.setDate(1);
  return d3.timeDays(start, end).length;  
}

function getDayOfTheYear(date) {
  var timestmp = new Date().setFullYear(date.getFullYear(), 0, 1);
  var yearFirstDay = Math.floor(timestmp / 86400000);
  var day = Math.ceil((date.getTime()) / 86400000);
  var dayOfYear = day - yearFirstDay;
  return dayOfYear;
}


window.onload = draw.bind(this, startDay);