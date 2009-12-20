(function () {
  TestCase("CalendarLogicTest", {
    "test sorting day names": function () {
      
    },
    
    "test offday and today booleans when rendering cells": function () {
      
    }
  });
  
  TestCase("CalendarLogicDelegateTest", {
    newCal: function (delegate) {
      var baseDelegate = {
        createMonth: function () {},
        renderMonth: function () {},
        createWeek: function () {},
        createCell: function () {},
        renderCell: function () {}
      };
      
      for (var key in delegate) {
        baseDelegate[key] = delegate[key];
      }
      
      var c = new CalendarLogic.MonthCalendar({
        delegate: baseDelegate,
        now: new Time(2008, 11, 1)
      });
      
      c.start();
      return c;
    },
    
    "test create month": function () {
      expectAsserts(2);
      var c = this.newCal({
        createMonth: function (time) {
          assertEquals(new Time(2008, 11, 1).epoch(), time.epoch());
          return "anything";
        }
      });

      assertEquals("anything", c.months[0].month.delegateResult);
    },
    
    "test renderMonth": function () {
      expectAsserts(2);
      this.newCal({
        createMonth: function() {
          return "anything";
        },
        renderMonth: function (month, time) {
          assertEquals("anything", month);
          // Should be first day of actual month, not first day in calendar month.
          assertEquals(new Time(2008, 11, 1).epoch(), time.epoch());
        }
      });
    },
    
    "test various renderMonth monthName edge cases": function () {
      
    },
    
    "test create week": function () {
      expectAsserts(6 * 2); // 6 weeks, two asserts per week
      this.newCal({
        createMonth: function () {
          return "anything";
        },
        createWeek: function (month, time) {
          assertEquals("anything", month);
          assertTrue(time instanceof Time);
        }
      });
    },
    
    "test create cell": function () {
      expectAsserts(42 * 2 + 2); // 42 days, two asserts per day. Two extra asserts at bottom.
      var c = this.newCal({
        createWeek: function () {
          return "anything";
        },
        
        createCell: function (week, time) {
          assertEquals("anything", week);
          assertTrue(time instanceof Time);
          return "something";
        }
      });
      
      assertEquals("something", c.months[0].cells[0].cell);
      assertEquals(new Time(2008, 11, 1).firstDayInCalendarMonth().epoch(), c.months[0].cells[0].time.epoch());
    },
    
    "test renderCell": function () {
      expectAsserts(42 * 3) // 42 days, three asserts
      this.newCal({
        createCell: function () {
          return "anything";
        },
        renderCell: function (cell, isOffday, isToday) {
          assertEquals("boolean", typeof(isOffday));
          assertEquals("boolean", typeof(isToday));
          assertEquals("anything", cell);
        }
      });
    }
  });
}());