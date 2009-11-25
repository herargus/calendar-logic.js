(function () {
  TestCase("JsLowlevelCalendar", {
    "test creation of day names": function () {
      c = new LowlevelCalendar();
      assertEquals(c.options.dayNames[0], "Sunday");
      assertEquals(c.options.dayNames[6], "Saturday");

      var c = new LowlevelCalendar({firstDayOfWeek: 2});
      assertEquals(c.options.dayNames[0], "Monday");
      assertEquals(c.options.dayNames[6], "Sunday");

      var c = new LowlevelCalendar({firstDayOfWeek: 5});
      assertEquals(c.options.dayNames[0], "Thursday");
      assertEquals(c.options.dayNames[6], "Wednesday");
    },
    
    "test incrementing and decrementing": function () {
      c = new LowlevelCalendar({now: new Time(2008, 5, 17)});

      c.incrementMonth();
      assertEquals(c.months.length, 2);
      assertEquals(c.currentMonthIndex, 1);
      assertEquals(c.currentMonth.time.month(), 6);

      c.incrementMonth();
      assertEquals(c.months.length, 3);
      assertEquals(c.currentMonthIndex, 2);
      assertEquals(c.currentMonth.time.month(), 7);

      c.decrementMonth();
      assertEquals(c.months.length, 3);
      assertEquals(c.currentMonthIndex, 1);
      assertEquals(c.currentMonth.time.month(), 6);

      c.decrementMonth()
      c.decrementMonth()
      assertEquals(c.months.length, 4);
      assertEquals(c.currentMonthIndex, 0);
      assertEquals(c.currentMonth.time.month(), 4);
    },
    
    "test creation of cells": function () {
      c = new LowlevelCalendar({now: new Time(2008, 5, 17)});
      assertEquals(c.months[0].cells[0][0].time.epoch(), new Time(2008, 4, 27).epoch());
      assertEquals(c.months[0].cells[0][4].time.epoch(), new Time(2008, 5, 1).epoch());

      c = new LowlevelCalendar({now: new Time(2008, 5, 17), firstDayOfWeek: 2});
      assertEquals(c.months[0].cells[0][0].time.epoch(), new Time(2008, 4, 28).epoch())
      assertEquals(c.months[0].cells[0][3].time.epoch(), new Time(2008, 5, 1).epoch())
    },
    
    "test offdays": function () {
      c = new LowlevelCalendar({now: new Time(2008, 5, 17)});
      m = c.months[0];
      assertTrue(c.months[0].cells[0][0].isOffday)
      assertTrue(c.months[0].cells[0][1].isOffday)
      assertTrue(c.months[0].cells[0][2].isOffday)
      assertTrue(c.months[0].cells[0][3].isOffday)
      assertFalse(c.months[0].cells[0][4].isOffday)

      c = new LowlevelCalendar({now: new Time(2008, 5, 17), firstDayOfWeek: 2})
      m = c.months[0];

      assertTrue(c.months[0].cells[0][0].isOffday)
      assertTrue(c.months[0].cells[0][1].isOffday)
      assertTrue(c.months[0].cells[0][2].isOffday)
      assertFalse(c.months[0].cells[0][3].isOffday)
    },
    
    "test isToday": function () {
      c = new LowlevelCalendar({now: new Time()});
      console.log(c.months[0].cells[2][6].time.year())
      assertTrue(c.months[0].cells[2][6].isToday);
    }
  });
}());