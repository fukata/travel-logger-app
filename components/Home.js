import * as React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ScrollView } from 'react-native';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import Moment from 'moment';
var RNFS = require('react-native-fs');
import SInfo from 'react-native-sensitive-info';

const CACHE_MAX_LOCATION_LOG_NUM = 100;
const MY_SETTING_SP_NAME = "my_settings";
const SINFO_OPTIONS = {sharedPreferencesName: MY_SETTING_SP_NAME}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonsContainer: {
    flex: 0.1,
    flexDirection: 'row',
  },
  startButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1d85f4',
  },
  stopButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ff1e2d',
  },
  buttonText: {
    color: 'white',
  },
  consoleContainer: {
    backgroundColor:"#000",
  },
  console: {
    color:"#fff",
  },
});

export default class Home extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
  };

  constructor(props) {
    super(props);
    this.state = {last_message: "", location_logs: []};
    this.onStartButtonPress = this.onStartButtonPress.bind(this);
    this.onStopButtonPress = this.onStopButtonPress.bind(this);
  }
  componentDidMount() {
    BackgroundGeolocation.on('location', (location) => {
      console.log("location: %o", location);
      var location_log = Moment(Date.now()).format() + "\t" + JSON.stringify(location);
      var location_logs = this.state.location_logs;
      location_logs.unshift(location_log);
      if (location_logs.length > CACHE_MAX_LOCATION_LOG_NUM) {
        location_logs.pop();
      }
      this.setState((ps) => {
        ps.last_message = location_log;
        ps.location_logs = location_logs;
        return ps;
      });

      if (this.state.log_file_path) {
        RNFS.appendFile(this.state.log_file_path, location_log + "\n");
      }
    });

    BackgroundGeolocation.on('error', (error) => {
      console.error("location error: %o", error);
      this.setState((ps) => {
        ps.last_message = "ERROR: " + error;
        return ps;
      })
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
    BackgroundGeolocation.stop();
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
  async configureBackgroundGeolocation() {
    const desired_accuracy = await SInfo.getItem('desired_accuracy', SINFO_OPTIONS);
    const stationary_radius = await SInfo.getItem('stationary_radius', SINFO_OPTIONS);
    const distance_filter = await SInfo.getItem('distance_filter', SINFO_OPTIONS);
    const interval = await SInfo.getItem('interval', SINFO_OPTIONS);
    const fastest_interval = await SInfo.getItem('fastest_interval', SINFO_OPTIONS);
    const activities_interval = await SInfo.getItem('activities_interval', SINFO_OPTIONS);
    console.log(desired_accuracy, stationary_radius, distance_filter, interval, fastest_interval, activities_interval);

    BackgroundGeolocation.configure({
      desiredAccuracy: Number.parseInt(desired_accuracy, 10) || 10,
      stationaryRadius: Number.parseInt(stationary_radius, 10) || 50,
      distanceFilter: Number.parseInt(distance_filter, 10) || 50,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: false,
      startOnBoot: false,
      stopOnTerminate:  false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: Number.parseInt(interval, 10) || 10000,
      fastestInterval: Number.parseInt(fastest_interval, 10) || 5000,
      activitiesInterval: Number.parseInt(activities_interval, 10) || 10000,
      stopOnStillActivity: false,
    });
  }
  onStartButtonPress() {
    console.log("onStartButtonPress");
    if (this.state.recording) {
      console.log("Already started recording");
      return;
    }

    this.configureBackgroundGeolocation()
      .then(() => {
        const log_file_name = Moment(Date.now()).utc().format("YYYYMMDD_HHmmss") + ".location.log";
        const log_file_path = RNFS.ExternalStorageDirectoryPath + "/TravelLogger/" + log_file_name;
        console.log("log_file_name: ", log_file_name);
        console.log("log_file_path: ", log_file_path);
        this.setState((ps) => {
          ps.last_message = "Waiting...";
          ps.recording = true;
          ps.log_file_name = log_file_name;
          ps.log_file_path = log_file_path;
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
      })
  }
  onStopButtonPress() {
    console.log("onStopButtonPress");
    BackgroundGeolocation.stop();
    this.setState((ps) => {
      ps.last_message = "STOPPED";
      ps.recording = false;
      ps.log_file_name = "";
      ps.log_file_path = "";
      return ps;
    })
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity onPress={this.onStartButtonPress} style={styles.startButton}>
            <Text style={styles.buttonText}>START</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.onStopButtonPress} style={styles.stopButton}>
            <Text style={styles.buttonText}>STOP</Text>
          </TouchableOpacity>
        </View>

        <Text>STATUS: {this.state.last_message}</Text>
        <ScrollView style={styles.consoleContainer}>
          <Text style={styles.console}>{this.state.location_logs.join("\n")}</Text>
        </ScrollView>
      </View>
    );
  }
}
