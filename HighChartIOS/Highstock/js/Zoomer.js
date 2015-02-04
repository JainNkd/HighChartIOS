(function(){
	var _dataiq = namespace('com.datagenic.dataiq');
	var _chart = namespace('com.datagenic.dataiq.widget.chart');

	function Zoomer(parentChart) {
		this.parentChart = parentChart;
		var that = this;
		this.gui = $('<div>').addClass('zoom-picker').hide();
		this.datePickerButtonsRow = $('<div>').addClass('date-picker-buttons row').appendTo(this.gui);
		this.startDateButton = $('<button>').addClass('start-date button').appendTo(this.datePickerButtonsRow).
			click(function() {
				that._launchDatePicker('min');
			});
		this.endDateButton = $('<button>').addClass('end-date button').appendTo(this.datePickerButtonsRow).
			click(function() {
				that._launchDatePicker('max');
			});
		this.quickZoomButtonsRow = $('<div>').addClass('quick-zoom-buttons row').appendTo(this.gui);

		this._addQuickZoomButton('1M', 'one-month', 365.2425/12 * 24 * 60 * 60 * 1000);
		this._addQuickZoomButton('3M', 'three-months', 365.2425/4 * 24 * 60 * 60 * 1000);
		this._addQuickZoomButton('6M', 'six-months', 365.2425/2 * 24 * 60 * 60 * 1000);
		this._addQuickZoomButton('YTD', 'year-to-date', 'ytd');
		this._addQuickZoomButton('1Y', 'one-year', 365.2425 * 24 * 60 * 60 * 1000);
		this._addQuickZoomButton('5Y', 'five-years', 5 * 365.2425 * 24 * 60 * 60 * 1000);
		this._addQuickZoomButton('All', 'eternity', 'all');

		this.updateGui();
	}
	_chart.Zoomer = Zoomer;

	Zoomer.prototype.getExtremes = function(args) {
		var that = this;

		if (!args) return $.when(this.parentChart.hasSeries(), this.parentChart.hasCurve(), this.parentChart.getEarliestOnDate()).
		then(function(hasSeries, hasCurve, earliestOnDate) {
			var args = {
				earliestOnDate: earliestOnDate,
				hasCurve: hasCurve,
				hasSeries: hasSeries,
				highchartsExtremes: that._getHighchartsXAxis().getExtremes(),
				max: that.max,
				min: that.min,
				now: _.now(),
				range: that.range,
				seasonal: that.parentChart.seasonal
			};
			return that.getExtremes(args);
		});

		var cacheKey = JSON.stringify(_.omit(args, 'now'));
		if (this._extremesCacheKey === cacheKey) return this._extremes;
		this._extremesCacheKey = cacheKey;
		this._extremes = Zoomer.calcExtremes(args);
		this.updateGui();
		return this._extremes;
	}

	Zoomer.prototype.setExtremes = function(extremes, skipSave) {
		delete this.range;
		if (extremes.max) this.max = extremes.max;
		if (extremes.min) this.min = extremes.min;
		this.updateGui();
		this.updateModel();
		if (!skipSave) this.parentChart.save();
	}

	Zoomer.prototype.setDateRange = function(range, skipSave) {
		this.range = range;
		delete this.max;
		delete this.min;
		this.updateGui();
		this.updateModel();
		if (!skipSave) this.parentChart.save();
	}

	Zoomer.prototype.updateGui = function() {
		var extremes = this._extremes;
		if (!extremes || !extremes.min || !extremes.max) {
			this.datePickerButtonsRow.children().text('???');
			return this.gui;
		}
		this._getHighchartsXAxis().setExtremes(extremes.min, extremes.max);

		if (this.parentChart.seasonal || this.parentChart._hasSeries == false || this.parentChart.renderer === this.parentChart.tableRenderer) {
			this.gui.hide();
			return this.gui;
		}

		this.gui.show();
		var minStr = new Date(extremes.min).toISOString();
		var maxStr = new Date(extremes.max).toISOString();
		this.startDateButton.text(minStr.slice(0, 10)).prop('title', minStr);
		this.endDateButton.  text(maxStr.slice(0, 10)).prop('title', maxStr);
		return this.gui;
	}

	Zoomer.prototype.updateModel = function() {
		var that = this;
		return $.when(this.getExtremes()).
		then(function() {
			that.updateGui();
		});
	}

	Zoomer.prototype.serialise = function() {
		return {
			min: this.min,
			max: this.max,
			range: this.range
		};
	};

	Zoomer.prototype.deserialise = function(serial) {
		_.extend(this, serial);
	};

	Zoomer.prototype._getHighchartsXAxis = function() {
		return this.parentChart.chartRenderer.highchart && this.parentChart.chartRenderer.highchart.xAxis[0];
	};

	Zoomer.prototype._addQuickZoomButton = function(text, cssClass, dateRange) {
		var that = this;
		var quickZoomButton = $('<button>').addClass(cssClass).addClass('quick-zoom button').appendTo(this.quickZoomButtonsRow)
			.text(text)
			.click(function() {
				that.quickZoomButtonsRow.children().removeClass('selected');
				quickZoomButton.addClass('selected');
				that.setDateRange(dateRange);
			});
	};

	Zoomer.prototype._launchDatePicker = function(extreme) {
		var that = this;
		var oppositeExtreme = extreme==='max'?'min':'max';
		var extremes = this._extremes;
		var datePickerOptions = {
			defaultDate: new Date(extremes[extreme]),
			onSelect: function() {
				extremes[extreme] = datePicker.datepicker('getDate').getTime();
				that.setExtremes(extremes);
				datePicker.finalise();
			}
		};
		datePickerOptions[oppositeExtreme+'Date'] = new Date(extremes[oppositeExtreme]);
		var datePicker = new _dataiq.DatePicker(datePickerOptions);
	}

	// Parameters: hasSeries, hasCurve, earliestOnDate, now, highchartsExtremes, min, max, range, seasonal
	Zoomer.calcExtremes = function(args) {
		if (args.seasonal || !args.hasSeries || args.range === 'all')
			return {
				min: _.min([args.highchartsExtremes.dataMin, args.now]),
				max: _.max([args.highchartsExtremes.dataMax, args.now])
			};
		if (!args.range)
			return {
				min: args.min || args.highchartsExtremes.min,
				max: args.max || args.highchartsExtremes.max
			};
		if (args.range === 'ytd') {
			var year = new Date(args.now).getFullYear();
			var yearStart = new Date(0).setFullYear(year, 0, 1);
			return {
				min: yearStart,
				max: _.max([args.highchartsExtremes.dataMax, args.now])
			};
		}
		if (_.isFinite(args.range)) {
			var pivot = args.hasCurve ? args.earliestOnDate : args.now;
			return {
				min: pivot-args.range,
				max: _.max([args.highchartsExtremes.dataMax, args.now])
			};
		}
		_dataiq.error(args);
	}

	namespace.end();
})();
