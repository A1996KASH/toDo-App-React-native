/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  AsyncStorage,
  Button
} from 'react-native';
import List from './src/components/list.js'

export default class App extends Component {
  state = {
    tasks: [],
    taskText: '',

  }
  addNotes = () => {
    if (this.state.taskText) {
      this.state.tasks.push(this.state.taskText);
      this.setState({ tasks: this.state.tasks });
      this.setState({ taskText: '' });
      this.storeItem('tasks', this.state.tasks);
    }
  }


  async storeItem(key, item) {
    try {
      //we want to wait for the Promise returned by AsyncStorage.setItem()
      //to be resolved to the actual value before returning the value
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  async retrieveItem(key) {
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      const item = JSON.parse(retrievedItem);
      return item;
    } catch (error) {
      console.log(error.message);
    }
    return
  }




  deleteMethod = (index) => {
    this.state.tasks.splice(index, 1);
    this.setState({ task: this.state.tasks });
    this.storeItem('tasks', this.state.tasks);
  }
  componentDidMount() {
    this.retrieveItem('tasks').then((res) => {
      //this callback is executed when your Promise is resolved
      this.setState({ tasks: res })
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      console.log('Promise is rejected with error: ' + error);
    });
  }
  render() {
   
      let task = this.state.tasks.map(((val, index) => {
        return <List key={index} keyval={index} task={val} deleteMethod={() => this.deleteMethod(index)} />
      }));  
      if(this.state.tasks.length == 0){
       task = <View style={{alignItems: 'center',paddingTop:'50%'}}><Text style={{color: '#000'}}>Your tasks Will come Here</Text></View>
      }
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>To Do Tasks </Text>
        </View>
        <TextInput
          style={{ height: 90, padding: 30 }}
          onChangeText={(taskText) => this.setState({ taskText })}
          value={this.state.taskText}
          placeholder="Enter your Task Here"
          placeholderTextColor="#000">
        </TextInput>
        <Button
          title="Add Task"
          onPress={this.addNotes.bind(this)}
          disabled={!this.state.taskText}
        />
        <ScrollView style={styles.scrollView} >
          {task}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    padding: 26

  },
  scrollView: {
    flex: 1,
    marginBottom: 30,

  },
  addButton: {
    backgroundColor: 'red',
    width: 90,
    height: 90,
    alignItems: 'center',
    justifyContent: 'center'
  }
}
);
