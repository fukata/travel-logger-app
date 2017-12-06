import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default class Settings extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
  };
  render() {
    return (
      <View>
        <Text>Settings</Text>
      </View>
    );
  }
};
