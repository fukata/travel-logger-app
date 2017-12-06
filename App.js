import * as React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import LocationLogs from './components/LocationLogs';
import Settings from './components/Settings';
import { TabNavigator } from 'react-navigation';
import { setCustomText } from 'react-native-global-props';

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

export default App;
