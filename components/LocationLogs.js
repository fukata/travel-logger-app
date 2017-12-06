import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class LocationLogs extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Location Logs',
  };
  render() {
    return (
      <View>
        <Text>Location Logs</Text>
      </View>
    );
  }
};
