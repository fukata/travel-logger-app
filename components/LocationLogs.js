import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ListView,
  RefreshControl,
  TouchableOpacity,
  PixelRatio,
  Alert
} from 'react-native';
import Share from 'react-native-share';

var RNFS = require('react-native-fs');
var sprintf = require('sprintf-js').sprintf;

const styles = StyleSheet.create({
  row: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  rowText: {
    width: '100%',
    alignSelf: 'center',
    textAlign: 'left',
  },
});

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
        }
        this.setState((prevState) => {
          prevState.dataSource = ds.cloneWithRows(this.location_log_files);
          return prevState;
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  deleteFile(path) {
    console.log("deleteFile", path);
    return RNFS.unlink(path);
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
  _onRowPress(file) {
    console.log("onRowPress", file);
    Alert.alert(
      file.name,
      '',
      [
        {text: 'Share', onPress: () => {
          console.log('Share', file.path);
          Share.open({
            url: "file://" + file.path,
            type: "application/octet-stream",
          });
        }},
        {text: 'Delete', onPress: () => {
          console.log('Delete', file.path);
          this.deleteFile(file.path)
            .finally(() => {
              this.fetchData();
            });

        }},
        {text: 'Close', onPress: () => {console.log('Close', file.path)}},
      ],
      { cancelable: true }
    );
  }
  render() {
    return (
      <View style={{flex:1}}>
        <ListView
          enableEmptySections={true}
          dataSource={this.state.dataSource}
          renderRow={
            (rowData) => (
              <TouchableOpacity onPress={() => {this._onRowPress(rowData)}} style={styles.row}>
                <Text style={styles.rowText}>{this.formatFileSize(rowData.size)} {rowData.name}</Text>
              </TouchableOpacity>
            )
          }
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
