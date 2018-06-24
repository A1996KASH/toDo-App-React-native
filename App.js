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
import List from './src/components/list.js'//Import Component List to display a single task 

export default class App extends Component {
  state = {
    tasks: [],
    taskText: '',

  }
  //state to manage Task Lists

  //Add note to states tasks
  addNotes = () => {
    if (this.state.taskText) {
      this.state.tasks.push(this.state.taskText);
      this.setState({ tasks: this.state.tasks });
      this.setState({ taskText: '' });
      this.storeItem('tasks', this.state.tasks);
    }
  }

// Store task in Asyncs storage
  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  //retrive Item from Async Storage
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




  //Delte method to remove task from state
  deleteMethod = (index) => {
    this.state.tasks.splice(index, 1);
    this.setState({ task: this.state.tasks });
    this.storeItem('tasks', this.state.tasks);
  }

  // Update state from Async storage
 componentDidMount() {
    this.retrieveItem('tasks').then((res) => {
      //this callback is executed when your Promise is resolved
      this.setState(previousState => {
        return { 
          ...previousState,
          tasks: res };
      });
    }).catch((error) => {
      //this callback is executed when your Promise is rejected
      console.log('Promise is rejected with error: ' + error);
    });
  } 
  render() {
    let task =null;
      task = <View style={{ alignItems: 'center', paddingTop: '50%' }}><Text style={{ color: '#000' }}>Your tasks Will come Here</Text></View>
    if(this.state.tasks.length != 0){
      task = this.state.tasks.map(((val, index) => {
        return <List key={index} keyval={index} task={val} deleteMethod={() => this.deleteMethod(index)} />
      }));
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
