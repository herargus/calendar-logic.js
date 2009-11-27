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
    
    "test day callback being called": function () {
      var dayCallbackTimesCalled = 0;
      var timeInstance;
      
      var cal = new CalendarLogic({
        now: new Time(2008, 11, 1),
        dayCallback: function (time) {
          dayCallbackTimesCalled++;
          timeInstance = time;
        }
      });
      
      var calendarDaysInNovember2008 = 30 + 12;
      assertEquals(calendarDaysInNovember2008, dayCallbackTimesCalled);
      // Just testing that it's there, basically.
      assertEquals(new Time(2008, 12, 6).epoch(), timeInstance.beginningOfDay().epoch());
      
      // Making sure the callback is called when changing months as well
      cal.incrementMonth();
      var calendarDaysInDecember2008 = 31 + 4;
      assertEquals(calendarDaysInNovember2008 + calendarDaysInDecember2008, dayCallbackTimesCalled);
      
      // The callback is only called when days are created - going back to existing
      // month won't call the callback.
      cal.decrementMonth();
      assertEquals(calendarDaysInNovember2008 + calendarDaysInDecember2008, dayCallbackTimesCalled);
    },
    
    "test month created and month changed callback being called": function () {
      var monthCreatedTimesCalled = 0;
      var monthChangedTimesCalled = 0;
      
      var cal = new CalendarLogic({
        now: new Time(2008, 11, 1),
        monthCreated: function () {
          monthCreatedTimesCalled++;
        },
        monthChanged: function () {
          monthChangedTimesCalled++;
        }
      });
      
      assertEquals(1, monthCreatedTimesCalled);
      assertEquals(1, monthChangedTimesCalled);
      
      cal.incrementMonth();
      assertEquals(2, monthCreatedTimesCalled);
      assertEquals(2, monthChangedTimesCalled);
      
      cal.incrementMonth();
      assertEquals(3, monthCreatedTimesCalled);
      assertEquals(3, monthChangedTimesCalled);
      
      cal.decrementMonth();
      cal.decrementMonth();
      assertEquals(3, monthCreatedTimesCalled);
      assertEquals(5, monthChangedTimesCalled);
      
      cal.decrementMonth();
      assertEquals(4, monthCreatedTimesCalled);
      assertEquals(6, monthChangedTimesCalled);
      
      cal.decrementMonth();
      assertEquals(5, monthCreatedTimesCalled);
      assertEquals(7, monthChangedTimesCalled);
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
    
    "test creation of days": function () {
      c = new CalendarLogic({now: new Time(2008, 5, 17)});
      assertEquals(new Time(2008, 4, 27).epoch(), c.months[0].days[0][0].time.epoch());
      assertEquals(new Time(2008, 5, 1).epoch(), c.months[0].days[0][4].time.epoch());

      c = new CalendarLogic({now: new Time(2008, 5, 17), firstDayOfWeek: 2});
      assertEquals(new Time(2008, 4, 28).epoch(), c.months[0].days[0][0].time.epoch())
      assertEquals(new Time(2008, 5, 1).epoch(), c.months[0].days[0][3].time.epoch())
    },
    
    "test offdays": function () {
      c = new CalendarLogic({now: new Time(2008, 5, 17)});
      m = c.months[0];
      assertTrue(c.months[0].days[0][0].isOffday)
      assertTrue(c.months[0].days[0][1].isOffday)
      assertTrue(c.months[0].days[0][2].isOffday)
      assertTrue(c.months[0].days[0][3].isOffday)
      assertFalse(c.months[0].days[0][4].isOffday)

      c = new CalendarLogic({now: new Time(2008, 5, 17), firstDayOfWeek: 2})
      m = c.months[0];

      assertTrue(c.months[0].days[0][0].isOffday)
      assertTrue(c.months[0].days[0][1].isOffday)
      assertTrue(c.months[0].days[0][2].isOffday)
      assertFalse(c.months[0].days[0][3].isOffday)
    },
    
    "test isToday": function () {
      var now = new Time();
      c = new CalendarLogic({now: now});
      var dayForToday = c.months[0].days[now.weekOfCurrentMonth() - 1][now.weekday() - 1];
      
      // Testing that it is in fact today
      assertEquals(now.clone().beginningOfDay().epoch(), dayForToday.time.clone().beginningOfDay().epoch())
      // The actual test
      assertTrue(dayForToday.isToday);
      
    }
  });
}());