import React, { Component } from 'react';
import {StyleSheet, AsyncStorage, DatePickerIOS, ScrollView, Dimensions} from 'react-native';

import Tabs from './../components/Tabs';

import {
  Image,
  ListView,
  Tile,
  Title,
  Subtitle,
  TouchableOpacity,
  Screen,
  Divider,
  Row,
  Icon,
  View,
  Caption,
  Button,
  Text,
  TextInput,
  DropDownMenu
} from '@shoutem/ui';

import * as firebase from 'firebase';
import Database from '../../database/Database';
import { connect } from 'react-redux';
import { navigatePop } from '../../reducers/redux';


import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const moment = require('moment');
const styles = {
  textInput: {
    height: 60,
    margin: 20
  },
  dropDown: {
    backgroundColor: 'white',
    textAlign: 'center'
  },
  row: {
    height: 40
  },
  textInputBigger: {
    height: 200,
    marginTop: 20,
    marginBottom: 30,
    width: width
  },
  saveButton: {
    backgroundColor: '#22C064',
    width: 60/100 * width,
    marginLeft: 20/100 * width,
    marginBottom: 20
  },
  saveButtonText: {
    color: 'white'
  }
}

class CreateHomeworkScene extends Component {
  static propTypes = {
    navigateBack: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      name: "",
      date: new Date(),
      today: new Date(),
      classes: [{
        name: "Loading ..."
      }],
      contents: "",
      studentId: ""
    }

    this.updateDate = this.updateDate.bind(this);
    this.saveHomework = this.saveHomework.bind(this);
  }

  async componentWillMount() {
    classes = await this.getClasses();
    this.setState({classes: classes});
    this.setState({selectedClass: classes[0]});
  }

  async getClasses() {
    try {
      let student = await AsyncStorage.getItem('currentStudent');
      let classes = await Database.getClassesForCurrentStudent(JSON.parse(student).year);

      this.setState({studentId: JSON.parse(student).uid});
      return classes.val();
    } catch(e) {
      console.log(e);
    }

  }

  updateDate(date) {
    this.setState({date: date});
  }

  saveHomework() {
    const { navigateBack } = this.props;

    var objectToSend = {
      name: this.state.name,
      dueDate: moment(this.state.date).format('M.DD.YYYY'),
      class: this.state.selectedClass.name,
      description: this.state.contents
    }

    if (objectToSend.name.length === 0) {
      alert("Homework title is mandatory!")
    }

    Database.saveHomeworkToStudentProfile(this.state.studentId, objectToSend).then(function(response) {
      navigateBack();
    }, function(error) {

    });
  }

  render() {
    return (
      <Screen>
        <NavigationBar title={this.props.homework.title} />
        <ScrollView>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Homework title</Text>
            </Row>
          </View>
          <View>
            <TextInput
              placeholder={'Title'}
              style = {styles.textInput}
              onChangeText = {(name) => this.setState({name: name})}
            />
          </View>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Class</Text>
            </Row>
          </View>
          <View>
            <DropDownMenu
              style={styles.dropDown}
              options={this.state.classes}
              selectedOption={this.state.selectedClass ? this.state.selectedClass : this.state.classes[0]}
              onOptionSelected={(clickedClass) => this.setState({ selectedClass: clickedClass })}
              titleProperty="name"
              valueProperty="name"
            />
          </View>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Due Date</Text>
            </Row>
          </View>
          <View>
            <DatePickerIOS
              date={this.state.date}
              onDateChange = {this.updateDate}
              mode="date"
              minimumDate = {this.state.today}
              />
          </View>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Description</Text>
            </Row>
          </View>
            <TextInput
              placeholder={'Homework contents'}
              style = {styles.textInputBigger}
              multiline={true}
              onChangeText={(contents) => this.setState({contents: contents})}
            />

            <Button styleName="light" style={styles.saveButton} onPress={() => this.saveHomework()}>
              <Icon name="comment" style={styles.saveButtonText}/>
              <Text style={styles.saveButtonText}>ADD NEW HOMEWORK</Text>
            </Button>
        </ScrollView>

      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  navigateBack: () => {
    dispatch(navigatePop());
  }
});

export default connect(
	undefined,
	mapDispatchToProps
)(CreateHomeworkScene);
