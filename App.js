import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Router, Stack, Scene } from 'react-native-router-flux';
import Home from './components/Home';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Stack key="root">
          <Scene key="home" initial component={Home} title="Travel Logger" />
        </Stack>
      </Router>
    );
  }
}
