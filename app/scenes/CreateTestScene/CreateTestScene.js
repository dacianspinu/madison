import React, { Component } from 'react';
import {StyleSheet, AsyncStorage, DatePickerIOS, ScrollView, Dimensions} from 'react-native';

import Tabs from './../components/Tabs';

import {
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
    width: width - 40,
    marginLeft: 20,
    marginRight: 20
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

class CreateTestScene extends Component {
  static propTypes = {
    navigateBack: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      today: new Date(),
      classes: [{
        name: "Loading ..."
      }],
      studentId: "",
      notes: ""
    }

    this.updateDate = this.updateDate.bind(this);
    this.saveTest = this.saveTest.bind(this);
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
      console.log(classes.val())
      return classes.val();
    } catch(e) {
      console.log(e);
    }

  }

  updateDate(date) {
    this.setState({date: date});
  }

  saveTest() {
    const { navigateBack } = this.props;

    var objectToSend = {
      class: this.state.selectedClass.name,
      dueDate: moment(this.state.date).format('M.DD.YYYY'),
      notes: this.state.notes
    }

    Database.saveTestToStudentProfile(this.state.studentId, objectToSend).then(function(response) {
      navigateBack();
    }, function(error) {

    });
  }

  render() {
    return (
      <Screen>
        <NavigationBar title='Add new test' />
          <ScrollView>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Course</Text>
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
              <Text>Notes</Text>
            </Row>
          </View>
            <TextInput
              placeholder={'Add a few details for this test if necessary ... '}
              style = {styles.textInputBigger}
              multiline={true}
              onChangeText={(notes) => this.setState({notes: notes})}
            />

            <Button styleName="light" style={styles.saveButton} onPress={() => this.saveTest()}>
              <Icon name="comment" style={styles.saveButtonText}/>
              <Text style={styles.saveButtonText}>ADD NEW TEST</Text>
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
)(CreateTestScene);
