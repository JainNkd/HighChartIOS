(function(){
	var _dataiq = namespace('com.datagenic.dataiq');
	var _chart = namespace('com.datagenic.dataiq.widget.chart');

	_chart.getHighchartsYAxisStylingOptions = function(opposite) {
		return $.extend(true, {},
			highchartsYAxisStylingOptions(opposite),
			_dataiq.theme.theme.highchartsYAxisStylingOptions ? _dataiq.theme.theme.highchartsYAxisStylingOptions(opposite) : {}
		);
	};

	_chart.getHighchartsStylingOptions = function(isSeasonal) {
	var highchartsStylingOptions = {
		chart: {
			events: {
				load: function(event) {
					// modify the legend symbol from a rect to a line
					$('.highcharts-legend-item > rect').attr('height', '2').attr('y', '10').attr('rx', '0').attr('ry', '0');
					// gives legend background a border radius
					$('.highcharts-legend > rect').attr('rx', '3').attr('ry', '3');
				}
			},
			backgroundColor: 'transparent',
			animation: {
				duration: 600
			},
			zoomType: 'x'
		},
		credits: {
			enabled: false//Disables highcharts watermark
		},
		legend: {
			maxHeight: 160,
			navigation: {//Options for the paging or navigation appearing when the legend is overflown.
				enabled: false,
				activeColor: '#ffffd3',
				animation: true,
				arrowSize: 12,
				inactiveColor: '#ff623f',
				style: {
					fontWeight: 'bold',
					fontSize: '1px',
					fontFamily: 'blenderbook',
					display: 'none'
				}
			},
			x: -5,
			y: -9,
			floating: true,
			align: 'left',
			layout: 'vertical',
			verticalAlign: 'top',
			enabled : isSeasonal,
			borderWidth: 0,
			padding: 12,
			borderRadius: 10,
			itemMarginTop: 0,
			symbolPadding: 7,
			symbolHeight: 2,
			symbolRadius: 0,
			itemMarginBottom: 0,
			itemStyle: {
				fontFamily: 'Verdana',
				fontSize: '10px'
			},
			itemHoverStyle: {
				color: '#83d2e1'
			},
			itemHiddenStyle: {
				color: '#5d838c'
			}
		},
		navigator: {
			enabled: !isSeasonal,
			handles: {
				backgroundColor: 'rgba(255,255,255,0.01)',
				borderColor: 'rgba(255,255,255,0.01)'
			},
			height: 20,
			margin: 5,
			maskFill: 'rgba(255,255,255, 0.01)',
			outlineWidth: 1,
			series: {
				fillOpacity: 0.0,
				dataGrouping: {
					smoothed: true
				},
				lineWidth: 1.2,
				color: '#313e44',
			},
			xAxis: {
				labels: {
					enabled: false
				}
			},
		},
		scrollbar: {
			enabled: false
		},
		plotOptions: {
			series: {
				fillOpacity: 0.2,
				lineWidth: 1.5,
				animation: false,//Disables animation on creation
				marker: {
					enabled: false,//Disables plotting of points
					lineColor: null//Points use series-specified colour
				}
			}
		},
		rangeSelector: {
			enabled: false
		},
		tooltip: {
			shadow: false,
			crosshairs: {
				width: 1,
				dashStyle: 'dash'
			},
			style: {
				fontSize: '12px',
				padding: '8px'
			},
			valueDecimals: 4,
			xDateFormat: isSeasonal?'%d %b':undefined
		},
		xAxis: {
			startOfWeek: 0,
			type: 'datetime',
			maxZoom: 4 * 24 * 60 * 60 * 1000,
			dateTimeLabelFormats: isSeasonal?{
				month: '%b'
			}:{
				day: '%e %b \'%y',
				week: '%e %b \'%y',
				month: '%e %b \'%y'
			}
		},
	};
		return $.extend(true, {},
			highchartsStylingOptions,
			_dataiq.theme.theme.highchartsStylingOptions || {},
			getDeviceSpecificHighChartStylingOptions()
		);
	};

	var highchartsYAxisStylingOptions = function(opposite) {
		if (undefined === opposite)
			opposite = false;
		return {
			gridLineDashStyle: 'dash',
			title: {
				style: {
					color: '#5d838c',
					fontSize: '14px',
					fontFamily: 'blenderbook',
					letterSpacing: '3px',
					fontWeight: 'normal'
				}
			}
		};
	};

	var getDeviceSpecificHighChartStylingOptions = function() {
		var screenWidth = 0;//TODO

		if (screenWidth < 500)
			return {

			};
		else if (screenWidth < 960)
			return {

			};
		else
			return {};
	};

	namespace.end();
})();
