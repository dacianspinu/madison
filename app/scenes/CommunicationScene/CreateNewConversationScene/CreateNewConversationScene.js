import React, { Component } from 'react';
import {Dimensions, StyleSheet, ScrollView, AsyncStorage} from 'react-native';

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
  DropDownMenu
} from '@shoutem/ui';

import * as firebase from 'firebase';

import { connect } from 'react-redux';
import { navigatePush } from '../../../reducers/redux';
import Database from '../../../database/Database';

import {
  NavigationBar,
} from '@shoutem/ui/navigation';

const width = Dimensions.get('window').width; //full width
const height = Dimensions.get('window').height; //full height


class CreateNewConversationScreen extends Component {
  static propTypes = {
    onButtonPress: React.PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      teachers: {
        lab: [{
          name: "Loading ..."
        }]
      }
    }
  }

  async componentWillMount() {
    await this.getTeachers();
  }

  async getTeachers() {
    let self = this;
    let student = await AsyncStorage.getItem('currentStudent');
    let promises = await Promise.all([Database.getLoggedInStudentGroupSchedule(JSON.parse(student).group, JSON.parse(student).year), Database.getTeachers()]);

    let schedule = promises[0].val().schedule;
    let teachers = promises[1].val();

    let groupTeachers = {
      lab: [],
      lecture: []
    };

    schedule.map(function(scheduleDay) {
      scheduleDay.map(function(scheduleItem) {
        if (scheduleItem.type === 'lecture') {
          scheduleItem.teacherId.map(function(teacherId) {
            let teacherFoundBefore = false;
            teacherFoundBefore = groupTeachers.lecture.some(function(groupTeacher) {
              if (groupTeacher.name === teachers[teacherId].name) {
                return true;
              }
            });
            if (!teacherFoundBefore) {
              teachers[teacherId].class = scheduleItem.name;
              groupTeachers.lecture.push(teachers[teacherId]);
            }
          })
        } else {
          scheduleItem.teacherId.map(function(teacherId) {
            let teacherFoundBefore = false;
            teacherFoundBefore = groupTeachers.lab.some(function(groupTeacher) {
              if (groupTeacher.name === teachers[teacherId].name) {
                return true;
              }
            });
            if (!teacherFoundBefore) {
              teachers[teacherId].class = scheduleItem.name;
              groupTeachers.lab.push(teachers[teacherId]);
            }
          })
        }
      });
    });

    self.setState({
      teachers: groupTeachers,
    });
  }

  render() {
    const { onButtonPress } = this.props;

    return (
      <Screen>
        <NavigationBar title="Start a new conversation"  />
          <ScrollView>
            <Row styleName="small">
              <Icon name="web" />
              <Text>Laboratory teachers</Text>
            </Row>
            <DropDownMenu
              options={this.state.teachers.lab}
              selectedOption={this.state.selectedTeacher ? this.state.selectedTeacher : this.state.teachers.lab[0]}
              onOptionSelected={(clickedClass) => this.setState({ selectedTeacher: clickedClass })}
              titleProperty="name"
              valueProperty="name"
            />
            <View styleName="horizontal h-center">
              <Button styleName="dark">
                <Icon name="edit" />
                <Text>Start</Text>
              </Button>
            </View>
          </ScrollView>
      </Screen>
    );
  }
};

const mapDispatchToProps = (dispatch) => ({
  onButtonPress: (type) => {
    dispatch(navigatePush({
      key: type.key,
      title: type.title,
    }, { type }));
  },
});

export default connect(
	undefined,
	mapDispatchToProps
)(CreateNewConversationScreen);
