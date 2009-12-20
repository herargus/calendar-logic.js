(function () {
  TestCase("IntegrationTest", {
    //
    // An abstract example where no actual DOM elements
    // are created.
    "test an implementation": function () {
      var createMonthNumTimesCalled = 0;
      var renderMonthNumTimesCalled = 0;
      var createWeekNumTimesCalled = 0;
      var createCellNumTimesCalled = 0;
      var populateCellNumTimesCalled = 0;
      
      var delegate = function () {
        this.months = [];
      }
      delegate.prototype = {
        createMonth: function () {
          var month = {weeks: []};
          this.months.push(month);

          createMonthNumTimesCalled++;
          return month;
        },
        
        renderMonth: function (month, time) {
          renderMonthNumTimesCalled++;
        },
        
        createWeek: function (month) {
          var week = [];
          month.weeks.push(week);
          
          createWeekNumTimesCalled++;
          return week;
        },
        
        createCell: function (week, time) {
          var cell = {time: time, touches: 0};
          week.push(cell);
          
          createCellNumTimesCalled++;
          return cell;
        },
        
        renderCell: function (cell, isOffday, isToday) {
          cell.touches++;
          populateCellNumTimesCalled++;
        }
      };
      
      var delegateInstance = new delegate();
      var c = new CalendarLogic.MonthCalendar({
        now: new Time(2008, 5, 17),
        firstDayOfWeek: 0,
        delegate: delegateInstance
      });
      c.start();
      
      var weeksInMay = 5;
      var cellsInMay = 7 * weeksInMay;
      assertEquals(1, createMonthNumTimesCalled);
      assertEquals(1, renderMonthNumTimesCalled);
      assertEquals(weeksInMay, createWeekNumTimesCalled);
      assertEquals(cellsInMay, createCellNumTimesCalled);
      assertEquals(cellsInMay, populateCellNumTimesCalled);
      
      
      var weeksInJune = 5;
      var cellsInJune = 7 * weeksInJune;
      
      c.incrementMonth();
      assertEquals(2, createMonthNumTimesCalled);
      assertEquals(2, renderMonthNumTimesCalled);
      assertEquals(weeksInMay + weeksInJune, createWeekNumTimesCalled);
      assertEquals(cellsInMay + cellsInJune, createCellNumTimesCalled);
      assertEquals(cellsInMay + cellsInJune, populateCellNumTimesCalled);
      
      c.decrementMonth();
      assertEquals(2, createMonthNumTimesCalled);
      assertEquals(3, renderMonthNumTimesCalled);
      assertEquals(weeksInMay + weeksInJune, createWeekNumTimesCalled);
      assertEquals(cellsInMay + cellsInJune, createCellNumTimesCalled);
      assertEquals((cellsInMay * 2) + cellsInJune, populateCellNumTimesCalled);
      
      // It should have generated the months
      assertEquals(2, delegateInstance.months.length);
      // It should have generated the weeks
      assertEquals(weeksInMay, delegateInstance.months[0].weeks.length);
      assertEquals(weeksInJune, delegateInstance.months[1].weeks.length);
      // Cell callback should have pushed one cell per day, per week
      assertEquals(7, delegateInstance.months[0].weeks[0].length);
      // It should have been touched twice in may
      assertEquals(2, delegateInstance.months[0].weeks[0][0].touches);
      // And once in june.
      assertEquals(1, delegateInstance.months[1].weeks[1][0].touches);
    }
  })
}())