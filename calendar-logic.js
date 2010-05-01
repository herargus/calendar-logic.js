(function(){
  // The global namespace.
  var CalendarLogic = {};
  this.CalendarLogic = CalendarLogic;
  
  CalendarLogic.MonthCalendar = function (options) {
    if (options.delegate){
      this.delegate = options.delegate;
    } else {
      throw new TypeError("No delegate specified in options.");
    }
    
    this.now              = (options.now || new Time()).beginningOfDay();
    this.firstDayOfWeek   = options.firstDayOfWeek || 0;
    this.dayNames         = options.dayNames ||
                            ["Sunday", "Monday", "Tuesday", "Wednesday",
                            "Thursday", "Friday", "Saturday"];
    this.monthNames       = options.monthNames ||
                            ["January", "February", "March", "April", "May",
                            "June", "July", "August", "September", "October",
                            "November", "December"];
    
    this.today = new Time().beginningOfDay();
    
    this.now.firstDayOfWeek = this.firstDayOfWeek;
    this.today.firstDayOfWeek = this.firstDayOfWeek;
    
    this.months = [];
    this.sortDayNames();
  }
  
  CalendarLogic.MonthCalendar.prototype = {
    start: function () {
      this.months.push(new CalendarLogic.MonthCalendar.Month(this));
      this.currentMonthIndex = 0;
    },
    
    sortDayNames: function () {
      var tail = [],
        counter = this.firstDayOfWeek,
        i;

      while (counter > 0) {
        tail.push(this.dayNames.shift());
        counter--;
      }

      for (i = 0; i < tail.length; i ++) {
        this.dayNames.push(tail[i]);
      }
    },

    incrementMonth: function () {
      this.now.advanceMonths(1);
      this.currentMonthIndex++;
      
      if (!this.months[this.currentMonthIndex]) {
        this.months.push(new CalendarLogic.MonthCalendar.Month(this));
      } else {
        this.render();
      }
    },
    
    decrementMonth: function () {
      this.now.advanceMonths(-1);
      
      if (this.currentMonthIndex === 0) {
        this.months.unshift(new CalendarLogic.MonthCalendar.Month(this));
      } else {
        this.currentMonthIndex--;
        this.render();
      }
    },
    
    render: function () {
      this.months[this.currentMonthIndex].renderMonth();
      this.months[this.currentMonthIndex].renderCells();
    }
  }
  
  CalendarLogic.MonthCalendar.Month = function (monthCalendar) {
    this.monthCalendar = monthCalendar;
    this.cells = [];
    
    this.createCells();
    this.renderCells();
  }
  
  CalendarLogic.MonthCalendar.Month.prototype = {
    createCells: function () {
      var weeksInMonth = this.monthCalendar.now.weeksInMonth(),
        timeInstance = this.monthCalendar.now.clone().firstDayInCalendarMonth(),
        month,
        week, weekNum, currentDay, isOffday, istoday;
      
      this.month = {};
      this.month.time = this.monthCalendar.now.clone().beginningOfMonth();
      this.month.delegateResult = this.monthCalendar.delegate.createMonth(this.month.time);

      this.renderMonth();
      
      month = [];

      weekNum = 0;
      while (weekNum < weeksInMonth) {
        week = this.monthCalendar.delegate.createWeek(this.month.delegateResult, timeInstance);
        currentDay = 0;

        while (currentDay < 7) {
          var cell = this.monthCalendar.delegate.createCell(week, timeInstance.clone());
          this.cells.push({cell: cell, time: timeInstance.clone()});
          currentDay++;
          timeInstance.advanceDays(1);
        }

        weekNum++;
      }      
    },
    
    renderMonth: function () {
      this.monthCalendar.delegate.renderMonth(this.month.delegateResult, this.month.time);
    },
    
    renderCells: function () {
      var i, il, isOffday, isToday;
      for (i = 0, il = this.cells.length; i < il; i++) {
        var cell = this.cells[i];
        isOffday = this.monthCalendar.now.month() != cell.time.month();
        isToday  = this.monthCalendar.today.epoch() == cell.time.epoch();
        
        this.monthCalendar.delegate.renderCell(cell.cell, isOffday, isToday);
      }
    }
  }
})();