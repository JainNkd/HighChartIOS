//
//  ViewController.m
//  HighChartIOS
//
//  Created by Naveen Kumar Dungarwal on 2/4/15.
//  Copyright (c) 2015 Naveen Kumar Dungarwal. All rights reserved.
//

#import "ViewController.h"
#import "ChartData.h"

@interface ViewController ()

@end

@implementation ViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.title = @"High Chart";
    
    chartWidth = self.view.frame.size.width;
    chartHeight = self.view.frame.size.height-70;
    
//    chartHeight = self.view.frame.size.width-70;
//    chartWidth = self.view.frame.size.height;
    
    //Create chart lines
    ChartData *series1 = [[ChartData alloc]initializeChartSeries1];
    ChartData *series2 = [[ChartData alloc]initializeChartSeries2];
    ChartData *series3 = [[ChartData alloc]initializeChartSeries3];
    
    chartArr = [[NSArray alloc]initWithObjects:series1,series2,series3, nil];
    
    //Chart Type :  'line', 'spline', 'area', 'areaspline', 'column'
    chartType = @"spline";
    [self createSplineChart];
}

//Orientation support


- (void)awakeFromNib
{
    isShowingLandscapeView = NO;
    [[UIDevice currentDevice] beginGeneratingDeviceOrientationNotifications];
    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(orientationChanged:)
                                                 name:UIDeviceOrientationDidChangeNotification
                                               object:nil];
}

- (void)orientationChanged:(NSNotification *)notification
{
    UIDeviceOrientation deviceOrientation = [UIDevice currentDevice].orientation;
    if (UIDeviceOrientationIsLandscape(deviceOrientation) &&
        !isShowingLandscapeView)
    {
        [self removeChart];
        
        chartHeight = self.view.frame.size.width-40;
        chartWidth = self.view.frame.size.height;
        
        isShowingLandscapeView = YES;
        [self createSplineChart];
    }
    else if ((deviceOrientation == UIDeviceOrientationPortrait) &&
             isShowingLandscapeView)
    {
        [self removeChart];
        
        chartHeight = self.view.frame.size.width-70;
        chartWidth = self.view.frame.size.height;
        isShowingLandscapeView = NO;
        [self createSplineChart];
    }
}


- (NSUInteger)supportedInterfaceOrientations
{
    //return (UIInterfaceOrientationMaskAll);
    return (UIInterfaceOrientationMaskPortrait | UIInterfaceOrientationMaskLandscapeLeft | UIInterfaceOrientationMaskLandscapeRight | UIInterfaceOrientationMaskPortraitUpsideDown);
}

-(BOOL)shouldAutorotate
{
    return YES;
}

#pragma mark Chart Setup

- (void)displayDataError
{
    NSMutableString *displayErrorHTML = [NSMutableString stringWithString:@"<html><head>"];
    [displayErrorHTML appendString:@"<title>Chart Error</title>"];
    [displayErrorHTML appendString:@"</head><body>"];
    [displayErrorHTML appendString:@"<p>Unable to plot chart.<br/>Error receiving data.</p>"];
    [displayErrorHTML appendString:@"</body></html>"];
    
    [self.chartWebView loadHTMLString:displayErrorHTML baseURL:nil];
}

- (void)plotChart
{
    //    NSURL *baseURL = [NSURL fileURLWithPath:[NSString stringWithFormat:@"%@", [[NSBundle mainBundle] bundlePath]]];
    self.chartWebView.hidden = NO;
    NSString *baseURL = [NSString stringWithFormat:@"%@/Highstock/", [[NSBundle mainBundle] bundlePath]];
    [self.chartWebView loadHTMLString:self.htmlContent baseURL:[NSURL URLWithString:baseURL]];
}

- (void)removeChart
{
    NSString *baseURL = [NSString stringWithFormat:@"%@/Highstock1/", [[NSBundle mainBundle] bundlePath]];
    [self.chartWebView loadHTMLString:self.htmlContent baseURL:[NSURL URLWithString:baseURL]];
}



//SPline chart
-(void)createSplineChart
{
    if(chartType.length ==0)
        chartType = @"line";
    
    NSMutableString *seriesStr = [[NSMutableString alloc]init];
    int i=0;
    for(ChartData *chartData in chartArr)
    {
        [seriesStr appendString:[NSString stringWithFormat:@"{name:'%@',data:%@,type:'%@',threshold : null,tooltip: {valueDecimals: 2},fillColor : {linearGradient : {x1: 0,y1: 0,x2: 0,y2: 1},stops : [[0, Highcharts.getOptions().colors[%d]],[1, Highcharts.Color(Highcharts.getOptions().colors[%d]).setOpacity(0).get('rgba')]]}},",chartData.seriesName,chartData.chartDataJson,chartType,i,i]];
        i++;
    }
    
    self.htmlContent = [NSMutableString stringWithFormat:@"%@", @"<html><head>"];
    [self.htmlContent appendString:@"<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js'></script>"];
    [self.htmlContent appendString:@"<script type='text/javascript'>$(function () {$('#container').highcharts('StockChart', {rangeSelector: {inputEnabled: $('#container').width() > 480,selected: 1},title: {text: ''},"];
    
    [self.htmlContent appendString:[NSString stringWithFormat:@"series: [%@]});});</script>",seriesStr]];
    
    [self.htmlContent appendString:[NSString stringWithFormat:
                                    @"</head><body><script src='js/highstock.js'></script><div id='container' style='height: %fpx ; max-width: %fpx'></div>",chartHeight,
                                    chartWidth]];
    
    [self.htmlContent appendString:@"</body></html>"];
    
    // Draw the actual chart.
    dispatch_async(dispatch_get_main_queue()
                   , ^(void) {
                       [self plotChart];
                   });
    
}


- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

@end
