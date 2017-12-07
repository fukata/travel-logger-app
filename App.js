import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import LocationLogs from './components/LocationLogs';
import Settings from './components/Settings';
import { TabNavigator } from 'react-navigation';
import { setCustomText } from 'react-native-global-props';
import SInfo from 'react-native-sensitive-info';

var RNFS = require('react-native-fs');
RNFS.mkdir(RNFS.ExternalStorageDirectoryPath + "/TravelLogger/");

const App = TabNavigator({
  Home: { screen: Home },
  LocationLogs: { screen: LocationLogs },
  Settings: { screen: Settings },
}, {
  tabBarPosition: 'bottom',
  animationEnabled: true,
  swipeEnabled: true,
  tabBarOptions: {
    activeTintColor: '#ffffff',
    style: {
      backgroundColor: '#2f2f2f',
    },
  },
});

const customTextProps = {
  style: {
    fontFamily: Platform.OS === 'ios' ? 'HelveticaNeue' : 'monospace',
  }
};

setCustomText(customTextProps);

// save default settings
(async () => {
  const MY_SETTING_SP_NAME = "my_settings";
  const SINFO_OPTIONS = {sharedPreferencesName: MY_SETTING_SP_NAME};

  console.log("setting desired_accuracy");
  const desired_accuracy = await SInfo.getItem('desired_accuracy', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(desired_accuracy, 10))) {
    console.log("set desired_accuracy default setting");
    await SInfo.setItem('desired_accuracy', '10', SINFO_OPTIONS);
  }

  console.log("setting stationary_radius");
  const stationary_radius = await SInfo.getItem('stationary_radius', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(stationary_radius, 10))) {
    console.log("set stationary_radius default setting");
    await SInfo.setItem('stationary_radius', '50', SINFO_OPTIONS);
  }

  console.log("setting distance_filter");
  const distance_filter = await SInfo.getItem('distance_filter', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(distance_filter, 10))) {
    console.log("set distance_filter default setting");
    await SInfo.setItem('distance_filter', '50', SINFO_OPTIONS);
  }

  console.log("setting interval");
  const interval = await SInfo.getItem('interval', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(interval, 10))) {
    console.log("set interval default setting");
    await SInfo.setItem('interval', '10000', SINFO_OPTIONS);
  }

  console.log("setting fastest_interval");
  const fastest_interval = await SInfo.getItem('fastest_interval', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(fastest_interval, 10))) {
    console.log("set fastest_interval default setting");
    await SInfo.setItem('fastest_interval', '5000', SINFO_OPTIONS);
  }

  console.log("setting activities_interval");
  const activities_interval = await SInfo.getItem('activities_interval', SINFO_OPTIONS);
  if (isNaN(Number.parseInt(activities_interval, 10))) {
    console.log("set activities_interval default setting");
    await SInfo.setItem('activities_interval', '10000', SINFO_OPTIONS);
  }
})();

export default App;
