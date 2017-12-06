import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import Moment from 'moment';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {last_message: "", location_logs: []};
    this.onStartButtonPress = this.onStartButtonPress.bind(this);
    this.onStopButtonPress = this.onStopButtonPress.bind(this);
  }
  componentDidMount() {
    BackgroundGeolocation.configure({
      desiredAccuracy: 10,
      stationaryRadius: 50,
      distanceFilter: 50,
      //notificationTitle: 'Background tracking',
      //notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate:  false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 10000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      stopOnStillActivity: false,
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log("location: %o", location);
      var location_log = Moment(Date.now()).format() + "\t" + JSON.stringify(location);
      var location_logs = this.state.location_logs;
      location_logs.unshift(location_log);
      if (location_logs.length > 10) {
        location_logs.pop();
      }
      this.setState((ps) => {
        ps.last_message = location_log;
        ps.location_logs = location_logs;
        return ps;
      })
    });

    BackgroundGeolocation.on('error', (error) => {
      console.error("location error: %o", error);
    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        this.setState((ps) => {
          ps.last_message = "NOT AUTHORIZED";
          return ps;
        })
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });
  }
  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
    BackgroundGeolocation.stop();
  }
  onStartButtonPress() {
    console.log("onStartButtonPress");
    this.setState((ps) => {
      ps.last_message = "Waiting...";
      return ps;
    })
    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        BackgroundGeolocation.start(); //triggers start on start event
      }
    });
  }
  onStopButtonPress() {
    console.log("onStopButtonPress");
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
    BackgroundGeolocation.stop();
    this.setState((ps) => {
      ps.last_message = "STOPPED";
      return ps;
    })

  }
  render() {
    return (
      <View>
        <Button
          onPress={this.onStartButtonPress}
          title="Start"
          color="#1d85f4"
          />
        <Button
          onPress={this.onStopButtonPress}
          title="Stop"
          color="#ff1e2d"
          />
        <Text>Last Message: {this.state.last_message}</Text>
        <Text style={{color:"#fff", backgroundColor:"#000"}}>{this.state.location_logs.join("\n")}</Text>
      </View>
    );
  }
}
