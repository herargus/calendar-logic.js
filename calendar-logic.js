(function(){
	var CalendarLogic = function(options){
		options 								= options || {};
		options.now							= options.now || new Time();
		options.firstDayOfWeek 	= options.firstDayOfWeek || 1;
		options.cellCallback    = options.cellCallback || function () {};
		options.monthNames 			= options.monthNames ||
															["January", "February", "March", "April", "May", "June",
															"July", "August", "September", "October", "November", "December"];
		options.dayNames				= options.dayNames ||
															["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.options            = options;
		this.sortDayNames();
		this.options.now.beginningOfDay();
		
		this.today              = new Time().beginningOfDay();
		this.today.firstDayOfWeek = options.firstDayOfWeek;
		this.options.now.firstDayOfWeek = options.firstDayOfWeek;
		
		this.months             = [];
		this.months.push(new CalendarLogic.Month(this));
		this.currentMonthIndex  = 0;
	}
	
	CalendarLogic.prototype = {
	  sortDayNames: function () {
	    var tail      = [];
  		var counter   = this.options.firstDayOfWeek;

  		while (counter > 1) {
  			tail.push(this.options.dayNames.shift());
  			counter--;
  		}

      for (var i = 0; i < tail.length; i ++) {
        this.options.dayNames.push(tail[i]);
      }
	  },
	  
	  currentMonth: function () {
	    return this.months[this.currentMonthIndex];
	  },
	  
	  incrementMonth: function () {
	    this.options.now.advanceMonths(1);
  		this.currentMonthIndex++;
  		
  		if (!this.months[this.currentMonthIndex]) {
  		  this.months.push(new CalendarLogic.Month(this));
  		}
	  },
	  
	  decrementMonth: function () {
	    this.options.now.advanceMonths(-1)
	    
	    if (this.currentMonthIndex == 0) {
	      this.months.unshift(new CalendarLogic.Month(this));
	    } else {
	      this.currentMonthIndex--;
	    }
	  },
	}
	
	CalendarLogic.Month = function(calendar){
		this.calendar   = calendar;
		this.time       = calendar.options.now.clone();
		this.today      = this.time.clone().beginningOfDay();
		this.cells      = [];
		
		this.generateCells();
	}
	
	CalendarLogic.Month.prototype = {
	  generateCells: function () {
	    var week          = 0;
  		var timeInstance  = this.time.clone().firstDayInCalendarMonth()
  		timeInstance.advanceDays(-1);

  		var weeksInMonth = this.time.weeksInMonth()
  		while (week < weeksInMonth) {
  			var cellsThisWeek   = [];
  			var day             = 0;

  			while (day < 7) {
  			  timeInstance.advanceDays(1);
  				var cell = new CalendarLogic.Month.Cell(this, timeInstance);
  				this.calendar.options.cellCallback(timeInstance);
  				cellsThisWeek.push(cell);
  				day++;
  			}
  			this.cells.push(cellsThisWeek);
  			week++;
  		}
	  }
	}
	
	CalendarLogic.Month.Cell = function(month, time){
	  this.time       = time.clone();
		this.isOffday   = month.time.month() != time.month();
		this.isToday    = month.calendar.today.epoch() == time.epoch();
	}
	
	window.CalendarLogic = CalendarLogic;
})();