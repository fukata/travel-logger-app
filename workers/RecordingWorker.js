import * as React from 'react';
import { self } from 'react-native-workers';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';

/* get message from application. String only ! */
self.onmessage = (message) => {
  console.log("received message from app. message=%s", message);
}

/* post message to application. String only ! */
self.postMessage("hello from worker");

BackgroundGeolocation.configure({
  desiredAccuracy: 10,
  stationaryRadius: 50,
  distanceFilter: 50,
  notificationTitle: 'Background tracking',
  notificationText: 'enabled',
  debug: true,
  startOnBoot: false,
  stopOnTerminate:  true,
  locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
  interval: 10000,
  fastestInterval: 5000,
  activitiesInterval: 10000,
  stopOnStillActivity: false,
});

BackgroundGeolocation.on('location', (location) => {
  console.log("location: %o", location);
  self.postMessage(JSON.stringify(location));
});

BackgroundGeolocation.on('error', (error) => {
  console.error("location error: %o", error);
});

BackgroundGeolocation.on('authorization', (status) => {
  console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
  if (status !== BackgroundGeolocation.AUTHORIZED) {
  }
});

BackgroundGeolocation.on('background', () => {
  console.log('[INFO] App is in background');
});

BackgroundGeolocation.on('foreground', () => {
  console.log('[INFO] App is in foreground');
});

BackgroundGeolocation.checkStatus(status => {
  console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
  console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
  console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

  // you don't need to check status before start (this is just the example)
  if (!status.isRunning) {
    BackgroundGeolocation.start(); //triggers start on start event
  }
});
