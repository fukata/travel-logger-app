import * as React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Worker } from 'react-native-workers';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {last_message: ""};
    this.worker = null;
    this.onStartButtonPress = this.onStartButtonPress.bind(this);
    this.onStopButtonPress = this.onStopButtonPress.bind(this);
  }
  onStartButtonPress() {
    console.log("onStartButtonPress");
    if (this.worker === null) {
      console.log("Generate worker...");
      this.worker = new Worker('../workers/RecordingWorker', 'workers.RecordingWorker', 8082);
    }
    this.worker.onmessage = (message) => {
      console.log("received message from worker. message=%s", message);
      this.setState(previousState => {
        previousState.last_message = message;
        return previousState;
      });
    }
    this.worker.postMessage("Start");
  }
  onStopButtonPress() {
    if (this.worker !== null) {
      this.worker.postMessage("Stop");
      /* stop worker */
      this.worker.terminate();
      this.worker = null;
    }
  }
  render() {
    const currentRecordingTime = "0s";
    return (
      <View>
        <Text>Recording Time: {currentRecordingTime}</Text>
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

      </View>
    );
  }
}
