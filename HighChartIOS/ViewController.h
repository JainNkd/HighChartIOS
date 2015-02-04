//
//  ViewController.h
//  HighChartIOS
//
//  Created by Naveen Kumar Dungarwal on 2/4/15.
//  Copyright (c) 2015 Naveen Kumar Dungarwal. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ViewController : UIViewController
{
    BOOL isShowingLandscapeView;
    NSString *chartType;
    NSArray *chartArr;
    CGFloat chartWidth;
    CGFloat chartHeight;
}


@property (nonatomic, retain) NSMutableString *htmlContent;
@property (nonatomic, retain) NSMutableString *javascriptPath;
@property (nonatomic, retain) NSMutableString *chartData;



@property (weak, nonatomic) IBOutlet UIWebView *chartWebView;

@end

