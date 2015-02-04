//
//  ChartData.h
//  HighChartIOS
//
//  Created by Naveen Kumar Dungarwal on 2/4/15.
//  Copyright (c) 2015 Naveen Kumar Dungarwal. All rights reserved.
//

#import <Foundation/Foundation.h>

@interface ChartData : NSObject
{
    NSString *seriesName,*chartDataJson;
}

@property(nonatomic,strong)NSString *seriesName,*chartDataJson;

-(ChartData*)initializeChartSeries1;
-(ChartData*)initializeChartSeries2;
-(ChartData*)initializeChartSeries3;
@end
