import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './components/Home';
import LocationLogs from './components/LocationLogs';
import Settings from './components/Settings';
import { TabNavigator } from 'react-navigation';

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
    }
  }
});

export default App;
