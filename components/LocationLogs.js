import * as React from 'react';
import { StyleSheet, Text, View, Button, ListView, RefreshControl } from 'react-native';
var RNFS = require('react-native-fs');
var sprintf = require('sprintf-js').sprintf;

export default class LocationLogs extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Location Logs',
  };
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {dataSource: ds, refreshing: false};

    this.fetchData();
  }
  _onRefresh() {
    console.log("_onRefresh");
    this.setState({refreshing: true});
    this.fetchData().finally(() => {
      this.setState({refreshing: false});
    });
  }
  fetchData() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.location_log_files = [];
    return RNFS.readDir(RNFS.ExternalStorageDirectoryPath + "/TravelLogger/")
      .then((result) => {
        console.log('GOT RESULT', result);
        if (result.length > 0) {
          for (let file of result.reverse()) {
            this.location_log_files.push(file);
          }
          this.setState((prevState) => {
            prevState.dataSource = ds.cloneWithRows(this.location_log_files);
            return prevState;
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  formatFileSize(size) {
    var _size = size, _ext = "B";
    if (size > 1024) {
      const kb = size / 1024;
      _size = kb;
      _ext = "K";
      if (kb > 1024) {
        const mb = kb / 1024;
        _size = mb;
        _ext = "M";
        if (mb > 1024) {
          const gb = mb / 1024;
          _size = gb;
          _ext = "G";
        }
      }
    }
    return sprintf("%6.1f%s", _size, _ext);
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => (<Text>{this.formatFileSize(rowData.size)} {rowData.name}</Text>)}
          refreshControl = {
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      </View>
    );
  }
};
