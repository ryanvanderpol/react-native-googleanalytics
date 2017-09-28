[![npm version](https://badge.fury.io/js/react-native-googleanalytics.png)](https://badge.fury.io/js/react-native-googleanalytics)

React Native Google Analytics
=========

Google Analytics integration for use with React Native apps.

Please create issues for any bugs you find or features you would like added.

## Installation

This package depends on [react-native-device-info](https://github.com/rebeccahughes/react-native-device-info), which must be installed and linked.

```
$ npm install react-native-googleanalytics --save
$ npm install react-native-device-info --save
$ react-native link react-native-device-info
```

## Usage

Your React Native app's screen resolution, app name, app ID, app version and multiple other parameters will be automatically resolved and sent with each hit or event.

##### Hits 

Sending page hits or screen hits is done by constructing a new `PageHit` or `ScreenHit` instance and passing it to the `hit` function of an `Analytics` instance.

```
import { Analytics, PageHit } from 'react-native-googleanalytics';

const analytics = new Analytics('UA-XXXXXX-Y');
analytics.hit(new PageHit('Home'));
```

##### Events

You can also send custom events by constructing a new `Event` instance and passing it to the `event` function.  Events have four parameters. 

* Event Category
* Event Action
* Event Label (optional, but recommended)
* Event Value (optional, integer)

These parameters are passed to the `Event` constructor in that order.  

```
import { Analytics, Event } from 'react-native-googleanalytics';

const analytics = new Analytics('UA-XXXXXX-Y');
analytics.event(new Event('Video', 'Play', 'The Big Lebowski', 123));
```

[Learn more](https://support.google.com/analytics/answer/1033068?hl=en) about custom events.

##### Custom Dimensions

[Custom Dimensions](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#cd_) are also supported.  Any custom dimensions set will be sent with each request.

```
import { Analytics, Event } from 'react-native-googleanalytics';

const analytics = new Analytics('UA-XXXXXX-Y');
analytics.addCustomDimension(1, 'TrialAccount');
analytics.addCustomDimension(2, 'Comedy');
analytics.event(new Event('Video', 'Play', 'The Big Lebowski', 123));
```

You can remove custom dimensions as needed.

```
analytics.removeCustomDimension(1);
```

##### Additional Parameters

You can also optionally include any additional [supported parameters](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters) you would like.

```
import { Analytics } from 'react-native-googleanalytics';

// pass in the user ID (uid), referrer (dr) and campaign name (cn) 
const analytics = new Analytics('UA-XXXXXX-Y', { uid: '999', dr: 'github.com', cn: 'get_more_views' });
```


## Debugging

The Google Analytics API is a bit particular.  If you're not seeing Real Time hits in your Analytics console you can turn on debug mode for this package and the exact URL request being sent will be printed to the `console`.

```
import { Analytics, PageHit } from 'react-native-googleanalytics';

const analytics = new Analytics('UA-XXXXXX-Y', null, { debug: true });
analytics.hit(new PageHit('IsItWorking'));
``` 

## Release History

* 1.0.0 Initial release