(function () {
  TestCase("JsCalendarLogic", {
    "test creation of day names": function () {
      c = new CalendarLogic();
      assertEquals("Sunday", c.options.dayNames[0]);
      assertEquals("Saturday", c.options.dayNames[6]);

      var c = new CalendarLogic({firstDayOfWeek: 2});
      assertEquals("Monday", c.options.dayNames[0]);
      assertEquals("Sunday", c.options.dayNames[6]);

      var c = new CalendarLogic({firstDayOfWeek: 5});
      assertEquals("Thursday", c.options.dayNames[0]);
      assertEquals("Wednesday", c.options.dayNames[6]);
    },
    
    "test incrementing and decrementing": function () {
      c = new CalendarLogic({now: new Time(2008, 5, 17)});

      c.incrementMonth();
      assertEquals(2, c.months.length);
      assertEquals(1, c.currentMonthIndex);
      assertEquals(6, c.currentMonth().time.month());

      c.incrementMonth();
      assertEquals(3, c.months.length);
      assertEquals(2, c.currentMonthIndex);
      assertEquals(7, c.currentMonth().time.month());

      c.decrementMonth();
      assertEquals(3, c.months.length);
      assertEquals(1, c.currentMonthIndex);
      assertEquals(6, c.currentMonth().time.month());

      c.decrementMonth()
      c.decrementMonth()
      assertEquals(4, c.months.length);
      assertEquals(0, c.currentMonthIndex);
      assertEquals(4, c.currentMonth().time.month());
    },
    
    "test cell callback being called": function () {
      var cellCallbackTimesCalled = 0;
      var timeInstance;
      
      var cal = new CalendarLogic({
        now: new Time(2008, 11, 1),
        cellCallback: function (time) {
          cellCallbackTimesCalled++;
          timeInstance = time;
        }
      });
      
      var calendarDaysInNovember2008 = 30 + 12;
      assertEquals(calendarDaysInNovember2008, cellCallbackTimesCalled);
      // Just testing that it's there, basically.
      assertEquals(new Time(2008, 12, 6).epoch(), timeInstance.beginningOfDay().epoch());
      
      // Making sure the callback is called when changing months as well
      cal.incrementMonth();
      var calendarDaysInDecember2008 = 31 + 4;
      assertEquals(calendarDaysInNovember2008 + calendarDaysInDecember2008, cellCallbackTimesCalled);
      
      // The callback is only called when cells are created - going back to existing
      // month won't call the callback.
      cal.decrementMonth();
      assertEquals(calendarDaysInNovember2008 + calendarDaysInDecember2008, cellCallbackTimesCalled);
    },
    
    "test rotating day names based on firstDayOfWeek option": function () {
      var baseDayNames = new CalendarLogic().options.dayNames;
      
      var c = new CalendarLogic({firstDayOfWeek: 2});
      assertEquals(baseDayNames[1], c.options.dayNames[0]);
      assertEquals(baseDayNames[0], c.options.dayNames[6]);
      
      var c = new CalendarLogic({firstDayOfWeek: 5});
      assertEquals(baseDayNames[4], c.options.dayNames[0]);
      assertEquals(baseDayNames[3], c.options.dayNames[6]);
    },
    
    "test custom day names and custom first day of week": function () {
      var c = new CalendarLogic({
        firstDayOfWeek: 2,
        dayNames: ["Søndag", "Mandag", "3", "4", "5", "6", "7"]
      });
      
      assertEquals("Mandag", c.options.dayNames[0]);
      assertEquals("Søndag", c.options.dayNames[6]);
    },
    
    "test creation of cells": function () {
      c = new CalendarLogic({now: new Time(2008, 5, 17)});
      assertEquals(new Time(2008, 4, 27).epoch(), c.months[0].cells[0][0].time.epoch());
      assertEquals(new Time(2008, 5, 1).epoch(), c.months[0].cells[0][4].time.epoch());

      c = new CalendarLogic({now: new Time(2008, 5, 17), firstDayOfWeek: 2});
      assertEquals(new Time(2008, 4, 28).epoch(), c.months[0].cells[0][0].time.epoch())
      assertEquals(new Time(2008, 5, 1).epoch(), c.months[0].cells[0][3].time.epoch())
    },
    
    "test offdays": function () {
      c = new CalendarLogic({now: new Time(2008, 5, 17)});
      m = c.months[0];
      assertTrue(c.months[0].cells[0][0].isOffday)
      assertTrue(c.months[0].cells[0][1].isOffday)
      assertTrue(c.months[0].cells[0][2].isOffday)
      assertTrue(c.months[0].cells[0][3].isOffday)
      assertFalse(c.months[0].cells[0][4].isOffday)

      c = new CalendarLogic({now: new Time(2008, 5, 17), firstDayOfWeek: 2})
      m = c.months[0];

      assertTrue(c.months[0].cells[0][0].isOffday)
      assertTrue(c.months[0].cells[0][1].isOffday)
      assertTrue(c.months[0].cells[0][2].isOffday)
      assertFalse(c.months[0].cells[0][3].isOffday)
    },
    
    "test isToday": function () {
      var now = new Time();
      c = new CalendarLogic({now: now});
      var cellForToday = c.months[0].cells[now.weekOfCurrentMonth() - 1][now.weekday() - 1];
      
      // Testing that it is in fact today
      assertEquals(now.clone().beginningOfDay().epoch(), cellForToday.time.clone().beginningOfDay().epoch())
      // The actual test
      assertTrue(cellForToday.isToday);
      
    }
  });
}());