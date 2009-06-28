module("Core");

test("Creation of day names", function(){
  c = new LowlevelCalendar();
  equals(c.options.dayNames[0], "Sunday");
  equals(c.options.dayNames[6], "Saturday");
  
  var c = new LowlevelCalendar({firstDayOfWeek: 2});
  equals(c.options.dayNames[0], "Monday");
  equals(c.options.dayNames[6], "Sunday");
  
  var c = new LowlevelCalendar({firstDayOfWeek: 5});
  equals(c.options.dayNames[0], "Thursday");
  equals(c.options.dayNames[6], "Wednesday");
});

test("Incrementing and decrementing", function(){
  
});

test("Creation of cells", function(){
  c = new LowlevelCalendar({now: new Time(2008, 5, 17)});
  equals(c.months[0].cells[0][0].time.epoch(), new Time(2008, 4, 27).epoch());
  equals(c.months[0].cells[0][4].time.epoch(), new Time(2008, 5, 1).epoch());
  
  c = new LowlevelCalendar({now: new Time(2008, 5, 17), firstDayOfWeek: 2});
  equals(c.months[0].cells[0][0].time.epoch(), new Time(2008, 4, 28).epoch())
  equals(c.months[0].cells[0][3].time.epoch(), new Time(2008, 5, 1).epoch())
})

module("Months");

test("offdays", function(){
  c = new LowlevelCalendar({now: new Time(2008, 5, 17)});
  m = c.months[0];
  ok(c.months[0].cells[0][0].isOffday)
  ok(c.months[0].cells[0][1].isOffday)
  ok(c.months[0].cells[0][2].isOffday)
  ok(c.months[0].cells[0][3].isOffday)
  ok(!c.months[0].cells[0][4].isOffday)
  
  c = new LowlevelCalendar({now: new Time(2008, 5, 17), firstDayOfWeek: 2})
  m = c.months[0];
  
  ok(c.months[0].cells[0][0].isOffday)
  ok(c.months[0].cells[0][1].isOffday)
  ok(c.months[0].cells[0][2].isOffday)
  ok(!c.months[0].cells[0][3].isOffday)
});
