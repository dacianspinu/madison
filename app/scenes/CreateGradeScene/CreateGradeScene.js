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
    height: 60,
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

class CreateGradeScene extends Component {
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
      grade: 10,
      studentId: "",
      gradeTypes: [{
        name: "TEST"
      }, {
        name: "HOMEWORK"
      }, {
        name: "EXAM"
      }]
    }

    this.updateDate = this.updateDate.bind(this);
    this.saveGrade = this.saveGrade.bind(this);
  }

  async componentWillMount() {
    classes = await this.getClasses();
    this.setState({classes: classes});
    this.setState({selectedClass: classes[0]});
    this.setState({selectedGradeType: this.state.gradeTypes[0]})
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

  saveGrade() {
    const { navigateBack } = this.props;

    var objectToSend = {
      class: this.state.selectedClass.name,
      type: this.state.selectedGradeType.name,
      date: moment(this.state.date).format('D.MM.YYYY'),
      grade: this.state.grade
    }

    Database.saveGradeToStudentProfile(this.state.studentId, objectToSend).then(function(response) {
      navigateBack();
    }, function(error) {

    });
  }

  render() {
    return (
      <Screen>
        <NavigationBar title='Add new grade' />
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
              <Text>Type</Text>
            </Row>
          </View>
          <View>
            <DropDownMenu
              style={styles.dropDown}
              options={this.state.gradeTypes}
              selectedOption={this.state.selectedGradeType ? this.state.selectedGradeType : this.state.gradeTypes[0]}
              onOptionSelected={(clickedGradeType) => this.setState({ selectedGradeType: clickedGradeType })}
              titleProperty="name"
              valueProperty="name"
            />
          </View>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Date</Text>
            </Row>
          </View>
          <View>
            <DatePickerIOS
              date={this.state.date}
              onDateChange = {this.updateDate}
              mode="date"
              />
          </View>
          <View styleName="horizontal h-center">
            <Row styleName="small" style={styles.row}>
              <Icon name="web" />
              <Text>Given grade</Text>
            </Row>
          </View>
            <TextInput
              placeholder={'Write down your grade ... '}
              style = {styles.textInputBigger}
              multiline={false}
              onChangeText={(grade) => this.setState({grade: grade})}
            />

            <Button styleName="light" style={styles.saveButton} onPress={() => this.saveGrade()}>
              <Icon name="comment" style={styles.saveButtonText}/>
              <Text style={styles.saveButtonText}>ADD NEW GRADE</Text>
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
)(CreateGradeScene);
