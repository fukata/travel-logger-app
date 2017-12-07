import * as React from 'react';
import { StyleSheet, Text, View, Button, ScrollView, TextInput } from 'react-native';
import SInfo from 'react-native-sensitive-info';

const MY_SETTING_SP_NAME = "my_settings";
const SINFO_OPTIONS = {sharedPreferencesName: MY_SETTING_SP_NAME}

const styles = StyleSheet.create({
  fieldContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fieldLabel: {
    flex: 1,
    textAlign: 'left',
  },
  fieldValue: {
    flex: 1,
  },
  fieldNumeric: {
    textAlign: 'right',
  },
  statusMessage: {
    color: 'green',
  },
});

export default class Settings extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Settings',
  };
  constructor(props) {
    super(props);
    this.state = {};
    this.loadSettings();
  }
  async loadSettings() {
    this.state.desired_accuracy = (await SInfo.getItem('desired_accuracy', SINFO_OPTIONS)) || '10';
    this.state.stationary_radius = (await SInfo.getItem('stationary_radius', SINFO_OPTIONS)) || '50';
    this.state.distance_filter = (await SInfo.getItem('distance_filter', SINFO_OPTIONS)) || '50';
    this.state.interval = (await SInfo.getItem('interval', SINFO_OPTIONS)) || '10000';
    this.state.fastest_interval = (await SInfo.getItem('fastest_interval', SINFO_OPTIONS)) || '5000';
    this.state.activities_interval = (await SInfo.getItem('activities_interval', SINFO_OPTIONS)) || '10000';
    this.setState(this.state);
  }
  async _onSaveButtonPress() {
    console.log("_onSaveButtonPress");
    await SInfo.setItem('desired_accuracy', this.state.desired_accuracy, SINFO_OPTIONS);
    await SInfo.setItem('stationary_radius', this.state.stationary_radius, SINFO_OPTIONS);
    await SInfo.setItem('distance_filter', this.state.distance_filter, SINFO_OPTIONS);
    await SInfo.setItem('interval', this.state.interval, SINFO_OPTIONS);
    await SInfo.setItem('fastest_interval', this.state.fastest_interval, SINFO_OPTIONS);
    await SInfo.setItem('activities_interval', this.state.activities_interval, SINFO_OPTIONS);
    this.state.status_message = "Save Successful";
    this.loadSettings()
      .then(() => {
        setTimeout(() => {
          this.state.status_message = "";
          this.setState(this.state);
        }, 5000);
      });
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          {/* Desired Accuracy */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Desired Accuracy</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({desired_accuracy: text})}
              value={this.state.desired_accuracy}
            />
          </View>

          {/* Stationary Radius */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Stationary Radius</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({stationary_radius: text})}
              value={this.state.stationary_radius}
            />
          </View>

          {/* Distance Filter */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Distance Filter</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({distance_filter: text})}
              value={this.state.distance_filter}
            />
          </View>

          {/* Interval */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Interval</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({interval: text})}
              value={this.state.interval}
            />
          </View>

          {/* Fastest Interval */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Fastest Interval</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({fastest_interval: text})}
              value={this.state.fastest_interval}
            />
          </View>

          {/* Activities Interval */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Activities Interval</Text>
            <TextInput
              style={[styles.fieldValue, styles.fieldNumeric]}
              keyboardType={'numeric'}
              onChangeText={(text) => this.setState({activities_interval: text})}
              value={this.state.activities_interval}
            />
          </View>

          <Text style={styles.statusMessage}>{this.state.status_message}</Text>
          <Button
            title="Save"
            onPress={this._onSaveButtonPress.bind(this)}
          />
        </ScrollView>
      </View>
    );
  }
};
