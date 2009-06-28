(function(){
	var LowlevelCalendar = function(options){
		options 								= options || {};
		options.now							= options.now || new Time();
		options.firstDayOfWeek 	= options.firstDayOfWeek || 1;
		options.monthNames 			= options.monthNames ||
															["January", "February", "March", "April", "May", "June",
															"July", "August", "September", "October", "November", "December"];
		options.dayNames				= options.dayNames ||
															["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
		this.options            = options;
		this.sortDayNames();
		this.options.now.beginningOfDay();
		
		this.today              = new Time();
		this.today.firstDayOfWeek = options.firstDayOfWeek;
		this.options.now.firstDayOfWeek = options.firstDayOfWeek;
		
		this.months             = [];
		this.months.push(new LowlevelCalendar.Month(this, this.options.now))
		this.currentMonthindex  = 0;
	}
	
  // An ordered version of options.dayNames.
	LowlevelCalendar.prototype.sortDayNames = function(){
		var tail      = [];
		var counter   = this.options.firstDayOfWeek;
		
		while (counter > 1) {
			tail.push(this.options.dayNames.shift());
			counter--;
		}
    
    for (var i = 0; i < tail.length; i ++) {
      this.options.dayNames.push(tail[i]);
    }
	}
	
	LowlevelCalendar.prototype.decrementMonth = function(){
	  
	}
	
	LowlevelCalendar.prototype.incrementMonth = function(){
		
	}
	
	LowlevelCalendar.Month = function(calendar, time){
		this.calendar   = calendar;
		this.time       = time.clone();
		this.today      = time.beginningOfDay();
		this.cells      = [];
		
		this.generateCells();
	}
	
	LowlevelCalendar.Month.prototype.generateCells = function(){
		var week          = 0;
		var timeInstance  = this.time.clone().firstDayInCalendarMonth()
		timeInstance.advanceDays(-1);
		
		var weeksInMonth = this.time.weeksInMonth()
		while (week < weeksInMonth) {
			var cellsThisWeek   = [];
			var day             = 0;
			
			while (day < 7) {
				var cell = new LowlevelCalendar.Month.Cell(this, timeInstance.advanceDays(1));
				cellsThisWeek.push(cell);
				day++;
			}
			this.cells.push(cellsThisWeek);
			week++;
		}
	}
	
	LowlevelCalendar.Month.Cell = function(month, time){
	  this.time       = time.clone();
		this.isOffday   = month.time.month() != time.month();
		this.isToday    = month.calendar.today.epoch() == time.epoch();
	}
	
	LowlevelCalendar.weeek = function() {
	  // Gief!
	}
	
	window.LowlevelCalendar = LowlevelCalendar;
})();